import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img} from '@/content';
import Button from '@/components/ui/Button';
import ForgeWaitlist from '@/components/ui/ForgeWaitlist';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const content = getContent(locale, 'forge');
  return {title: content.meta.title, description: content.meta.description, alternates: {canonical: `/${locale}/forge`}, openGraph: {images: [img('breakfast.webp')]}};
}

export default async function Forge({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'forge');
  return (
    <div className="grain min-h-screen bg-dusk text-cream">
      <section className="relative flex min-h-screen items-center px-5 pt-20">
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-olive">{content.hero.label}</p>
          <h1 className="mt-8 whitespace-pre-line font-serif text-6xl italic leading-[0.96] md:text-[80px]">{content.hero.heading}</h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-cream/65">{content.hero.body}</p>
          <div className="mt-9 flex flex-wrap gap-4 text-sm uppercase tracking-[0.16em] text-cream/70">{content.stats.map((stat) => <span key={stat}>{stat}</span>)}</div>
          <Button href="#apply" variant="dark" className="mt-9">{content.hero.cta}</Button>
        </div>
      </section>
      <section className="relative px-5 py-24">
        <div className="mx-auto max-w-5xl divide-y divide-cream/12">
          {content.week.map((item) => <div key={item[0]} className="grid gap-5 py-9 md:grid-cols-[.45fr_1fr]"><h2 className="text-sm font-medium tracking-[0.18em] text-cream">{item[0]}</h2><p className="max-w-xl text-xl leading-8 text-cream/68">{item[1]}</p></div>)}
        </div>
      </section>
      <section className="relative px-5 py-20">
        <p className="mx-auto max-w-4xl whitespace-pre-line font-serif text-4xl italic leading-tight md:text-6xl">{content.notFor}</p>
      </section>
      <section className="relative px-5 py-16">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-4">{content.included.map((item) => <div key={item} className="border border-cream/12 p-5 text-sm uppercase tracking-[0.16em] text-cream/75">{item}</div>)}</div>
      </section>
      <section className="relative px-5 py-20">
        <div className="mx-auto max-w-4xl space-y-5">{content.faq.map((item) => <details key={item[0]} className="border-b border-cream/12 py-5"><summary className="cursor-pointer font-serif text-3xl italic">{item[0]}</summary><p className="mt-4 leading-8 text-cream/65">{item[1]}</p></details>)}</div>
      </section>
      <section id="apply" className="relative px-5 py-28 text-center">
        <h2 className="mx-auto max-w-3xl font-serif text-5xl italic leading-tight">{content.waitlist}</h2>
        <ForgeWaitlist button={content.hero.cta} />
        <p className="mt-5 text-sm text-cream/50">{locale === 'fr' ? 'Réponse sous 48 heures.' : 'You will hear back within 48 hours.'}</p>
      </section>
      <section className="relative px-5 pb-16 text-center">
        <Button href="/farm" variant="dark">{locale === 'fr' ? '← Retour à la Ferme El Baya' : '← Back to Farm El Baya'}</Button>
      </section>
    </div>
  );
}
