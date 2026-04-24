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
        {label: 'Tarif', value: '180 DT / nuit'},
        {label: 'Inclus', value: 'Petit-dejeuner'},
        {label: 'Paiement', value: 'A l arrivee'},
        {label: 'Reponse', value: 'Sous 24 heures'},
        {label: 'Lieu', value: 'Testour, 1h de Tunis'}
      ]
    : [
        {label: 'Rate', value: '180 DT / night'},
        {label: 'Included', value: 'Breakfast'},
        {label: 'Payment', value: 'On arrival'},
        {label: 'Reply time', value: 'Within 24 hours'},
        {label: 'Location', value: 'Testour, 1h from Tunis'}
      ];

  return (
    <>
      <section className="bg-sand px-5 pb-16 pt-40 text-center">
        <h1 className="font-serif text-6xl italic md:text-7xl">{content.hero.heading}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-earth/72">{content.hero.subhead}</p>
      </section>
      <QuickFacts facts={facts} />
      <section className="px-5 py-14">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
          {(fr
            ? ['Envoyez vos dates', 'Mahdi confirme les disponibilites', 'Vous confirmez avant tout acompte']
            : ['Send your dates', 'Mahdi confirms availability', 'You confirm before any deposit']
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
