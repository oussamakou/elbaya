import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img, photos} from '@/content';
import HeroSection from '@/components/sections/HeroSection';
import QuoteBanner from '@/components/sections/QuoteBanner';
import ThreePillars from '@/components/sections/ThreePillars';
import PhotoGrid from '@/components/ui/PhotoGrid';
import ForgeBanner from '@/components/sections/ForgeBanner';
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
        {label: 'Chambre', value: 'Chambre Baya · 3 hôtes'},
        {label: 'Tarif direct', value: 'Dès 180 DT / nuit'},
        {label: 'Sur la ferme', value: 'Mouvement, animaux, oliviers'},
        {label: 'Distance', value: '1 heure de Tunis'},
        {label: 'Famille', value: 'Aire de jeux et Mouvement Research'}
      ]
    : [
        {label: 'Room', value: 'Baya Room · sleeps 3'},
        {label: 'Direct rate', value: 'From 180 DT / night'},
        {label: 'On the farm', value: 'Movement, animals, olive groves'},
        {label: 'Distance', value: '1 hour from Tunis'},
        {label: 'Families', value: 'Playground & Mouvement Research'}
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
      <MovementFamilySection locale={locale} compact />
      <PhotoGrid photos={photos} />
      <TrustReviews heading={content.reviews.heading} subhead={content.reviews.subhead} locale={locale} />
      <BookingConfidence locale={locale} />
      <ForgeBanner content={content.forge} />
    </>
  );
}
