import Image from 'next/image';
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {getContent, img, pageMetadata} from '@/content';
import Button from '@/components/ui/Button';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return pageMetadata(locale, 'guides', '/guides', 'trail_in_thefarm.webp');
}

export default async function Guides({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'guides');

  return (
    <>
      <section className="bg-sand px-5 pb-16 pt-40">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-label text-olive">{content.indexLabel}</p>
          <h1 className="mt-4 font-serif text-6xl italic md:text-7xl">{content.hero.heading}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-earth/75">{content.hero.subhead}</p>
        </div>
      </section>
      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {content.guides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group flex flex-col overflow-hidden border border-mist bg-cream">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={img(guide.image)} alt={guide.imageAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-sand px-3 py-1 text-xs font-medium text-olive">{guide.tag}</span>
                <h2 className="mt-4 font-serif text-3xl italic leading-tight">{guide.hero}</h2>
                <p className="mt-3 text-sm leading-6 text-earth/75">{guide.teaser}</p>
                <span className="mt-auto pt-5 text-sm font-medium text-olive transition group-hover:text-olive-dark">{content.readGuide} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-cream px-5 py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-5xl italic">{content.cta.heading}</h2>
        <p className="mx-auto mt-4 max-w-xl leading-8 text-earth/75">{content.cta.text}</p>
        <Button href="/book" className="mt-8">{content.cta.button}</Button>
      </section>
    </>
  );
}
