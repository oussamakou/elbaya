'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

export default function ForgeWaitlist({button}: {button: string}) {
  const t = useTranslations('common');
  const [done, setDone] = useState(false);

  async function submit(formData: FormData) {
    const email = String(formData.get('email') || '');
    await fetch('/api/waitlist', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, source: 'forge'})});
    setDone(true);
  }

  return (
    <form action={submit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
      <input className="field field-dark placeholder:text-cream/45" name="email" type="email" required placeholder={t('email')} />
      <button className="rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-cream transition hover:bg-cream hover:text-dusk active:scale-[0.97]">{done ? t('notify') : button}</button>
    </form>
  );
}
