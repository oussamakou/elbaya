import Image from 'next/image';
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img} from '@/content';
import ExperienceCard from '@/components/ui/ExperienceCard';

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
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          {content.items.map((item, index) => <ExperienceCard key={item[0]} item={item} index={index} />)}
        </div>
      </section>
    </>
  );
}
