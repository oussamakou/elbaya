import Image from 'next/image';
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img} from '@/content';
import ExperienceCard from '@/components/ui/ExperienceCard';
import BookingConfidence from '@/components/sections/BookingConfidence';

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
        <Image src={img('pullups_dips_bars_in_thefarm.webp')} alt="" fill priority className="object-cover animate-breathe opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/30 to-transparent" />
        <h1 className="relative mx-auto max-w-6xl font-serif text-5xl italic leading-tight md:text-7xl">{content.hero}</h1>
      </section>
      <section className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bark">{locale === 'fr' ? 'Ce qui est inclus' : 'Included and available'}</p>
            <h2 className="mt-3 font-serif text-5xl italic">{locale === 'fr' ? 'Choisissez votre rythme.' : 'Choose your pace.'}</h2>
            <p className="mt-4 leading-7 text-earth/72">
              {locale === 'fr'
                ? 'Certaines experiences sont incluses dans chaque sejour. D autres sont saisonnieres ou organisees sur demande avec Mahdi.'
                : 'Some experiences are included with every stay. Others are seasonal or arranged on request with Mahdi.'}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {content.items.map((item, index) => <ExperienceCard key={item[0]} item={item} index={index} />)}
          </div>
        </div>
      </section>
      <BookingConfidence locale={locale} />
    </>
  );
}
