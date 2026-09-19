import {cache} from 'react';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {catalogue} from '@/lib/shop/service';
import {localized} from '@/lib/shop/types';
import {buildMetadata, SITE_URL} from '@/content';
import Storefront from '@/components/shop/Storefront';
import '@/components/shop/shop.css';

export const dynamic = 'force-dynamic';
const getCatalogue = cache(() => catalogue());
type Props = {params: Promise<{locale: string; id: string}>};
export async function generateMetadata({params}: Props) {
  const {locale, id} = await params;
  const product = (await getCatalogue()).products.find((p) => p.id === id);
  if (!product) notFound();
  const metadata = buildMetadata(
    locale,
    `/products/${id}`,
    {
      title: `${localized(product.name, locale)} | Farm El Baya`,
      description: localized(product.description, locale),
    },
    'picking_tree_fruits.webp',
  );
  if (product.images[0]?.startsWith('/api/')) {
    metadata.openGraph = {...metadata.openGraph, images: [product.images[0]]};
    metadata.twitter = {...metadata.twitter, images: [product.images[0]]};
  }
  return metadata;
}
export default async function ProductPage({params}: Props) {
  const {locale, id} = await params;
  setRequestLocale(locale);
  const data = await getCatalogue();
  const product = data.products.find((p) => p.id === id);
  if (!product) notFound();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localized(product.name, locale),
    description: localized(product.description, locale),
    image: product.images.map((src) => `${SITE_URL}${src}`),
    brand: {'@type': 'Brand', name: 'Farm El Baya'},
    url: `${SITE_URL}/${locale}/products/${id}`,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <Storefront
        initial={data}
        locale={locale === 'fr' ? 'fr' : 'en'}
        productId={id}
      />
    </>
  );
}
