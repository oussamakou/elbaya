'use client';

import {usePathname} from '@/i18n/routing';
import WhatsAppLink from './WhatsAppLink';

export default function FloatingWhatsApp({locale}: {locale: string}) {
  const pathname = usePathname();
  if (pathname.includes('/book')) return null;

  return (
    <WhatsAppLink
      locale={locale}
      className="fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center justify-center rounded-full bg-olive px-5 text-sm font-semibold text-cream shadow-lg transition hover:bg-earth md:hidden"
    >
      {locale === 'fr' ? 'WhatsApp' : 'Ask WhatsApp'}
    </WhatsAppLink>
  );
}
