import { createHash, randomUUID } from "node:crypto";
import { db } from "./db";
import { queueNotification, reservationMessage } from './notifications';
import { id, integer, object, ShopError, text } from "./validation";
import type { Product, ReservationRequest } from "./types";
import {harvestQuote, harvestOffer, packQuote, pickupLabel, pricingMode, requestable, saleState, selectionLabel, type HarvestSelection} from './harvest';
import {normalizeCode, redeemPromo} from './promo';
export async function createReservation(input: unknown) {
  const o = object(input);
  if (o.website) throw new ShopError("invalid");
  const firstName = text(o.firstName, 80),
    lastName = text(o.lastName, 80);
  const phone = text(o.phone, 30).replace(/[\s().-]/g, "");
  if (!/^(?:\+216|00216)?[2-9][0-9]{7}$/.test(phone))
    throw new ShopError("phone");
  const email = text(o.email ?? "", 254, false);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new ShopError("email");
  // Pickup requests (every product page): weight for pomegranates, packs for the rest.
  // Requests without a pickup come from the older address form and stay accepted for open pages.
  const pickup = o.pickup === undefined ? undefined : String(o.pickup);
  if (pickup !== undefined && pickup !== 'farm' && pickup !== 'tunis') throw new ShopError('invalid');
  const kg = o.harvestKg === undefined ? undefined : integer(o.harvestKg, 5, 500);
  if (kg !== undefined && (kg % 5 || !pickup)) throw new ShopError('invalid');
  const quantity = integer(o.quantity ?? 1, 1, 99);
  const promoCode = o.promoCode === undefined || o.promoCode === '' ? undefined : normalizeCode(o.promoCode);
  if (promoCode && !pickup) throw new ShopError('invalid');
  const expectedTotal = pickup ? integer(o.expectedTotal) : undefined;
  const place = pickup as 'farm' | 'tunis' | undefined;
  const governorate = place ? '' : text(o.governorate, 80);
  const city = place ? (place === 'farm' ? 'Testour' : 'Tunis') : text(o.city, 100);
  const streetAddress = place ? pickupLabel(place) : text(o.address ?? "", 500, false);
  const data: Omit<ReservationRequest, 'id' | 'revision' | 'createdAt' | 'status' | 'productName' | 'size'> = {
    firstName,
    lastName,
    phone,
    email,
    governorate,
    city,
    streetAddress,
    address: place ? streetAddress : [streetAddress, city, governorate].filter(Boolean).join(", "),
    notes: text(o.notes ?? "", 1000, false),
    productId: id(o.productId),
    variantId: id(o.variantId),
    quantity: kg !== undefined ? 1 : quantity,
  };
  const requestKey = id(o.requestKey),
    hash = createHash("sha256").update(JSON.stringify(place?{...data,kg,pickup:place,expectedTotal,promoCode}:data)).digest("hex");
  const tx = await (await db()).transaction("write");
  try {
    const old = await tx.execute({
      sql: "SELECT request_hash,data FROM shop_reservations WHERE request_key=?",
      args: [requestKey],
    });
    if (old.rows.length) {
      if (old.rows[0].request_hash !== hash)
        throw new ShopError("conflict", 409);
      return JSON.parse(String(old.rows[0].data)) as ReservationRequest;
    }
    const found = await tx.execute({
      sql: "SELECT data FROM shop_products WHERE id=?",
      args: [data.productId],
    });
    if (!found.rows.length) throw new ShopError("stock", 409);
    const product = JSON.parse(String(found.rows[0].data)) as Product;
    const variant = product.variants.find((v) => v.id === data.variantId);
    const state = saleState(product);
    if (state === "hidden" || !variant) throw new ShopError("stock", 409);
    // Only Commande and Précommande take requests; Épuisé offers the waitlist instead.
    if (!requestable(product)) throw new ShopError("closed", 409);
    let size = variant.label;
    if (place) {
      const offer = harvestOffer(product);
      if (place === 'farm' ? !offer.pickupFarm : !offer.pickupTunis) throw new ShopError('zone', 409);
      const weight = pricingMode(product) === 'weight';
      if (weight !== (kg !== undefined)) throw new ShopError('invalid');
      if (!weight && variant.price <= 0) throw new ShopError('stock', 409);
      const quote = weight ? harvestQuote(kg!, offer) : packQuote(variant, quantity);
      // The use is counted in this transaction, so a rejected request never spends the code.
      const discount = promoCode ? await redeemPromo(tx, promoCode, quote.total) : 0;
      if (expectedTotal !== quote.total - discount) throw new ShopError('price_changed', 409);
      const availability = state === 'preorder' ? product.preorderNote?.fr || '' : '';
      data.harvest = {
        ...quote,
        pickup: place,
        ...(promoCode ? {subtotal: quote.total, discount, promoCode, total: quote.total - discount} : {}),
        ...(state === 'preorder' ? {preorder: true, ...(availability ? {availability} : {})} : {}),
      } as HarvestSelection;
      size = selectionLabel(data.harvest);
    }
    const reservation: ReservationRequest = {
      ...data,
      id: `PRE-${randomUUID().slice(0, 8).toUpperCase()}`,
      revision: 0,
      createdAt: new Date().toISOString(),
      status: "new",
      productName: product.name.fr,
      size,
    };
    await tx.execute({
      sql: "INSERT INTO shop_reservations(id,request_key,request_hash,data) VALUES (?,?,?,?)",
      args: [reservation.id, requestKey, hash, JSON.stringify(reservation)],
    });
    await queueNotification(tx, reservation.id, reservationMessage(reservation));
    await tx.commit();
    return reservation;
  } finally {
    tx.close();
  }
}
export async function reservations() {
  return (
    await (
      await db()
    ).execute(
      "SELECT data FROM shop_reservations ORDER BY rowid DESC LIMIT 500",
    )
  ).rows.map((r) => JSON.parse(String(r.data)) as ReservationRequest);
}
export async function updateReservation(input: unknown) {
  const o = object(input),
    requestId = id(o.id),
    revision = integer(o.revision),
    status = text(o.status, 20);
  if (!["new", "contacted", "confirmed", "cancelled"].includes(status))
    throw new ShopError("invalid");
  // Optional so an admin page opened before these fields existed still saves status only.
  const ownerNote = o.ownerNote === undefined ? undefined : text(o.ownerNote, 1000, false);
  const pickupDate = o.pickupDate === undefined ? undefined : text(o.pickupDate, 10, false);
  if (pickupDate) {
    // Rejects impossible days such as 2026-02-31 instead of rolling them over.
    const day = new Date(`${pickupDate}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate) || Number.isNaN(day.getTime()) || day.toISOString().slice(0, 10) !== pickupDate)
      throw new ShopError("invalid");
  }
  const tx = await (await db()).transaction("write");
  try {
    const result = await tx.execute({
      sql: "SELECT data FROM shop_reservations WHERE id=?",
      args: [requestId],
    });
    if (!result.rows.length) throw new ShopError("not_found", 404);
    const data = JSON.parse(String(result.rows[0].data)) as ReservationRequest;
    if (data.revision !== revision) throw new ShopError("conflict", 409);
    data.revision++;
    data.status = status as ReservationRequest["status"];
    if (ownerNote !== undefined) data.ownerNote = ownerNote;
    if (pickupDate !== undefined) data.pickupDate = pickupDate;
    await tx.execute({
      sql: "UPDATE shop_reservations SET data=? WHERE id=?",
      args: [JSON.stringify(data), data.id],
    });
    await tx.commit();
    return data;
  } finally {
    tx.close();
  }
}
