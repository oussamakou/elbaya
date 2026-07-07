import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img} from '@/content';
import WhatsAppLink from '@/components/ui/WhatsAppLink';
import LodgifyWidget from '@/components/ui/LodgifyWidget';
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
        {label: 'Tarif direct', value: 'Dès 180 DT / nuit'},
        {label: 'Petit-déjeuner', value: '20 DT (en option)'},
        {label: 'Paiement', value: "À l'arrivée"},
        {label: 'Disponibilité', value: 'Chambre Baya · unique'},
        {label: 'Lieu', value: 'Testour, 1h de Tunis'}
      ]
    : [
        {label: 'Direct rate', value: 'From 180 DT / night'},
        {label: 'Breakfast', value: '20 DT add-on'},
        {label: 'Payment', value: 'On arrival'},
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
      </section>
      <QuickFacts facts={facts} />
      <section className="px-5 pt-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl italic md:text-4xl">{fr ? 'Vérifiez les dates et réservez' : 'Check dates & book'}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-earth/75">
            {fr
              ? 'Choisissez vos dates pour voir les disponibilités en direct et réserver la Chambre Baya.'
              : 'Pick your dates to see live availability and book the Baya Room.'}
          </p>
          <div className="mx-auto mt-7 max-w-lg text-left">
            <LodgifyWidget locale={locale} />
          </div>
          <p className="mx-auto mt-5 max-w-xl text-xs leading-6 text-earth/75">
            {fr
              ? "Aucune carte en ligne - un acompte de 30 % confirme vos dates, le solde se règle à l'arrivée."
              : 'No card needed online - a 30% deposit confirms your dates, balance paid on arrival.'}
          </p>
        </div>
      </section>
      <section className="px-5 py-14">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
          {(fr
            ? ['Choisissez vos dates et réservez la Chambre Baya', "Mahdi confirme et envoie les détails de l'acompte", "Réglez l'acompte de 30 % - le solde se règle à l'arrivée"]
            : ['Pick your dates and book the Baya Room', 'Mahdi confirms and shares the deposit details', 'Pay the 30% deposit - the balance is settled on arrival']
          ).map((step, index) => (
            <div key={step} className="border border-mist bg-cream p-5">
              <p className="text-xs font-semibold uppercase tracking-label text-olive">{fr ? 'Étape' : 'Step'} {index + 1}</p>
              <p className="mt-2 text-lg font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 pb-8">
        <div className="mx-auto max-w-3xl rounded-card border border-mist bg-olive-dark p-8 text-center text-cream md:p-12">
          <p className="text-xs font-semibold uppercase tracking-label text-cream/80">{fr ? 'Une question ?' : 'A question?'}</p>
          <h2 className="mt-4 font-serif text-4xl italic leading-tight">{fr ? 'Vous préférez demander avant de réserver ?' : 'Prefer to ask before you book?'}</h2>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-cream/70">
            {fr
              ? "Écrivez à Mahdi sur WhatsApp avec vos dates ou toute question - repas, expériences, accès. Il répond sous 24 heures."
              : "Message Mahdi on WhatsApp with your dates or anything you'd like to know - meals, experiences, getting there. He replies within 24 hours."}
          </p>
          <WhatsAppLink locale={locale} className="mt-8 inline-flex items-center justify-center rounded-full bg-cream px-7 py-4 text-sm font-semibold text-earth transition-[scale,background-color] duration-300 hover:bg-mist active:scale-[0.96]">
            {fr ? 'Écrire à Mahdi sur WhatsApp' : 'Message Mahdi on WhatsApp'}
          </WhatsAppLink>
        </div>
      </section>
      <PolicyBlock locale={locale} />
      <GettingHere locale={locale} />
      <FaqBlock locale={locale} />
    </>
  );
}
