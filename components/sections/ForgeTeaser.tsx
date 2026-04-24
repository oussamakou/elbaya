'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

export default function ForgeTeaser({content}: {content: {label: string; heading: string; text: string; button: string}}) {
  const t = useTranslations('common');
  const [sent, setSent] = useState(false);

  async function submit(formData: FormData) {
    const email = String(formData.get('email') || '');
    await fetch('/api/waitlist', {method: 'POST', body: JSON.stringify({email, source: 'home-forge'}), headers: {'Content-Type': 'application/json'}});
    setSent(true);
  }

  return (
    <section className="grain bg-dusk px-5 py-24 text-cream md:py-32">
      <div className="relative mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-olive">{content.label}</p>
        <h2 className="mt-6 font-serif text-6xl md:text-7xl">{content.heading}</h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-cream/70">{content.text}</p>
        <form action={submit} className="mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input className="field border-cream/15 bg-cream/8 text-cream placeholder:text-cream/45" name="email" type="email" required placeholder={t('email')} />
          <button className="rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-cream transition hover:bg-cream hover:text-dusk active:scale-[0.97]">{sent ? t('notify') : content.button}</button>
        </form>
      </div>
    </section>
  );
}
