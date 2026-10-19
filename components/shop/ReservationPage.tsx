"use client";
import {Link} from "@/i18n/routing";
import type {Product} from "@/lib/shop/types";
import HarvestPage from './HarvestPage';
// /products/reserve shows the chosen product's request page (the first visible one by default).
export default function ReservationPage({products,locale,productId}:{products:Product[];locale:"fr"|"en";productId?:string}) {
  const fr=locale==="fr";
  const product=products.find(p=>p.id===productId)||products[0];
  if(product) return <HarvestPage product={product} locale={locale} otherProducts={products.filter(p=>p.id!==product.id)}/>;
  return (
    <main className="shop-wrap reservation-page">
      <p className="shop-notice">
        {fr ? "Les produits de la ferme seront bientôt disponibles." : "Farm products are coming soon."}{" "}
        <Link href="/farm" className="pantry-text-link">{fr ? "Découvrir la ferme" : "Meet the farm"} →</Link>
      </p>
    </main>
  );
}
