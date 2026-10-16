import {setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/content';
import {catalogue} from '@/lib/shop/service';
import Storefront from '@/components/shop/Storefront';
import HarvestPage from '@/components/shop/HarvestPage';
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
          ? 'Grenades de la ferme à Testour : paniers dès 5 kg, tarifs de récolte et points de retrait. Découvrez les vidéos de la ferme et envoyez votre demande directement.'
          : 'Pomegranates from our farm in Testour: packs from 5 kg, harvest prices and pickup options. Watch the farm stories and request your pack on the same page.',
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
  const harvest = data.products.find(p => p.id === 'pomegranates');
  if (harvest) return <HarvestPage product={harvest} locale={locale === 'fr' ? 'fr' : 'en'} otherProducts={data.products.filter(p=>p.id!==harvest.id)}/>;
  return <Storefront initial={data} locale={locale === 'fr' ? 'fr' : 'en'} />;
}
