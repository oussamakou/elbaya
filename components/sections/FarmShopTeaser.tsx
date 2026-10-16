import Image from "next/image";
import { Link } from "@/i18n/routing";
import {catalogue} from '@/lib/shop/service';
import {seedProducts} from '@/lib/shop/db';
export default async function FarmShopTeaser({ locale }: { locale: string }) {
  const fr = locale === "fr";
  let products;
  try {products=(await catalogue()).products;} catch {products=seedProducts;}
  const featured=products.filter(p=>['pomegranates','olive-oil','honey'].includes(p.id));
  return (
    <section className="border-y border-olive/15 bg-sand px-6 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-label text-olive">
            {fr ? "Les récoltes d’El Baya" : "From the El Baya harvest"}
          </p>
          <h2 className="mt-4 font-serif text-4xl italic md:text-5xl">
            {fr
              ? "Un peu de la ferme, chez vous."
              : "A little of the farm, at home."}
          </h2>
          <p className="mt-5 max-w-lg leading-7 text-earth/75">
            {fr
              ? "Une terre familiale, des arbres et des ruches dont Mahdi prend soin au quotidien. Découvrez les grenades, l’huile d’olive et le miel au fil des récoltes, même sans séjourner à la ferme."
              : "Family land, trees and beehives that Mahdi tends every day. Discover pomegranates, olive oil and honey as the harvests unfold, whether or not you stay with us."}
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-olive text-sm font-medium text-olive"
          >
            {fr ? "Découvrir la boutique" : "Explore the farm shop"} →
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2">
          {featured.map(product=>{
            const src=product.images[0]||`/assets/shop/${product.id==='pomegranates'?'pomegranate':product.id==='olive-oil'?'olive':'honey'}.svg`;
            return <Link key={product.id} href={`/products/${product.id}`} className="relative block w-[31%] overflow-hidden rounded-t-[70px]" aria-label={fr?product.name.fr:product.name.en||product.name.fr}><Image src={src} width={240} height={300} sizes="(min-width:768px) 15vw, 28vw" className={`aspect-[4/5] w-full ${src.endsWith('.svg')?'object-contain':'object-cover'}`} unoptimized={src.startsWith('/api/')} alt={fr?product.name.fr:product.name.en||product.name.fr}/></Link>;
          })}
        </div>
      </div>
    </section>
  );
}
