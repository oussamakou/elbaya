import {ArrowRight} from 'lucide-react';
import {useLocale} from 'next-intl';
import {Link} from '@/i18n/routing';
import Reveal from '@/components/ui/Reveal';

const hrefs = ['/stay', '/experiences', '/farm'];

export default function ThreePillars({items}: {items: {title: string; text: string}[]}) {
  const locale = useLocale();
  const discoverLabel = locale === 'fr' ? 'Découvrir' : 'Discover more';
  return (
    <section className="bg-sand px-5 py-24 md:py-32">
      <div className="mx-auto max-w-7xl border-y border-olive/20">
        <div className="grid md:grid-cols-3 md:divide-x md:divide-olive/20">
          {items.map((item, index) => {
            return (
              <Reveal key={item.title} delay={index * 0.12} className={index > 0 ? 'border-t border-olive/20 md:border-t-0' : ''}>
                <article className={`flex h-full flex-col py-10 md:px-9 md:py-12 ${index === 0 ? 'md:pl-0' : ''} ${index === items.length - 1 ? 'md:pr-0' : ''}`}>
                  <p className="text-sm font-medium text-olive-dark">0{index + 1}</p>
                  <h2 className="mt-8 font-serif text-4xl text-dusk md:text-5xl">{item.title}</h2>
                  <p className="mt-6 flex-1 text-base font-light leading-8 text-earth/75">{item.text}</p>

                  <Link href={hrefs[index]} className="group mt-9 inline-flex w-max items-center gap-3 text-sm font-medium text-olive-dark transition-colors hover:text-earth">
                    <span>{discoverLabel}</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
