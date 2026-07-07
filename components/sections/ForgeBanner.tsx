'use client';

import {useLocale} from 'next-intl';
import {Link} from '@/i18n/routing';

// A one-line mention, not a full pitch: Forge is a different product for a
// different audience, so it shouldn't compete with the booking CTA on the
// home page. The full email-capture teaser lives on /forge itself.
export default function ForgeBanner({content}: {content: {label: string; heading: string; text: string}}) {
  const locale = useLocale();

  return (
    <section className="border-t border-cream/10 bg-dusk px-5 py-10 text-cream">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="max-w-xl leading-7 text-cream/75">
          <span className="mr-2 align-middle text-[11px] font-medium uppercase tracking-wide text-olive-light">{content.label}</span>
          <span className="font-serif text-2xl italic">{content.heading}</span>{' '}
          {content.text}
        </p>
        <Link
          href="/forge"
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-cream/40 px-5 text-sm font-medium transition hover:bg-cream/10"
        >
          {locale === 'fr' ? 'Découvrir Forge' : 'Explore Forge'} →
        </Link>
      </div>
    </section>
  );
}
