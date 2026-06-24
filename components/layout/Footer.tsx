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
    <footer className="border-t border-mist bg-sand px-6 py-12 text-earth md:px-5">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-4">
          <div className="relative h-40 w-56 md:h-56 md:w-72">
            <Image src="/assets/images/logo.png" alt="Farm El Baya" fill className="object-contain object-left" sizes="(max-width: 768px) 224px, 288px" />
          </div>
          <p className="font-serif text-3xl italic">{t('tagline')}</p>
          <p className="text-sm text-bark">{t('direct')}</p>
        </div>
        <div className="space-y-5 md:text-right">
          <div className="flex flex-wrap gap-5 text-sm font-medium md:justify-end">
            {links.map(([href, label]) => <Link key={href} href={href} className="transition hover:text-terracotta">{label}</Link>)}
          </div>
          <p className="text-sm text-bark">
            <a href="https://www.instagram.com/farm_elbaya/" target="_blank" rel="noreferrer" className="transition hover:text-earth">@farmelbaya</a>
            {' · '}
            <a href="https://www.instagram.com/holistic.athlete/" target="_blank" rel="noreferrer" className="transition hover:text-earth">@holistic.athlete</a>
          </p>
          <p className="max-w-full break-words text-xs uppercase tracking-label text-bark sm:tracking-label">
            © Farm El Baya · <a href="https://farmelbaya.com" target="_blank" rel="noreferrer" className="transition hover:text-earth">farmelbaya.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
