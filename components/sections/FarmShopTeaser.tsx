import Image from "next/image";
import { Link } from "@/i18n/routing";
export default function FarmShopTeaser({ locale }: { locale: string }) {
  const fr = locale === "fr";
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
              ? "Grenades, huile d’olive, miel. Retrouvez les produits au fil des saisons et préparez votre prochaine précommande, même sans séjourner à la ferme."
              : "Pomegranates, olive oil, honey. Discover our seasonal products and request your next harvest delivery, whether or not you stay with us."}
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-olive text-sm font-medium text-olive"
          >
            {fr ? "Découvrir la boutique" : "Explore the farm shop"} →
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2">
          {["pomegranate", "olive", "honey"].map((name) => (
            <Image
              key={name}
              src={`/assets/shop/${name}.svg`}
              width={180}
              height={210}
              sizes="(min-width:768px) 15vw, 28vw"
              className="w-[31%]"
              alt=""
            />
          ))}
        </div>
      </div>
    </section>
  );
}
