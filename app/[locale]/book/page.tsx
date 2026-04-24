import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img} from '@/content';
import BookingForm from '@/components/ui/BookingForm';
import QuickFacts from '@/components/sections/QuickFacts';
import FaqBlock from '@/components/sections/FaqBlock';
import PolicyBlock from '@/components/sections/PolicyBlock';
import GettingHere from '@/components/sections/GettingHere';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const content = getContent(locale, 'book');
  return {title: content.meta.title, description: content.meta.description, alternates: {canonical: `/${locale}/book`}, openGraph: {images: [img('breakfast.webp')]}};
}

export default async function Book({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'book');
  const fr = locale === 'fr';
  const facts = fr
    ? [
        {label: 'Tarif direct', value: 'A partir de 180 DT / nuit'},
        {label: 'Inclus', value: 'Petit-dejeuner'},
        {label: 'Paiement', value: 'A l arrivee'},
        {label: 'Disponibilite', value: '3 chambres seulement'},
        {label: 'Lieu', value: 'Testour, 1h de Tunis'}
      ]
    : [
        {label: 'Direct rate', value: 'From 180 DT / night'},
        {label: 'Included', value: 'Breakfast'},
        {label: 'Payment', value: 'On arrival'},
        {label: 'Availability', value: 'Only 3 rooms'},
        {label: 'Location', value: 'Testour, 1h from Tunis'}
      ];

  return (
    <>
      <section className="bg-sand px-5 pb-16 pt-40 text-center">
        <h1 className="font-serif text-6xl italic md:text-7xl">{content.hero.heading}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-earth/72">{content.hero.subhead}</p>
        <p className="mx-auto mt-5 max-w-2xl text-sm font-medium uppercase tracking-[0.18em] text-bark">
          {fr ? 'Week-ends, recoltes et petits groupes se confirment vite.' : 'Weekends, harvest dates, and small groups confirm fastest.'}
        </p>
      </section>
      <QuickFacts facts={facts} />
      <section className="px-5 py-14">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
          {(fr
            ? ['Envoyez vos dates et preferences', 'Mahdi propose la meilleure option disponible', 'Vous confirmez seulement si tout vous convient']
            : ['Send your dates and preferences', 'Mahdi suggests the best available fit', 'You confirm only if everything works']
          ).map((step, index) => (
            <div key={step} className="border border-mist bg-cream p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bark">Step {index + 1}</p>
              <p className="mt-2 text-lg font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>
      <BookingForm locale={locale} copy={content.form} />
      <PolicyBlock locale={locale} />
      <GettingHere locale={locale} />
      <FaqBlock locale={locale} />
    </>
  );
}
