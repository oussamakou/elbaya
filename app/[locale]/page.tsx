import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img, pageMetadata, photos, SITE_URL} from '@/content';
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
  return pageMetadata(locale, 'home', '', 'rooftop_nightsky.webp');
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
        {label: 'Famille', value: 'Espace ouvert et mouvement'}
      ]
    : [
        {label: 'Room', value: 'Baya Room · sleeps 3'},
        {label: 'Direct rate', value: 'From 180 DT / night'},
        {label: 'On the farm', value: 'Movement, animals, olive groves'},
        {label: 'Distance', value: '1 hour from Tunis'},
        {label: 'Families', value: 'Open farm space & movement area'}
      ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${SITE_URL}/#lodging`,
    name: 'Farm El Baya',
    description: content.meta.description,
    url: `${SITE_URL}/${locale}`,
    image: [
      `${SITE_URL}${img('rooftop_nightsky.webp')}`,
      `${SITE_URL}${img('room-interior.webp')}`,
      `${SITE_URL}${img('breakfast.webp')}`
    ],
    telephone: '+97466290007',
    priceRange: 'From 180 TND / night',
    numberOfRooms: 1,
    checkinTime: '14:00',
    checkoutTime: '11:00',
    currenciesAccepted: 'TND',
    paymentAccepted: fr ? 'PayPal, virement bancaire, espèces' : 'PayPal, bank transfer, cash',
    address: {'@type': 'PostalAddress', addressLocality: 'Testour', addressRegion: 'Béja', addressCountry: 'TN'},
    geo: {'@type': 'GeoCoordinates', latitude: 36.7103385, longitude: 8.803951},
    amenityFeature: [
      {'@type': 'LocationFeatureSpecification', name: fr ? 'Salle de bain privée' : 'Private bathroom', value: true},
      {'@type': 'LocationFeatureSpecification', name: fr ? 'Parking gratuit' : 'Free parking', value: true},
      {'@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true},
      {'@type': 'LocationFeatureSpecification', name: fr ? 'Petit-déjeuner sur demande' : 'Breakfast on request', value: true},
      {'@type': 'LocationFeatureSpecification', name: fr ? 'Espace mouvement et yoga' : 'Movement and yoga area', value: true}
    ],
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
