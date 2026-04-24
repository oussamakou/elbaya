import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const links = locale === 'fr'
    ? [['/stay', 'Sejour'], ['/farm', 'La ferme'], ['/experiences', 'Experiences'], ['/forge', 'Forge'], ['/book', 'Reserver']]
    : [['/stay', 'Stay'], ['/farm', 'The Farm'], ['/experiences', 'Experiences'], ['/forge', 'Forge'], ['/book', 'Book']];

  return (
    <footer className="border-t border-mist bg-sand px-8 py-16 text-earth md:px-5">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-5">
          <div className="relative h-40 w-44">
            <Image src="/assets/images/logo-cropped.png" alt="Farm El Baya" fill className="object-contain object-left" sizes="176px" />
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
          <p className="max-w-full break-words text-xs uppercase tracking-[0.12em] text-bark sm:tracking-[0.22em]">
            © Farm El Baya · <a href="https://farmelbaya.com" target="_blank" rel="noreferrer" className="transition hover:text-earth">farmelbaya.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
