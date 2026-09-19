import type {Transaction} from '@libsql/client';
import {randomUUID} from 'node:crypto';
import {db} from './db';
import {money, type Order, type ReservationRequest} from './types';

type Message = {subject: string; text: string};
const dashboard = 'https://www.farmelbaya.com/fr/admin';

export function orderMessage(order: Order): Message {
  return {
    subject: `El Baya · Nouvelle ${order.items.some(i => i.fulfillment === 'preorder') ? 'précommande' : 'commande'} ${order.id}`,
    text: [
      `Commande ${order.id}`, `Client : ${order.customer.name}`,
      `Téléphone : ${order.customer.phone}`, `Adresse : ${order.customer.address}`,
      `Zone : ${order.zone}`, '',
      ...order.items.map(i => `${i.quantity} × ${i.name} · ${i.label} — ${money(i.price * i.quantity)}${i.fulfillment === 'preorder' ? ` (précommande : ${i.availability || 'à confirmer'})` : ''}`),
      '', `Livraison : ${money(order.deliveryFee)}`, `Total : ${money(order.total)}`,
      'Paiement à la livraison — aucun paiement reçu en ligne.',
      `Notes : ${order.customer.notes || 'Aucune'}`, '',
      'Appelez le client pour confirmer la commande et organiser la livraison.', dashboard,
    ].join('\n'),
  };
}

export function reservationMessage(r: ReservationRequest): Message {
  return {
    subject: `El Baya · Demande de précommande ${r.id}`,
    text: [
      `Demande ${r.id}`, `Client : ${r.firstName} ${r.lastName}`,
      `Téléphone : ${r.phone}`, `Adresse : ${r.address}`,
      ...(r.email ? [`Email : ${r.email}`] : []), '',
      `${r.quantity} × ${r.productName} · ${r.size}`, `Notes : ${r.notes || 'Aucune'}`, '',
      'Prix, disponibilité et livraison à confirmer par téléphone. Cette demande ne réserve pas automatiquement le stock.',
      dashboard,
    ].join('\n'),
  };
}

// Insert in the same transaction as the order, so accepted orders cannot lose their alert.
export async function queueNotification(tx: Transaction, id: string, message: Message) {
  await tx.execute({sql: 'INSERT OR IGNORE INTO shop_notifications(id,data) VALUES (?,?)', args: [id, JSON.stringify(message)]});
}

function config() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.SHOP_EMAIL_FROM;
  const to = process.env.SHOP_NOTIFY_EMAIL;
  return key && from && to ? {key, from, to} : null;
}

export async function notificationStatus() {
  const result = await (await db()).execute('SELECT COUNT(*) AS pending FROM shop_notifications WHERE sent_at IS NULL');
  return {configured: Boolean(config()), pending: Number(result.rows[0].pending)};
}

// Retry pending alerts on subsequent submissions and authenticated dashboard visits.
// A lease prevents concurrent requests sending the same alert. Resend also deduplicates retries.
export async function flushNotifications() {
  const settings = config();
  if (!settings) return;
  try {
    const client = await db();
    const now = Date.now();
    const rows = await client.execute({sql: 'SELECT id FROM shop_notifications WHERE sent_at IS NULL AND next_attempt <= ? ORDER BY rowid LIMIT 3', args: [now]});
    for (const row of rows.rows) {
      const token = randomUUID();
      const claimed = await client.execute({
        sql: 'UPDATE shop_notifications SET lease=?,next_attempt=? WHERE id=? AND sent_at IS NULL AND next_attempt <= ? RETURNING data',
        args: [token, Date.now() + 60000, String(row.id), Date.now()],
      });
      if (!claimed.rows.length) continue;
      try {
        const message = JSON.parse(String(claimed.rows[0].data)) as Message;
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST', signal: AbortSignal.timeout(8000),
          headers: {'Authorization': `Bearer ${settings.key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `shop-alert-${row.id}`},
          body: JSON.stringify({from: settings.from, to: [settings.to], ...message}),
        });
        if (!response.ok) throw new Error('Email provider rejected notification');
        const result = await response.json();
        if (typeof result.id !== 'string' || !result.id) throw new Error('Email provider returned no receipt');
        await client.execute({sql: 'UPDATE shop_notifications SET sent_at=?,data=? WHERE id=? AND lease=?', args: [Date.now(), '{}', String(row.id), token]});
      } catch {
        // No credentials, addresses or customer details in logs. The dashboard exposes pending count.
        console.error('Shop email pending; delivery will be retried.');
      }
    }
  } catch {
    console.error('Shop email queue unavailable; orders remain saved.');
  }
}
