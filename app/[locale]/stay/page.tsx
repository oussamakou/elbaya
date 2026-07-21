import Image from 'next/image';
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img, pageMetadata} from '@/content';
import Button from '@/components/ui/Button';
import WhatsAppLink from '@/components/ui/WhatsAppLink';
import RoomShowcase from '@/components/ui/RoomShowcase';
import StayAddons from '@/components/sections/StayAddons';
import QuickFacts from '@/components/sections/QuickFacts';
import BookingConfidence from '@/components/sections/BookingConfidence';
import FaqBlock from '@/components/sections/FaqBlock';
import PolicyBlock from '@/components/sections/PolicyBlock';
import GettingHere from '@/components/sections/GettingHere';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return pageMetadata(locale, 'stay', '/stay', 'woman-looking-at-view-from-window.webp');
}

export default async function Stay({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'stay');
  const fr = locale === 'fr';
  const facts = fr
    ? [
        {label: 'Chambre', value: 'Chambre Baya'},
        {label: 'Salle de bain', value: 'Privée'},
        {label: 'Tarif', value: 'Dès 180 DT / nuit'},
        {label: 'Petit-déjeuner', value: '20 DT (en option)'},
        {label: 'Réponse', value: 'Sous 24 heures'}
      ]
    : [
        {label: 'Room', value: 'Baya Room'},
        {label: 'Bathroom', value: 'Private'},
        {label: 'Rate', value: 'From 180 DT / night'},
        {label: 'Breakfast', value: '20 DT add-on'},
        {label: 'Reply time', value: 'Within 24 hours'}
      ];

  return (
    <>
      <section className="relative flex min-h-[76vh] items-end overflow-hidden bg-dusk px-5 pb-20 text-cream">
        <Image src={img('woman-looking-at-view-from-window.webp')} alt="Inside the Baya Room at Farm El Baya" fill preload fetchPriority="high" sizes="100vw" className="object-cover animate-breathe opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/25 to-transparent" />
        <h1 className="relative mx-auto max-w-7xl font-serif text-6xl italic md:text-7xl">{content.hero}</h1>
      </section>
      <QuickFacts facts={facts} />
      <section className="px-5 py-20 text-center">
        <p className="mx-auto max-w-3xl font-serif text-3xl italic leading-snug md:text-4xl">{content.intro}</p>
        <Button href="/book" className="mt-8">{fr ? 'Vérifier les disponibilités' : 'Check availability'}</Button>
      </section>
      <RoomShowcase locale={locale} />
      <BookingConfidence locale={locale} />
      <StayAddons locale={locale} />
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-label text-olive">{content.cabin.label}</p>
          <h2 className="mt-4 font-serif text-6xl italic">{content.cabin.heading}</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-earth/75">{content.cabin.text}</p>
          <WhatsAppLink
            locale={locale}
            event="cabin_notify_click"
            message={fr
              ? 'Bonjour Mahdi, prévenez-moi quand la Cabane aux Oliviers sera prête.'
              : 'Hi Mahdi, please let me know when the Olive Cabin is ready.'}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-olive px-6 py-3 text-sm font-medium text-cream transition-[scale,background-color] duration-300 hover:bg-olive-dark active:scale-[0.96]"
          >
            {content.cabin.button}
          </WhatsAppLink>
        </div>
      </section>
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-5xl italic">{content.nearby.heading}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-4">{content.nearby.items.map((item) => <p key={item} className="border-t border-mist pt-5 leading-7 text-earth/75">{item}</p>)}</div>
        </div>
      </section>
      <GettingHere locale={locale} />
      <PolicyBlock locale={locale} />
      <FaqBlock locale={locale} schema />
    </>
  );
}
