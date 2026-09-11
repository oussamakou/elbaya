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
  const links = useMemo(() => [
    ['stay', t('stay')],
    ['experiences', t('experiences')],
    ['farm', t('farm')],
    ['products', locale === 'fr' ? 'La boutique' : 'Farm shop'],
  ], [t, locale]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: close on Escape, trap focus inside the dialog, and lock
  // background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Tab') {
        const menu = document.getElementById('mobile-menu');
        if (!menu) return;
        const focusables = menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || !menu.contains(active))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || !menu.contains(active))) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  // Both of these start with a light (bg-sand) hero rather than a dark image,
  // so the nav needs dark text before the user scrolls. Guide articles
  // (/guides/[slug]) keep a dark hero image like every other page.
  const startsOnLight = pathname.includes('/book') || pathname === '/guides' || pathname.startsWith('/products') || pathname.startsWith('/admin');
  const tone = scrolled || startsOnLight ? 'text-earth' : 'text-cream';
  const shell = scrolled ? 'bg-sand/92 border-mist' : 'bg-transparent border-transparent';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-sm transition duration-500 ${shell} ${tone}`}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8 md:px-8">
        <Link href="/" locale={locale} className="relative block h-14 w-28 shrink-0 md:h-16 md:w-32">
          <Image
            fill
            sizes="(max-width: 768px) 112px, 128px"
            src="/assets/images/logo.webp"
            alt="Farm El Baya logo"
            className="object-contain object-left"
            // Above the fold, so load eagerly — but no `preload` / high fetch
            // priority: the hero image is the LCP element and should be the
            // only high-priority image on the route.
            loading="eager"
          />
        </Link>
        <div className="hidden items-center gap-5 text-sm font-medium xl:flex">
          {links.map(([href, label]) => {
            const active = pathname === `/${href}` || pathname.startsWith(`/${href}/`);
            return (
              <Link key={href} href={`/${href}`} className={`group relative flex items-center gap-2 transition hover:text-olive hover:opacity-100`}>
                <span className={`h-1 w-1 rounded-full bg-olive transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} />
                {label}
              </Link>
            );
          })}
        </div>
        <div className="hidden items-center gap-3 xl:flex">
          <LanguageToggle />
          <Link href="/book" className={`rounded-full px-5 py-2.5 text-sm font-medium transition active:scale-[0.96] bg-olive text-cream hover:bg-olive-dark`}>
            {t('bookNow')}
          </Link>
        </div>
        <div className="flex items-center gap-3 xl:hidden">
          <Link href="/book" className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition active:scale-[0.96] bg-olive text-cream hover:bg-olive-dark`}>
            {t('bookNow')}
          </Link>
          <button onClick={() => setOpen(true)} className="-m-2 p-2" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu"><Menu /></button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className={`fixed inset-0 z-50 flex h-dvh flex-col overflow-y-auto bg-sand px-6 py-6 text-earth xl:hidden`}>
          <button onClick={() => setOpen(false)} className="-m-2 ml-auto p-2" aria-label="Close menu" autoFocus><X /></button>
          <div className="my-8 flex flex-col gap-4 font-serif text-4xl italic">
            {links.map(([href, label]) => <Link key={href} href={`/${href}`} onClick={() => setOpen(false)}>{label}</Link>)}
          </div>
          <div className="mt-auto flex items-center justify-between">
            <LanguageToggle />
            <Link href="/book" onClick={() => setOpen(false)} className="rounded-full bg-olive px-5 py-3 text-sm font-medium text-cream transition hover:bg-olive-dark active:scale-[0.96]">{t('bookNow')}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
