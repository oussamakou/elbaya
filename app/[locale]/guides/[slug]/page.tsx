import Image from 'next/image';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {buildMetadata, getContent, getGuide, guideSlugs, img, SITE_NAME, SITE_URL} from '@/content';
import Button from '@/components/ui/Button';
import QuickFacts from '@/components/sections/QuickFacts';
import Reveal from '@/components/ui/Reveal';

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string; slug: string}>}): Promise<Metadata> {
  const {locale, slug} = await params;
  const guide = getGuide(locale, slug);
  if (!guide) return {};
  return buildMetadata(locale, `/guides/${slug}`, guide.meta, guide.image, 'article');
}

export default async function GuidePage({params}: {params: Promise<{locale: string; slug: string}>}) {
  const {locale, slug} = await params;
  const guide = getGuide(locale, slug);
  if (!guide) notFound();
  setRequestLocale(locale);
  const content = getContent(locale, 'guides');
  const related = content.guides.filter((other) => other.slug !== slug);
  const safeLocale = locale === 'fr' ? 'fr' : 'en';
  const url = `${SITE_URL}/${safeLocale}/guides/${slug}`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.meta.title,
    description: guide.meta.description,
    image: `${SITE_URL}${img(guide.image)}`,
    inLanguage: safeLocale,
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    mainEntityOfPage: url,
    author: {'@type': 'Organization', name: SITE_NAME, url: SITE_URL},
    publisher: {'@type': 'Organization', name: SITE_NAME, logo: {'@type': 'ImageObject', url: `${SITE_URL}/assets/images/logo.webp`}}
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: content.breadcrumbHome, item: `${SITE_URL}/${safeLocale}`},
      {'@type': 'ListItem', position: 2, name: content.indexLabel, item: `${SITE_URL}/${safeLocale}/guides`},
      {'@type': 'ListItem', position: 3, name: guide.hero, item: url}
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(articleLd)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbLd)}} />
      <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-dusk px-5 pb-16 text-cream">
        <Image src={img(guide.image)} alt={guide.imageAlt} fill preload fetchPriority="high" sizes="100vw" className="object-cover animate-breathe opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/30 to-transparent" />
        <div className="relative mx-auto w-full max-w-4xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-label text-cream/80">
            <Link href="/" className="transition hover:text-cream">{content.breadcrumbHome}</Link>
            <span aria-hidden>/</span>
            <Link href="/guides" className="transition hover:text-cream">{content.indexLabel}</Link>
          </nav>
          <h1 className="mt-4 font-serif text-5xl italic leading-tight md:text-6xl">{guide.hero}</h1>
        </div>
      </section>
      <QuickFacts facts={guide.facts} />
      <article className="px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-serif text-2xl italic leading-relaxed text-earth md:text-3xl">{guide.lead}</p>
          {guide.sections.map((section) => (
            <Reveal key={section.heading} className="mt-14">
              <h2 className="font-serif text-4xl italic leading-tight">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-5 leading-8 text-earth/75">{paragraph}</p>
              ))}
            </Reveal>
          ))}
          {guide.credit && <p className="mt-14 text-xs text-earth/50">{guide.credit}</p>}
        </div>
      </article>
      <section className="bg-cream px-5 py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-5xl italic leading-tight">{guide.cta.heading}</h2>
        <p className="mx-auto mt-4 max-w-xl leading-8 text-earth/75">{guide.cta.text}</p>
        <Button href="/book" className="mt-8">{content.cta.button}</Button>
      </section>
      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl italic">{content.relatedHeading}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {related.map((other) => (
              <Link key={other.slug} href={`/guides/${other.slug}`} className="group border border-mist bg-cream p-6">
                <span className="w-fit rounded-full bg-sand px-3 py-1 text-xs font-medium text-olive">{other.tag}</span>
                <h3 className="mt-4 font-serif text-2xl italic leading-tight">{other.hero}</h3>
                <p className="mt-3 text-sm leading-6 text-earth/75">{other.teaser}</p>
                <span className="mt-4 inline-block text-sm font-medium text-olive transition group-hover:text-olive-dark">{content.readGuide} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
