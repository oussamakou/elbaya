import type {MetadataRoute} from 'next';
import {guideSlugs, SITE_URL} from '@/content';
import {routing} from '@/i18n/routing';
import {catalogue} from '@/lib/shop/service';
export const dynamic = 'force-dynamic';

// Every indexable route, locale-less. Each locale variant is listed as its
// own entry, carrying the full hreflang mapping so Google can pair them.
const pages: Array<{
  path: string;
  priority: number;
  changeFrequency: 'weekly' | 'monthly';
}> = [
  {path: '', priority: 1, changeFrequency: 'weekly'},
  {path: '/stay', priority: 0.9, changeFrequency: 'monthly'},
  {path: '/book', priority: 0.9, changeFrequency: 'weekly'},
  {path: '/experiences', priority: 0.7, changeFrequency: 'monthly'},
  {path: '/farm', priority: 0.7, changeFrequency: 'monthly'},
  {path: '/products', priority: 0.8, changeFrequency: 'weekly'},
  {path: '/products/reserve', priority: 0.6, changeFrequency: 'monthly'},
  {path: '/guides', priority: 0.6, changeFrequency: 'monthly'},
  ...guideSlugs.map((slug) => ({
    path: `/guides/${slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  })),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {products} = await catalogue();
  const productPages = products.map((p) => ({
    path: `/products/${p.id}`,
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }));
  return [...pages, ...productPages].flatMap(
    ({path, priority, changeFrequency}) =>
      routing.locales.map((locale) => ({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: {
            en: `${SITE_URL}/en${path}`,
            fr: `${SITE_URL}/fr${path}`,
            'x-default': `${SITE_URL}/en${path}`,
          },
        },
      })),
  );
}
