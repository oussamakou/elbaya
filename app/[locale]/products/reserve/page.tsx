import { catalogue } from "@/lib/shop/service";
import { Link } from "@/i18n/routing";
import ReservationForm from "@/components/shop/ReservationForm";
import "@/components/shop/shop.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Précommandes · Farm El Baya" };
export default async function ReservePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale } = await params,
    query = await searchParams;
  const fr = locale === "fr",
    { products } = await catalogue();
  return (
    <main className="shop-wrap reservation-page">
      <div className="reservation-intro">
        <Link href="/products" className="pantry-text-link">
          ← {fr ? "La boutique" : "Farm shop"}
        </Link>
        <p className="shop-eyebrow">FARM EL BAYA · TESTOUR</p>
        <h1>
          {fr
            ? "La prochaine récolte, pour vous."
            : "A little of the next harvest, for you."}
        </h1>
        <p className="pantry-lead">
          {fr
            ? "Grenades, huile d’olive ou miel : dites-nous ce qui vous ferait plaisir. Mehdi vous appelle pour préparer votre précommande."
            : "Pomegranates, olive oil or honey: tell us what you would like. Mehdi will call to arrange your pre-order."}
        </p>
        <img
          src="/assets/shop/pomegranate.svg"
          alt=""
          width="240"
          height="240"
        />
      </div>
      <ReservationForm
        products={products}
        locale={fr ? "fr" : "en"}
        productId={query.product}
      />
    </main>
  );
}
