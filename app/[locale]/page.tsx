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
        {label: 'Chambres', value: '3 chambres privees'},
        {label: 'Tarif direct', value: 'A partir de 180 DT / nuit'},
        {label: 'Inclus', value: 'Petit-dejeuner de la ferme'},
        {label: 'Distance', value: '1 heure de Tunis'},
        {label: 'Experiences', value: 'Repas, mouvement, recoltes'}
      ]
    : [
        {label: 'Rooms', value: '3 private rooms'},
        {label: 'Direct rate', value: 'From 180 DT / night'},
        {label: 'Included', value: 'Farm breakfast every morning'},
        {label: 'Distance', value: '1 hour from Tunis'},
        {label: 'Experiences', value: 'Meals, movement, harvests'}
      ];

  return (
    <>
      <HeroSection image={img('rooftop_nightsky.webp')} headline={content.hero.headline} subhead={content.hero.subhead} cta={content.hero.cta} />
      <QuickFacts facts={facts} />
      <QuoteBanner quote={content.quote} />
      <ThreePillars items={content.pillars} />
      <BookingConfidence locale={locale} />
      <PhotoGrid photos={photos} />
      <TrustReviews heading={content.reviews.heading} subhead={content.reviews.subhead} reviews={content.reviews.items} />
      <ForgeTeaser content={content.forge} />
    </>
  );
}
