import type {MetadataRoute} from 'next';
import {guideSlugs, SITE_URL} from '@/content';
import {routing} from '@/i18n/routing';

// Every indexable route, locale-less. Each locale variant is listed as its
// own entry, carrying the full hreflang mapping so Google can pair them.
const pages: Array<{path: string; priority: number; changeFrequency: 'weekly' | 'monthly'}> = [
  {path: '', priority: 1, changeFrequency: 'weekly'},
  {path: '/stay', priority: 0.9, changeFrequency: 'monthly'},
  {path: '/book', priority: 0.9, changeFrequency: 'weekly'},
  {path: '/experiences', priority: 0.7, changeFrequency: 'monthly'},
  {path: '/farm', priority: 0.7, changeFrequency: 'monthly'},
  {path: '/forge', priority: 0.5, changeFrequency: 'monthly'},
  {path: '/guides', priority: 0.6, changeFrequency: 'monthly'},
  ...guideSlugs.map((slug) => ({path: `/guides/${slug}`, priority: 0.6, changeFrequency: 'monthly' as const}))
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({path, priority, changeFrequency}) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${path}`,
          fr: `${SITE_URL}/fr${path}`,
          'x-default': `${SITE_URL}/en${path}`
        }
      }
    }))
  );
}
