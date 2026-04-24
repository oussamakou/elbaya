'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/routing';

export default function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(nextLocale: 'en' | 'fr') {
    localStorage.setItem('farm-el-baya-locale', nextLocale);
    router.replace(pathname, {locale: nextLocale});
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-current/15 px-2 py-1 text-xs font-medium">
      {(['en', 'fr'] as const).map((item) => (
        <button
          key={item}
          onClick={() => switchTo(item)}
          className={`rounded-full px-2 py-1 transition ${locale === item ? 'bg-current text-sand' : 'opacity-65 hover:opacity-100'}`}
          aria-label={`Switch to ${item.toUpperCase()}`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
