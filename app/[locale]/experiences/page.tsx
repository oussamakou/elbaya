import Image from 'next/image';
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img} from '@/content';
import ExperienceCard from '@/components/ui/ExperienceCard';
import BookingConfidence from '@/components/sections/BookingConfidence';
import MovementFamilySection from '@/components/sections/MovementFamilySection';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const content = getContent(locale, 'experiences');
  return {title: content.meta.title, description: content.meta.description, alternates: {canonical: `/${locale}/experiences`}, openGraph: {images: [img('breakfast.webp')]}};
}

export default async function Experiences({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'experiences');
  return (
    <>
      <section className="relative flex min-h-[82vh] items-end overflow-hidden bg-dusk px-5 pb-20 text-cream">
        <Image src={img('movement_research_lab.webp')} alt="The Movement Area at Farm El Baya" fill preload fetchPriority="high" sizes="100vw" className="object-cover animate-breathe opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/30 to-transparent" />
        <h1 className="relative mx-auto max-w-6xl font-serif text-5xl italic leading-tight md:text-7xl">{content.hero}</h1>
      </section>
      <MovementFamilySection locale={locale} />
      <section className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-label text-olive">{locale === 'fr' ? 'Ce qui est inclus' : 'Included and available'}</p>
            <h2 className="mt-3 font-serif text-5xl italic">{locale === 'fr' ? 'Choisissez votre rythme.' : 'Choose your pace.'}</h2>
            <p className="mt-4 leading-7 text-earth/75">
              {locale === 'fr'
                ? 'Certaines expériences sont incluses dans chaque séjour. D’autres sont saisonnières ou organisées sur demande avec Mahdi.'
                : 'Some experiences are included with every stay. Others are seasonal or arranged on request with Mahdi.'}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {content.items.map((item, index) => <ExperienceCard key={item[0]} item={item} index={index} />)}
          </div>
        </div>
      </section>
      <section className="bg-cream px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-label text-olive">{content.eventsHeading}</p>
            <h2 className="mt-3 font-serif text-5xl italic">{locale === 'fr' ? 'Quand venir.' : 'When to come.'}</h2>
            <p className="mt-4 leading-7 text-earth/75">{content.eventsSubhead}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {content.events.map((event) => (
              <article key={event[0]} className="flex flex-col border border-mist bg-sand/55 p-6">
                <span className="w-fit rounded-full bg-cream px-3 py-1 text-xs font-medium text-olive">{event[2]}</span>
                <h3 className="mt-4 font-serif text-2xl italic">{event[0]}</h3>
                <p className="mt-3 text-sm leading-6 text-earth/75">{event[1]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <BookingConfidence locale={locale} />
    </>
  );
}
