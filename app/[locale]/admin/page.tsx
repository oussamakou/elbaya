import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/shop/auth";
import { catalogue, orders } from "@/lib/shop/service";
import { reservations } from "@/lib/shop/reservations";
import AdminShop from "@/components/shop/AdminShop";
import "@/components/shop/shop.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Administration boutique | Farm El Baya",
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  const configured = adminConfigured();
  const authenticated = configured && (await isAdmin());
  return (
    <AdminShop
      configured={configured}
      initial={
        authenticated
          ? {
              ...(await catalogue(true)),
              orders: await orders(),
              reservations: await reservations(),
            }
          : null
      }
    />
  );
}
