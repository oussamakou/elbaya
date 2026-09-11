"use client";
import {useState} from "react";
import Image from "next/image";
import {Link} from "@/i18n/routing";
import {localized, type Product} from "@/lib/shop/types";
import ReservationForm from "./ReservationForm";
export default function ReservationPage({products,locale,productId}:{products:Product[];locale:"fr"|"en";productId?:string}) {
const fr=locale==="fr";
const [selected,setSelected]=useState(productId || products[0]?.id);
const product=products.find(p=>p.id===selected)||products[0];
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
        {product?.images[0] && <figure className="reservation-product-image"><Image key={product.images[0]} src={product.images[0]} alt={localized(product.name,locale)} fill sizes="(min-width: 1300px) 550px, (min-width: 761px) 44vw, 100vw" unoptimized={product.images[0].startsWith('/api/')} className={product.images[0].endsWith('.svg') ? 'illustration' : ''} /><figcaption>{localized(product.name,locale)}</figcaption></figure>}
      </div>
      <ReservationForm
        products={products}
        locale={fr ? "fr" : "en"}
        productId={selected}
        onProductChange={setSelected}
      />
    </main>
  );
}
