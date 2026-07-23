import Image from 'next/image';
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img, pageMetadata} from '@/content';
import FarmMapViewer from '@/components/ui/FarmMapViewer';
import Button from '@/components/ui/Button';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return pageMetadata(locale, 'farm', '/farm', 'stargazing-night.png');
}

export default async function Farm({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'farm');
  const fr = locale === 'fr';
  return (
    <>
      <section className="relative flex min-h-[82vh] items-end overflow-hidden bg-dusk px-5 pb-20 text-cream">
        <Image src={img('stargazing-night.png')} alt="Farm El Baya fields beneath a star-filled sky" fill preload fetchPriority="high" sizes="100vw" className="object-cover object-[center_58%] animate-breathe opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/20 to-transparent" />
        <h1 className="relative mx-auto max-w-7xl font-serif text-6xl italic md:text-7xl">{content.hero}</h1>
      </section>

      <section className="bg-cream px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 border-b border-olive/20 pb-10 md:grid-cols-[.75fr_1.25fr] md:items-end md:pb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-label text-olive">{content.map.eyebrow}</p>
              <h2 className="mt-3 font-serif text-5xl italic leading-tight md:text-6xl">{content.map.heading}</h2>
            </div>
            <p className="max-w-2xl leading-8 text-earth/75">{content.map.intro}</p>
          </div>
          <FarmMapViewer
            src={img('farm_map.webp')}
            labels={fr
              ? {expand: 'Voir en plein écran', close: 'Fermer la carte', download: 'Télécharger', alt: 'Carte illustrée du domaine de Farm El Baya'}
              : {expand: 'View full map', close: 'Close map', download: 'Download', alt: 'Illustrated map of the Farm El Baya grounds'}}
          />
          <div className="mt-10 grid border-y border-olive/20 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-olive/20">
            {content.map.legend.map(([label, detail], index) => (
              <div key={label} className={`py-6 lg:px-6 ${index > 0 ? 'border-t border-olive/20 sm:border-t-0' : ''} ${index === 0 ? 'lg:pl-0' : ''} ${index === content.map.legend.length - 1 ? 'lg:pr-0' : ''}`}>
                <p className="text-xs font-semibold uppercase tracking-label text-olive">{label}</p>
                <p className="mt-3 text-sm leading-6 text-earth/65">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 border-b border-olive/20 pb-10 md:grid-cols-[.75fr_1.25fr] md:items-end md:pb-12">
            <p className="text-xs font-semibold uppercase tracking-label text-olive">{content.story.eyebrow}</p>
            <h2 className="max-w-3xl font-serif text-5xl italic leading-tight md:text-6xl">{content.story.heading}</h2>
          </div>
          <div className="mt-12 grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:gap-20">
            <div className="grid gap-4 sm:grid-cols-[1.2fr_.8fr] lg:sticky lg:top-28 lg:grid-cols-1">
              <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-mist lg:aspect-[5/6]">
                <Image src={img(content.story.image)} alt={content.story.imageAlt} fill sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover object-[center_58%]" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mist lg:ml-auto lg:w-2/3 lg:-translate-y-20">
                <Image src={img(content.story.detailImage)} alt={content.story.detailImageAlt} fill sizes="(min-width: 1024px) 28vw, 50vw" className="object-cover" />
              </div>
            </div>
            <div className="divide-y divide-olive/20 border-y border-olive/20">
              {content.blocks.map((block, index) => (
                <div key={block.heading} className="grid gap-5 py-10 md:grid-cols-[64px_1fr] md:py-12">
                  <span className="font-serif text-2xl italic text-olive">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="max-w-xl font-serif text-4xl italic leading-tight">{block.heading}</h3>
                    <p className="mt-5 max-w-2xl leading-8 text-earth/75">{block.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-24 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-20">
          <div className="relative aspect-[4/5] max-w-xl overflow-hidden rounded-card bg-mist">
            <Image
              src={img('Mahdi_with_poussin_on_head.jpg')}
              alt={content.mahdi.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-label text-olive">{content.mahdi.eyebrow}</p>
            <blockquote className="mt-5 max-w-3xl font-serif text-4xl italic leading-tight md:text-6xl">“{content.mahdi.quote}”</blockquote>
            <p className="mt-5 text-sm uppercase tracking-label text-olive">Mahdi, Farm El Baya</p>
            <p className="mt-8 max-w-2xl leading-8 text-earth/75">{content.mahdi.text}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-olive/20 bg-sand px-5 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-label text-olive">{content.cta.eyebrow}</p>
            <h2 className="mt-3 font-serif text-5xl italic leading-tight md:text-6xl">{content.cta.heading}</h2>
            <p className="mt-5 max-w-2xl leading-8 text-earth/75">{content.cta.text}</p>
          </div>
          <Button href="/book">{content.cta.button}</Button>
        </div>
      </section>
    </>
  );
}
