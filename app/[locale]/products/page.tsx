import {setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/content';
import {catalogue} from '@/lib/shop/service';
import Storefront from '@/components/shop/Storefront';
import '@/components/shop/shop.css';
export const dynamic = 'force-dynamic';
export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  return buildMetadata(
    locale,
    '/products',
    {
      title:
        locale === 'fr'
          ? 'Les produits de la ferme | Farm El Baya'
          : 'The Farm Pantry | Farm El Baya',
      description:
        locale === 'fr'
          ? 'Découvrez les grenades, l’huile d’olive et le miel d’El Baya. Commandes et précommandes sans acompte, avec paiement à la livraison.'
          : 'Explore El Baya’s pomegranates, olive oil and honey. Orders and pre-orders without a deposit, with cash on delivery.',
    },
    'picking_tree_fruits.webp',
  );
}
export default async function Products({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const data = await catalogue();
  return <Storefront initial={data} locale={locale === 'fr' ? 'fr' : 'en'} />;
}
