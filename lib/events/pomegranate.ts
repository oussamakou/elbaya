import {randomUUID} from 'node:crypto';
import type {Client, Transaction} from '@libsql/client';
import {db} from '@/lib/shop/db';
import {queueNotification} from '@/lib/shop/notifications';
import {id, integer, object, ShopError, text} from '@/lib/shop/validation';
import {FAMILY_RELATIONS, MAX_FAMILY, MAX_FRIENDS, partyLineFr, type Party} from './party';

// Pomegranate Day, Sunday 1 November 2026, 3–7 pm at the farm in Testour.
// Guests send a request; the farm reviews each one and confirms personally.
export const EVENT_ID = 'pomegranate-day-2026';
export const EVENT = {
  title: 'Pomegranate Day · Farm Elbaya',
  when: 'Sunday 1 November, 3 – 7 pm',
  place: 'Farm Elbaya, Testour, Tunisia',
  maps: 'https://www.google.com/maps/search/?api=1&query=Farm+Elbaya+Testour+Tunisia',
  page: 'https://www.farmelbaya.com/en/pomegranate-day',
  details:
    'A day by Farm Elbaya for its community: walk the farm, pick your own pomegranates, taste our first products, and share the sunset from the rooftop.',
};
export const calendarLinks = {
  google:
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(EVENT.title)}&dates=20261101T140000Z/20261101T180000Z&ctz=Africa%2FTunis` +
    `&details=${encodeURIComponent(EVENT.details)}&location=${encodeURIComponent(EVENT.place)}`,
  outlook:
    'https://outlook.live.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent' +
    `&subject=${encodeURIComponent(EVENT.title)}&startdt=2026-11-01T14%3A00%3A00Z&enddt=2026-11-01T18%3A00%3A00Z` +
    `&body=${encodeURIComponent(EVENT.details)}&location=${encodeURIComponent(EVENT.place)}`,
};

export type GuestStatus = 'new' | 'confirmed' | 'waitlist' | 'declined';
export const GUEST_STATUSES: GuestStatus[] = ['new', 'confirmed', 'waitlist', 'declined'];
export type EmailKind = 'confirmed' | 'waitlist' | 'declined';
export type Guest = {
  id: string;
  revision: number;
  createdAt: string;
  updatedAt?: string;
  name: string;
  // Asked again with the WhatsApp number; a few requests from before have only the number.
  email: string;
  from: string;
  been: 'yes' | 'no';
  // WhatsApp number in international form, e.g. +21622123456.
  phone?: string;
  // When the owner opened a WhatsApp message for each decision.
  whatsapp?: Partial<Record<GuestStatus, string>>;
  // Who they bring (every person is part of the request) and their own message to the farm.
  party?: Party;
  guestNote?: string;
  status: GuestStatus;
  // Set when the request arrived after the confirmed list was already full.
  arrivedWhenFull?: boolean;
  checkedInAt?: string;
  ownerNote?: string;
  // Stored as queue timestamps; eventAdmin replaces these with provider acceptance receipts.
  emailed?: Partial<Record<EmailKind, string>>;
  emailPending?: Partial<Record<EmailKind, boolean>>;
};
export type EventSettings = {revision: number; open: boolean; capacity: number};
const DEFAULT_SETTINGS: EventSettings = {revision: 0, open: true, capacity: 200};
const MAX_GUESTS = 3000;

let ready: Promise<Client> | undefined;
async function store() {
  ready ??= (async () => {
    const client = await db();
    await client.batch(
      [
        'CREATE TABLE IF NOT EXISTS event_settings (id TEXT PRIMARY KEY, data TEXT NOT NULL)',
        // One request per contact per event: sending again returns the first request.
        // The `email` column holds the contact key: the email for early requests, 'wa:' + number since the WhatsApp form.
        'CREATE TABLE IF NOT EXISTS event_guests (id TEXT PRIMARY KEY, event TEXT NOT NULL, email TEXT NOT NULL, request_key TEXT UNIQUE NOT NULL, data TEXT NOT NULL, UNIQUE(event, email))',
        {sql: 'INSERT OR IGNORE INTO event_settings (id, data) VALUES (?, ?)', args: [EVENT_ID, JSON.stringify(DEFAULT_SETTINGS)]},
      ],
      'write',
    );
    return client;
  })().catch((error) => {
    ready = undefined;
    throw error;
  });
  return ready;
}

async function readSettings(c: Client | Transaction): Promise<EventSettings> {
  const r = await c.execute({sql: 'SELECT data FROM event_settings WHERE id=?', args: [EVENT_ID]});
  return r.rows.length ? {...DEFAULT_SETTINGS, ...JSON.parse(String(r.rows[0].data))} : DEFAULT_SETTINGS;
}
// Places are counted in people: each confirmed guest plus everyone they bring.
async function confirmedCount(c: Client | Transaction) {
  const r = await c.execute({
    sql: "SELECT COALESCE(SUM(1 + COALESCE(json_array_length(data,'$.party.people'),0)),0) AS n FROM event_guests WHERE event=? AND json_extract(data,'$.status')='confirmed'",
    args: [EVENT_ID],
  });
  return Number(r.rows[0].n);
}

// What the public page needs: whether requests are open, and whether the confirmed list is full.
export async function publicState() {
  const c = await store();
  const settings = await readSettings(c);
  return {open: settings.open, full: (await confirmedCount(c)) >= settings.capacity};
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function clean(value: unknown, max: number) {
  return text(value, max).replace(/\s+/g, ' ');
}

// WhatsApp number in international form. Eight digits are read as a Tunisian number.
export function whatsappNumber(value: unknown) {
  const raw = text(value, 30).replace(/[\s().\/-]/g, '');
  let digits: string;
  if (/^[2-9][0-9]{7}$/.test(raw)) digits = `216${raw}`;
  else if (/^\+[0-9]{8,15}$/.test(raw)) digits = raw.slice(1);
  else if (/^00[0-9]{8,15}$/.test(raw)) digits = raw.slice(2);
  else throw new ShopError('whatsapp');
  if (digits.startsWith('216') && !/^216[2-9][0-9]{7}$/.test(digits)) throw new ShopError('whatsapp');
  return `+${digits}`;
}

function partyInput(value: unknown): Party {
  if (value === undefined) return {type: 'alone', people: []};
  const o = object(value);
  const type = o.type;
  if (type !== 'alone' && type !== 'family' && type !== 'friend') throw new ShopError('invalid');
  if (type === 'alone') return {type, people: []};
  if (!Array.isArray(o.people)) throw new ShopError('invalid');
  const max = type === 'family' ? MAX_FAMILY : MAX_FRIENDS;
  if (o.people.length < 1 || o.people.length > max) throw new ShopError('party');
  const people = o.people.map((item) => {
    const person = object(item);
    const name = clean(person.name, 80);
    if (name.length < 2) throw new ShopError('party');
    const relation = person.relation;
    if (type === 'friend' ? relation !== 'friend' : !FAMILY_RELATIONS.includes(relation as never)) throw new ShopError('party');
    return {name, relation: relation as Party['people'][number]['relation']};
  });
  return {type, people};
}

export async function requestSpot(input: unknown) {
  const o = object(input);
  if (o.website) throw new ShopError('invalid'); // hidden field filled by a bot
  const name = clean(o.name, 80);
  const phone = whatsappNumber(o.phone);
  const email = clean(o.email, 254).toLowerCase();
  const from = clean(o.from, 80);
  if (name.length < 2 || from.length < 2) throw new ShopError('invalid');
  if (!EMAIL.test(email)) throw new ShopError('email');
  if (o.been !== 'yes' && o.been !== 'no') throw new ShopError('invalid');
  const party = partyInput(o.party);
  const guestNote = o.note === undefined ? '' : text(o.note, 600, false).trim();
  const contactKey = `wa:${phone}`;
  const requestKey = id(o.requestKey);

  const tx = await (await store()).transaction('write');
  try {
    const existing = await tx.execute({
      sql: "SELECT data FROM event_guests WHERE request_key=? OR (event=? AND (email=? OR email=? OR json_extract(data,'$.phone')=? OR json_extract(data,'$.email')=?)) LIMIT 1",
      args: [requestKey, EVENT_ID, contactKey, email, phone, email],
    });
    if (existing.rows.length) {
      const guest = JSON.parse(String(existing.rows[0].data)) as Guest;
      return {id: guest.id, already: true, waitlist: guest.status === 'waitlist'};
    }
    const settings = await readSettings(tx);
    if (!settings.open) throw new ShopError('event_closed', 409);
    const total = await tx.execute({sql: 'SELECT COUNT(*) AS n FROM event_guests WHERE event=?', args: [EVENT_ID]});
    if (Number(total.rows[0].n) >= MAX_GUESTS) throw new ShopError('event_closed', 409);
    const full = (await confirmedCount(tx)) >= settings.capacity;
    const guest: Guest = {
      id: `PD-${randomUUID().slice(0, 6).toUpperCase()}`,
      revision: 0,
      createdAt: new Date().toISOString(),
      name,
      email,
      from,
      been: o.been,
      phone,
      party,
      ...(guestNote ? {guestNote} : {}),
      status: full ? 'waitlist' : 'new',
      ...(full ? {arrivedWhenFull: true} : {}),
    };
    await tx.execute({
      sql: 'INSERT INTO event_guests (id, event, email, request_key, data) VALUES (?,?,?,?,?)',
      args: [guest.id, EVENT_ID, contactKey, requestKey, JSON.stringify(guest)],
    });
    await queueNotification(tx, `event-${guest.id}`, {
      subject: `Pomegranate Day · Nouvelle demande · ${guest.name}`,
      text: [
        `Demande ${guest.id}${full ? ' (liste confirmée complète : placée en liste d’attente)' : ''}`,
        `Nom : ${guest.name}`,
        `WhatsApp : ${guest.phone}`,
        ...(guest.email ? [`Email : ${guest.email}`] : []),
        `Vient de : ${guest.from}`,
        `Déjà venu à la ferme : ${guest.been === 'yes' ? 'oui' : 'non, première fois'}`,
        partyLineFr(guest.party),
        ...(guest.guestNote ? ['', `Son message : ${guest.guestNote}`] : []),
        '',
        'Confirmez ou répondez depuis l’onglet Pomegranate Day :',
        'https://www.farmelbaya.com/fr/admin',
      ].join('\n'),
      ...(guest.email ? {reply_to: guest.email} : {}),
    });
    await tx.commit();
    return {id: guest.id, already: false, waitlist: full};
  } finally {
    tx.close();
  }
}

// ——— Owner side ———

export async function eventAdmin() {
  const c = await store();
  const rows = await c.execute({
    sql: 'SELECT data FROM event_guests WHERE event=? ORDER BY rowid DESC LIMIT ?',
    args: [EVENT_ID, MAX_GUESTS],
  });
  // Queue receipts are authoritative, including emails queued by older versions.
  const messages = await c.execute("SELECT id, sent_at FROM shop_notifications WHERE id LIKE 'event-mail-%' ORDER BY rowid");
  const guests = rows.rows.map((r) => ({...JSON.parse(String(r.data)), emailed: {}, emailPending: {}} as Guest));
  const byId = new Map(guests.map((g) => [g.id, g]));
  for (const message of messages.rows) {
    const match = /^event-mail-(PD-[A-Z0-9-]+)-(confirmed|waitlist|declined)-/.exec(String(message.id));
    if (!match) continue;
    const guest = byId.get(match[1]);
    if (!guest) continue;
    const kind = match[2] as EmailKind;
    if (message.sent_at === null) guest.emailPending![kind] = true;
    else guest.emailed![kind] = new Date(Number(message.sent_at)).toISOString();
  }
  return {
    settings: await readSettings(c),
    guests,
    // Guest emails need the same Resend setup as the owner alerts.
    emailReady: Boolean(process.env.RESEND_API_KEY && process.env.SHOP_EMAIL_FROM && process.env.SHOP_NOTIFY_EMAIL),
  };
}

export async function saveEventSettings(input: unknown) {
  const o = object(input);
  if (typeof o.open !== 'boolean') throw new ShopError('invalid');
  const capacity = integer(o.capacity, 1, MAX_GUESTS);
  const revision = integer(o.revision, 0);
  const c = await store();
  const next: EventSettings = {revision: revision + 1, open: o.open, capacity};
  const r = await c.execute({
    sql: "UPDATE event_settings SET data=? WHERE id=? AND json_extract(data,'$.revision')=?",
    args: [JSON.stringify(next), EVENT_ID, revision],
  });
  if (!r.rowsAffected) throw new ShopError('conflict', 409);
  return next;
}

async function loadGuest(c: Client | Transaction, guestId: string) {
  const r = await c.execute({sql: 'SELECT data FROM event_guests WHERE id=? AND event=?', args: [guestId, EVENT_ID]});
  if (!r.rows.length) throw new ShopError('not_found', 404);
  return JSON.parse(String(r.rows[0].data)) as Guest;
}
async function writeGuest(c: Client | Transaction, guest: Guest, expected: number) {
  const next = {...guest, revision: expected + 1, updatedAt: new Date().toISOString()};
  const r = await c.execute({
    sql: "UPDATE event_guests SET data=? WHERE id=? AND json_extract(data,'$.revision')=?",
    args: [JSON.stringify(next), guest.id, expected],
  });
  if (!r.rowsAffected) throw new ShopError('conflict', 409);
  return next;
}
function status(value: unknown): GuestStatus {
  if (!GUEST_STATUSES.includes(value as GuestStatus)) throw new ShopError('invalid');
  return value as GuestStatus;
}

// One guest: status, private note, check-in on the day.
export async function updateGuest(input: unknown) {
  const o = object(input);
  const c = await store();
  const guest = await loadGuest(c, id(o.id));
  const expected = integer(o.revision, 0);
  if (guest.revision !== expected) throw new ShopError('conflict', 409);
  if (o.status !== undefined) guest.status = status(o.status);
  if (o.ownerNote !== undefined) {
    const note = text(o.ownerNote, 1000, false);
    if (note) guest.ownerNote = note;
    else delete guest.ownerNote;
  }
  // The owner opened a WhatsApp message for this decision.
  if (o.whatsappSent !== undefined) guest.whatsapp = {...guest.whatsapp, [status(o.whatsappSent)]: new Date().toISOString()};
  if (o.checkedIn !== undefined) {
    if (typeof o.checkedIn !== 'boolean') throw new ShopError('invalid');
    if (o.checkedIn) guest.checkedInAt ??= new Date().toISOString();
    else delete guest.checkedInAt;
  }
  return writeGuest(c, guest, expected);
}

function ids(value: unknown) {
  if (!Array.isArray(value) || !value.length || value.length > MAX_GUESTS) throw new ShopError('invalid');
  return [...new Set(value.map(id))];
}

// Many guests at once (from a selection in the dashboard).
export async function bulkStatus(input: unknown) {
  const o = object(input);
  const next = status(o.status);
  const list = ids(o.ids);
  const tx = await (await store()).transaction('write');
  try {
    for (const guestId of list) {
      const guest = await loadGuest(tx, guestId);
      if (guest.status !== next) await writeGuest(tx, {...guest, status: next}, guest.revision);
    }
    await tx.commit();
    return {updated: list.length};
  } finally {
    tx.close();
  }
}

export async function removeGuest(input: unknown) {
  const guestId = id(object(input).id);
  await (await store()).execute({sql: 'DELETE FROM event_guests WHERE id=? AND event=?', args: [guestId, EVENT_ID]});
  return {id: guestId};
}

function firstName(name: string) {
  return name.split(' ')[0] || name;
}
export function guestEmail(guest: Guest, kind: EmailKind) {
  const hello = `Hello ${firstName(guest.name)},`;
  const sign = ['', 'See you on the land,', 'Farm Elbaya', 'https://www.farmelbaya.com'];
  if (kind === 'confirmed')
    return {
      subject: 'Pomegranate Day · Your spot is confirmed',
      text: [
        hello,
        '',
        'We are happy to welcome you to Pomegranate Day at Farm Elbaya.',
        '',
        EVENT.when,
        'Farm Elbaya, Testour',
        `Find the farm: ${EVENT.maps}`,
        `Add it to your calendar: ${calendarLinks.google}`,
        '',
        'We start at 3 pm with a walk through the farm, then the harvest and the tasting, and we end on the rooftop for the sunset.',
        'If your plans change, simply reply to this email so we can offer your spot to someone else.',
        ...sign,
      ].join('\n'),
    };
  if (kind === 'waitlist')
    return {
      subject: 'Pomegranate Day · You are on our waiting list',
      text: [
        hello,
        '',
        'Thank you for wanting to join Pomegranate Day. Places are limited and they are all taken for now, so we have kept you on our waiting list.',
        'If a spot opens, we will write to you straight away.',
        ...sign,
      ].join('\n'),
    };
  return {
    subject: 'Pomegranate Day · Thank you',
    text: [
      hello,
      '',
      'Thank you for wanting to join Pomegranate Day. This time all the places are taken, and we could not offer you one.',
      'We have kept your details, and you will be among the first to hear about our next day at the farm.',
      ...sign,
    ].join('\n'),
  };
}

// Queue the email that matches each guest's current status. Guests already sent that email are skipped
// unless `again` is true. Emails go out through the site's existing email queue.
export async function emailGuests(input: unknown) {
  const o = object(input);
  const list = ids(o.ids);
  const again = o.again === true;
  const tx = await (await store()).transaction('write');
  let queued = 0;
  try {
    for (const guestId of list) {
      const guest = await loadGuest(tx, guestId);
      if (guest.status === 'new' || !guest.email) continue;
      const kind: EmailKind = guest.status;
      const prefix = `event-mail-${guest.id}-${kind}-`;
      const pending = await tx.execute({sql: 'SELECT id FROM shop_notifications WHERE substr(id,1,?)=? AND sent_at IS NULL LIMIT 1', args: [prefix.length, prefix]});
      if (pending.rows.length) continue;
      if (guest.emailed?.[kind] && !again) continue;
      const stamp = new Date().toISOString();
      await queueNotification(tx, `${prefix}${randomUUID()}`, {
        ...guestEmail(guest, kind),
        to: [guest.email],
        ...(process.env.SHOP_NOTIFY_EMAIL ? {reply_to: process.env.SHOP_NOTIFY_EMAIL} : {}),
      });
      await writeGuest(tx, {...guest, emailed: {...guest.emailed, [kind]: stamp}}, guest.revision);
      queued++;
    }
    await tx.commit();
    return {queued};
  } finally {
    tx.close();
  }
}
