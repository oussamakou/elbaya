import type { Transaction } from "@libsql/client";
import { db } from "./db";
import { integer, object, ShopError, text } from "./validation";
import type { PromoCode } from "./types";
import { promoDiscount } from "./harvest";

// Promo codes apply to harvest requests. End dates are farm-local calendar days, inclusive.
const tunisToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Tunis" }).format(new Date());

export function normalizeCode(value: unknown) {
  const code = text(value, 30).toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z0-9-]{3,20}$/.test(code)) throw new ShopError("promo_invalid");
  return code;
}
function usable(promo: PromoCode) {
  return (
    promo.active &&
    (promo.maxUses === null || promo.uses < promo.maxUses) &&
    (!promo.endsOn || promo.endsOn >= tunisToday())
  );
}
async function find(tx: Pick<Transaction, "execute">, code: string) {
  const result = await tx.execute({ sql: "SELECT data FROM shop_promos WHERE code=?", args: [code] });
  return result.rows.length ? (JSON.parse(String(result.rows[0].data)) as PromoCode) : null;
}

// Public preview for the request form; it never counts a use.
export async function checkPromo(input: unknown) {
  const o = object(input);
  const code = normalizeCode(o.code);
  const subtotal = integer(o.subtotal, 1, 100000000);
  const promo = await find(await db(), code);
  if (!promo || !usable(promo)) throw new ShopError("promo_invalid", 404);
  return { code, kind: promo.kind, value: promo.value, discount: promoDiscount(subtotal, promo) };
}

// Inside the request transaction: re-check the code and count one use atomically with the request.
export async function redeemPromo(tx: Transaction, code: string, subtotal: number) {
  const promo = await find(tx, code);
  if (!promo || !usable(promo)) throw new ShopError("promo_invalid", 409);
  promo.uses += 1;
  await tx.execute({ sql: "UPDATE shop_promos SET data=? WHERE code=?", args: [JSON.stringify(promo), code] });
  return promoDiscount(subtotal, promo);
}

export async function promos() {
  return (await (await db()).execute("SELECT data FROM shop_promos ORDER BY rowid DESC")).rows.map(
    (row) => JSON.parse(String(row.data)) as PromoCode,
  );
}

// Create or edit a code. Usage counts and creation date are kept from the stored code.
export async function savePromo(input: unknown) {
  const o = object(input);
  const code = normalizeCode(o.code);
  if (o.kind !== "percent" && o.kind !== "amount") throw new ShopError("invalid");
  const value = o.kind === "percent" ? integer(o.value, 1, 90) : integer(o.value, 100, 1000000);
  const maxUses = o.maxUses === null || o.maxUses === undefined ? null : integer(o.maxUses, 1, 100000);
  const endsOn = o.endsOn === null || o.endsOn === undefined || o.endsOn === "" ? null : text(o.endsOn, 10);
  if (endsOn) {
    const day = new Date(`${endsOn}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(endsOn) || Number.isNaN(day.getTime()) || day.toISOString().slice(0, 10) !== endsOn)
      throw new ShopError("invalid");
  }
  if (typeof o.active !== "boolean") throw new ShopError("invalid");
  const tx = await (await db()).transaction("write");
  try {
    const previous = await find(tx, code);
    const promo: PromoCode = {
      code,
      kind: o.kind,
      value,
      active: o.active,
      maxUses,
      uses: previous?.uses ?? 0,
      endsOn,
      createdAt: previous?.createdAt ?? new Date().toISOString(),
    };
    await tx.execute({
      sql: "INSERT INTO shop_promos(code,data) VALUES (?,?) ON CONFLICT(code) DO UPDATE SET data=excluded.data",
      args: [code, JSON.stringify(promo)],
    });
    await tx.commit();
    return promo;
  } finally {
    tx.close();
  }
}
