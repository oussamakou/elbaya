import { randomUUID } from "node:crypto";
import { db } from "./db";
import { id, object, ShopError, text } from "./validation";
import type { Product, WaitlistEntry } from "./types";

// Canonical 8-digit local number, so "+216 22 123 456" and "22123456" are one person.
export function localPhone(value: unknown) {
  const phone = text(value, 30).replace(/[\s().-]/g, "");
  const match = /^(?:\+216|00216)?([2-9][0-9]{7})$/.exec(phone);
  if (!match) throw new ShopError("phone");
  return match[1];
}

// Back-in-stock list: visitors leave a name and phone to hear first when a product returns.
// Signing up twice for the same product keeps the first entry and reports success.
export async function joinWaitlist(input: unknown) {
  const o = object(input);
  if (o.website) throw new ShopError("invalid");
  if (o.consent !== true) throw new ShopError("consent");
  const firstName = text(o.firstName, 80);
  const phone = localPhone(o.phone);
  const email = text(o.email ?? "", 254, false);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ShopError("email");
  const productId = id(o.productId);
  const requestKey = id(o.requestKey);
  const tx = await (await db()).transaction("write");
  try {
    const found = await tx.execute({ sql: "SELECT data FROM shop_products WHERE id=?", args: [productId] });
    if (!found.rows.length) throw new ShopError("stock", 409);
    const product = JSON.parse(String(found.rows[0].data)) as Product;
    if (product.status === "draft") throw new ShopError("stock", 409);
    const existing = await tx.execute({
      sql: "SELECT data FROM shop_waitlist WHERE request_key=? OR (product_id=? AND phone=?) LIMIT 1",
      args: [requestKey, productId, phone],
    });
    if (existing.rows.length) {
      const entry = JSON.parse(String(existing.rows[0].data)) as WaitlistEntry;
      return { id: entry.id, already: true };
    }
    const entry: WaitlistEntry = {
      id: `ATT-${randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      productId,
      productName: product.name.fr,
      firstName,
      phone,
      email,
    };
    await tx.execute({
      sql: "INSERT INTO shop_waitlist(id,request_key,product_id,phone,data) VALUES (?,?,?,?,?)",
      args: [entry.id, requestKey, productId, phone, JSON.stringify(entry)],
    });
    await tx.commit();
    return { id: entry.id, already: false };
  } finally {
    tx.close();
  }
}

export async function waitlist() {
  return (
    await (await db()).execute("SELECT data FROM shop_waitlist ORDER BY rowid DESC LIMIT 2000")
  ).rows.map((row) => JSON.parse(String(row.data)) as WaitlistEntry);
}

// People still waiting per product (not yet told it is back); shown publicly as social proof.
export async function waitlistCounts() {
  const result = await (await db()).execute(
    "SELECT product_id, COUNT(*) AS n FROM shop_waitlist WHERE json_extract(data,'$.notifiedAt') IS NULL GROUP BY product_id",
  );
  return Object.fromEntries(result.rows.map((row) => [String(row.product_id), Number(row.n)])) as Record<string, number>;
}

export async function updateWaitlist(input: unknown) {
  const o = object(input),
    entryId = id(o.id);
  if (typeof o.notified !== "boolean") throw new ShopError("invalid");
  const client = await db();
  const found = await client.execute({ sql: "SELECT data FROM shop_waitlist WHERE id=?", args: [entryId] });
  if (!found.rows.length) throw new ShopError("not_found", 404);
  const entry = JSON.parse(String(found.rows[0].data)) as WaitlistEntry;
  if (o.notified) entry.notifiedAt ??= new Date().toISOString();
  else delete entry.notifiedAt;
  await client.execute({ sql: "UPDATE shop_waitlist SET data=? WHERE id=?", args: [JSON.stringify(entry), entryId] });
  return entry;
}

// Removal on the person's request; the entry is deleted, not hidden.
export async function removeWaitlist(input: unknown) {
  const entryId = id(object(input).id);
  await (await db()).execute({ sql: "DELETE FROM shop_waitlist WHERE id=?", args: [entryId] });
  return { id: entryId };
}
