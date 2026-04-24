import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const links = locale === 'fr'
    ? [['/stay', 'Séjour'], ['/farm', 'La ferme'], ['/experiences', 'Expériences'], ['/forge', 'Forge'], ['/book', 'Réserver']]
    : [['/stay', 'Stay'], ['/farm', 'The Farm'], ['/experiences', 'Experiences'], ['/forge', 'Forge'], ['/book', 'Book']];

  return (
    <footer className="border-t border-mist bg-sand px-5 py-16 text-earth">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-5">
          <div className="relative h-28 w-48 overflow-visible">
            <Image src="/assets/images/logo.png" alt="Farm El Baya" fill className="scale-[2.1] object-contain object-left" />
          </div>
          <p className="font-serif text-3xl italic">{t('tagline')}</p>
          <p className="text-sm text-bark">{t('direct')}</p>
        </div>
        <div className="space-y-5 md:text-right">
          <div className="flex flex-wrap gap-5 text-sm font-medium md:justify-end">
            {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
          <p className="text-sm text-bark">@farmelbaya · @holistic.athlete</p>
          <p className="text-xs uppercase tracking-[0.22em] text-bark">{t('legal')}</p>
        </div>
      </div>
    </footer>
  );
}
