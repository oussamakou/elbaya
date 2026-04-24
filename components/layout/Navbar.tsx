'use client';

import Image from 'next/image';
import {Menu, X} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, Link} from '@/i18n/routing';
import {useEffect, useMemo, useState} from 'react';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isForge = pathname.includes('/forge');
  const links = useMemo(() => [
    ['stay', t('stay')],
    ['experiences', t('experiences')],
    ['farm', t('farm')],
    ['book', t('book')],
    ['forge', t('forge')]
  ], [t]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const startsOnLight = pathname.includes('/book');
  const tone = isForge ? 'text-cream' : scrolled || startsOnLight ? 'text-earth' : 'text-cream';
  const shell = scrolled ? (isForge ? 'bg-dusk/92 border-cream/10' : 'bg-sand/92 border-mist') : 'bg-transparent border-transparent';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-sm transition duration-500 ${shell} ${tone}`}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8 md:px-8">
        <Link href="/" locale={locale} className="relative h-16 w-32 shrink-0 overflow-hidden">
          <Image src="/assets/images/logo.png" alt="Farm El Baya" fill className="scale-[3.4] object-contain" priority />
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={`/${href}`} className={`${href === 'forge' ? 'opacity-70' : ''} transition hover:text-terracotta hover:opacity-100`}>
              {label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <Link href={isForge ? '/forge#apply' : '/book'} className={`rounded-full px-5 py-2.5 text-sm font-medium transition active:scale-[0.97] ${isForge ? 'border border-cream/60 hover:bg-cream hover:text-dusk' : 'bg-terracotta text-cream hover:bg-earth'}`}>
            {isForge ? `${t('apply')} →` : t('bookNow')}
          </Link>
        </div>
        <button onClick={() => setOpen(true)} className="md:hidden" aria-label="Open menu"><Menu /></button>
      </nav>
      {open && (
        <div className={`fixed inset-0 z-50 flex min-h-screen flex-col bg-sand px-6 py-6 text-earth md:hidden`}>
          <button onClick={() => setOpen(false)} className="ml-auto" aria-label="Close menu"><X /></button>
          <div className="mt-16 flex flex-col gap-8 font-serif text-5xl italic">
            {links.map(([href, label]) => <Link key={href} href={`/${href}`} onClick={() => setOpen(false)}>{label}</Link>)}
          </div>
          <div className="mt-auto flex items-center justify-between">
            <LanguageToggle />
            <Link href="/book" onClick={() => setOpen(false)} className="rounded-full bg-terracotta px-5 py-3 text-sm font-medium text-cream">{t('bookNow')}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
