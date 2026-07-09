import {Suspense} from 'react';
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, pageMetadata} from '@/content';
import BookingFlow from '@/components/sections/BookingFlow';
import QuickFacts from '@/components/sections/QuickFacts';
import FaqBlock from '@/components/sections/FaqBlock';
import PolicyBlock from '@/components/sections/PolicyBlock';
import GettingHere from '@/components/sections/GettingHere';
import Button from '@/components/ui/Button';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return pageMetadata(locale, 'book', '/book', 'room-interior.webp');
}

export default async function Book({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'book');
  const fr = locale === 'fr';
  const facts = fr
    ? [
        {label: 'Tarif direct', value: 'Dès 180 DT / nuit'},
        {label: 'Petit-déjeuner', value: '20 DT (en option)'},
        {label: 'Confirmation', value: 'Acompte de 30 %'},
        {label: 'Disponibilité', value: 'Chambre Baya · unique'},
        {label: 'Lieu', value: 'Testour, 1h de Tunis'}
      ]
    : [
        {label: 'Direct rate', value: 'From 180 DT / night'},
        {label: 'Breakfast', value: '20 DT add-on'},
        {label: 'Confirmation', value: '30% deposit'},
        {label: 'Availability', value: 'Baya Room · the only room'},
        {label: 'Location', value: 'Testour, 1h from Tunis'}
      ];

  return (
    <>
      <section className="bg-sand px-5 pb-16 pt-40 text-center">
        <h1 className="font-serif text-6xl italic md:text-7xl">{content.hero.heading}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-earth/75">{content.hero.subhead}</p>
        <p className="mx-auto mt-5 max-w-2xl text-sm font-medium uppercase tracking-label text-olive">
          {fr ? 'Week-ends, récoltes et petits groupes se confirment vite.' : 'Weekends, harvest dates, and small groups confirm fastest.'}
        </p>
        <Button href={`/book?mode=international#booking-flow`} className="mt-8">
          {fr ? 'Voir les disponibilités en direct' : 'See live availability'}
        </Button>
      </section>
      <QuickFacts facts={facts} />
      <section id="booking-flow" className="scroll-mt-24 px-5 pb-14 pt-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl italic md:text-4xl">{fr ? 'Réservez à votre façon' : 'Book your way'}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-earth/75">
            {fr
              ? 'Choisissez votre mode de réservation pour voir le calendrier et le paiement adaptés.'
              : 'Choose your booking method to see the right calendar and payment flow.'}
          </p>
          <div className="mt-8">
            <Suspense fallback={null}>
              <BookingFlow locale={locale} />
            </Suspense>
          </div>
        </div>
      </section>
      <PolicyBlock locale={locale} />
      <GettingHere locale={locale} />
      <FaqBlock locale={locale} />
    </>
  );
}
