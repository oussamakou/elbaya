import { checkOrigin, requireAdmin } from "@/lib/shop/auth";
import {after} from 'next/server';
import {flushNotifications, notificationStatus} from '@/lib/shop/notifications';
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
import {contacts} from '@/lib/shop/contact';
import {removeWaitlist, updateWaitlist, waitlist} from '@/lib/shop/waitlist';
import {promos, savePromo} from '@/lib/shop/promo';
import {bulkStatus, emailGuests, eventAdmin, removeGuest, saveEventSettings, updateGuest} from '@/lib/events/pomegranate';
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await requireAdmin();
    after(flushNotifications);
    return json({
      notifications: await notificationStatus(),
      ...(await catalogue(true)),
      orders: await orders(),
      reservations: await reservations(),
      contacts: await contacts(),
      waitlist: await waitlist(),
      promos: await promos(),
      event: await eventAdmin(),
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
    if (input.action === "waitlist") return json(await updateWaitlist(input.data));
    if (input.action === "waitlist_remove") return json(await removeWaitlist(input.data));
    if (input.action === "promo") return json(await savePromo(input.data));
    if (input.action === "event_settings") return json(await saveEventSettings(input.data));
    if (input.action === "event_guest") return json(await updateGuest(input.data));
    if (input.action === "event_bulk") return json(await bulkStatus(input.data));
    if (input.action === "event_remove") return json(await removeGuest(input.data));
    if (input.action === "event_email") {
      const result = await emailGuests(input.data);
      if (result.queued) after(flushNotifications);
      return json(result);
    }
    throw new ShopError("invalid");
  } catch (e) {
    return failure(e);
  }
}
