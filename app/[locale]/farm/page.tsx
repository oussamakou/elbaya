import Image from 'next/image';
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img, pageMetadata} from '@/content';
import Reveal from '@/components/ui/Reveal';
import FarmMapViewer from '@/components/ui/FarmMapViewer';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return pageMetadata(locale, 'farm', '/farm', 'outside_kitchen_fireplace.webp');
}

export default async function Farm({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'farm');
  const fr = locale === 'fr';
  return (
    <>
      <section className="relative flex min-h-[82vh] items-end overflow-hidden bg-dusk px-5 pb-20 text-cream">
        <Image src={img('outside_kitchen_fireplace.webp')} alt="Farm El Baya among the olive trees" fill preload fetchPriority="high" sizes="100vw" className="object-cover animate-breathe opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/20 to-transparent" />
        <h1 className="relative mx-auto max-w-7xl font-serif text-6xl italic md:text-7xl">{content.hero}</h1>
      </section>
      <section className="px-5 py-28">
        <div className="mx-auto space-y-28 max-w-7xl">
          {content.blocks.map((block, index) => (
            <div key={block.heading} className={`grid items-center gap-10 md:grid-cols-2 ${index % 2 ? '' : 'md:[&>*:first-child]:order-first'}`}>
              <Reveal className={index % 2 ? 'md:order-2' : ''}>
                <h2 className="max-w-md font-serif text-5xl italic leading-tight">{block.heading}</h2>
                <p className="mt-6 max-w-xl leading-8 text-earth/75">{block.text}</p>
              </Reveal>
              <Image src={img(block.image)} alt={block.heading} width={760} height={620} sizes="(min-width: 768px) 50vw, 100vw" className="rounded-card object-cover" />
            </div>
          ))}
        </div>
      </section>
      <section className="bg-cream px-5 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <p className="font-serif text-4xl italic leading-tight md:text-6xl">“{content.mahdi.quote}”</p>
          <p className="mt-5 text-sm uppercase tracking-label text-olive">Mahdi, Farm El Baya</p>
          <p className="mx-auto mt-8 max-w-2xl leading-8 text-earth/75">{content.mahdi.text}</p>
        </div>
      </section>
      <section className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-5xl italic">{content.map.heading}</h2>
          <FarmMapViewer
            src={img('farm_map.webp')}
            labels={fr
              ? {expand: 'Voir en plein écran', close: 'Fermer la carte', download: 'Télécharger', alt: 'Carte illustrée du domaine de Farm El Baya'}
              : {expand: 'View full map', close: 'Close map', download: 'Download', alt: 'Illustrated map of the Farm El Baya grounds'}}
          />
          <p className="mx-auto mt-10 max-w-3xl text-center font-serif text-3xl italic text-olive">“{content.map.quote}”</p>
        </div>
      </section>
    </>
  );
}
