import type {Metadata} from 'next';
import enHome from './en/home.json';
import frHome from './fr/home.json';
import enStay from './en/stay.json';
import frStay from './fr/stay.json';
import enFarm from './en/farm.json';
import frFarm from './fr/farm.json';
import enExperiences from './en/experiences.json';
import frExperiences from './fr/experiences.json';
import enForge from './en/forge.json';
import frForge from './fr/forge.json';
import enBook from './en/book.json';
import frBook from './fr/book.json';
import enGuides from './en/guides.json';
import frGuides from './fr/guides.json';

export type Locale = 'en' | 'fr';
export type PageKey = 'home' | 'stay' | 'farm' | 'experiences' | 'forge' | 'book' | 'guides';

const content = {
  en: {home: enHome, stay: enStay, farm: enFarm, experiences: enExperiences, forge: enForge, book: enBook, guides: enGuides},
  fr: {home: frHome, stay: frStay, farm: frFarm, experiences: frExperiences, forge: frForge, book: frBook, guides: frGuides}
};

export type Guide = (typeof enGuides)['guides'][number];

// Slugs are shared across locales so hreflang pairs line up.
export const guideSlugs = enGuides.guides.map((guide) => guide.slug);

export function getGuide(locale: string, slug: string): Guide | undefined {
  return getContent(locale, 'guides').guides.find((guide) => guide.slug === slug);
}

export function getContent<T extends PageKey>(locale: string, page: T) {
  const safeLocale = locale === 'fr' ? 'fr' : 'en';
  return content[safeLocale][page];
}

// A short editorial sequence for the homepage rather than a complete gallery.
// Movement already has its own image immediately above this section.
export const photos = [
  'interior-baya-room.webp',
  'breakfast.webp',
  'picking_tree_fruits.webp',
  'beekeeping_activity.webp',
  'figs_and_olive_oil.webp',
  'livestock.webp'
];

export function img(name: string) {
  return `/assets/images/${name}`;
}

export const SITE_URL = 'https://farmelbaya.com';
export const SITE_NAME = 'Farm El Baya';

// One place to build the full metadata block every page needs: title,
// description, canonical, hreflang alternates, Open Graph, and Twitter card.
// `path` is the locale-less route ('' for home, '/stay', …).
export function buildMetadata(
  locale: string,
  path: string,
  meta: {title: string; description: string},
  image: string,
  ogType: 'website' | 'article' = 'website'
): Metadata {
  const safeLocale: Locale = locale === 'fr' ? 'fr' : 'en';
  const ogImage = img(image);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${safeLocale}${path}`,
      languages: {
        en: `/en${path}`,
        fr: `/fr${path}`,
        'x-default': `/en${path}`
      }
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${safeLocale}${path}`,
      siteName: SITE_NAME,
      type: ogType,
      locale: safeLocale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: safeLocale === 'fr' ? 'en_US' : 'fr_FR',
      images: [ogImage]
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImage]
    }
  };
}

export function pageMetadata(locale: string, page: PageKey, path: string, image: string): Metadata {
  const safeLocale: Locale = locale === 'fr' ? 'fr' : 'en';
  return buildMetadata(safeLocale, path, getContent(safeLocale, page).meta, image);
}
