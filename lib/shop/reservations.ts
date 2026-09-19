import { createHash, randomUUID } from "node:crypto";
import { db } from "./db";
import { queueNotification, reservationMessage } from './notifications';
import { id, integer, object, ShopError, text } from "./validation";
import type { Product, ReservationRequest } from "./types";
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
  const governorate = text(o.governorate, 80);
  const city = text(o.city, 100);
  const streetAddress = text(o.address, 500);
  const data = {
    firstName,
    lastName,
    phone,
    email,
    governorate,
    city,
    streetAddress,
    address: [streetAddress, city, governorate].join(", "),
    notes: text(o.notes ?? "", 1000, false),
    productId: id(o.productId),
    variantId: id(o.variantId),
    quantity: integer(o.quantity, 1, 99),
  };
  const requestKey = id(o.requestKey),
    hash = createHash("sha256").update(JSON.stringify(data)).digest("hex");
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
    if (product.status === "draft" || !variant)
      throw new ShopError("stock", 409);
    const reservation: ReservationRequest = {
      ...data,
      id: `PRE-${randomUUID().slice(0, 8).toUpperCase()}`,
      revision: 0,
      createdAt: new Date().toISOString(),
      status: "new",
      productName: product.name.fr,
      size: variant.label,
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
