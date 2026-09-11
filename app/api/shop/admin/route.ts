import { checkOrigin, requireAdmin } from "@/lib/shop/auth";
import {
  catalogue,
  orders,
  saveProduct,
  saveSettings,
  updateOrder,
} from "@/lib/shop/service";
import { body, failure, json } from "@/lib/shop/http";
import { object, ShopError } from "@/lib/shop/validation";
import { reservations, updateReservation } from "@/lib/shop/reservations";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await requireAdmin();
    return json({
      ...(await catalogue(true)),
      orders: await orders(),
      reservations: await reservations(),
    });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await requireAdmin();
    const input = object(await body(request));
    if (input.action === "product") return json(await saveProduct(input.data));
    if (input.action === "settings")
      return json(await saveSettings(input.data));
    if (input.action === "order") return json(await updateOrder(input.data));
    if (input.action === "reservation")
      return json(await updateReservation(input.data));
    throw new ShopError("invalid");
  } catch (e) {
    return failure(e);
  }
}
