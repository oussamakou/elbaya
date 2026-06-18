import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img, photos} from '@/content';
import HeroSection from '@/components/sections/HeroSection';
import QuoteBanner from '@/components/sections/QuoteBanner';
import ThreePillars from '@/components/sections/ThreePillars';
import PhotoGrid from '@/components/ui/PhotoGrid';
import ForgeTeaser from '@/components/sections/ForgeTeaser';
import QuickFacts from '@/components/sections/QuickFacts';
import TrustReviews from '@/components/sections/TrustReviews';
import BookingConfidence from '@/components/sections/BookingConfidence';
import MovementFamilySection from '@/components/sections/MovementFamilySection';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const content = getContent(locale, 'home');
  return {title: content.meta.title, description: content.meta.description, alternates: {canonical: `/${locale}`}, openGraph: {images: [img('rooftop_nightsky.webp')]}};
}

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'home');
  const fr = locale === 'fr';
  const facts = fr
    ? [
        {label: 'Chambres', value: '3 chambres privées'},
        {label: 'Tarif direct', value: 'À partir de 180 DT / nuit'},
        {label: 'Inclus', value: 'Petit-déjeuner de la ferme'},
        {label: 'Distance', value: '1 heure de Tunis'},
        {label: 'Famille', value: 'Aire de jeux et Mouvement Research'}
      ]
    : [
        {label: 'Rooms', value: '3 private rooms'},
        {label: 'Direct rate', value: 'From 180 DT / night'},
        {label: 'Included', value: 'Farm breakfast every morning'},
        {label: 'Distance', value: '1 hour from Tunis'},
        {label: 'Families', value: 'Playground and Mouvement Research'}
      ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Farm El Baya',
    description: content.meta.description,
    url: `https://farmelbaya.com/${locale}`,
    image: `https://farmelbaya.com${img('rooftop_nightsky.webp')}`,
    telephone: '+97466290007',
    priceRange: 'From 180 TND / night',
    address: {'@type': 'PostalAddress', addressLocality: 'Testour', addressRegion: 'Béja', addressCountry: 'TN'},
    geo: {'@type': 'GeoCoordinates', latitude: 36.7103385, longitude: 8.803951},
    sameAs: ['https://www.instagram.com/farm_elbaya/', 'https://www.booking.com/hotel/tn/farm-el-baya.fr.html']
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <HeroSection image={img('rooftop_nightsky.webp')} headline={content.hero.headline} subhead={content.hero.subhead} cta={content.hero.cta} />
      <QuickFacts facts={facts} />
      <QuoteBanner quote={content.quote} />
      <ThreePillars items={content.pillars} />
      <MovementFamilySection locale={locale} />
      <BookingConfidence locale={locale} />
      <PhotoGrid photos={photos} />
      <TrustReviews heading={content.reviews.heading} subhead={content.reviews.subhead} reviews={content.reviews.items} />
      <ForgeTeaser content={content.forge} />
    </>
  );
}
