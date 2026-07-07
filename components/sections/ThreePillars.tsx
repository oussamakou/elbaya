'use client';

import {Leaf, Soup, PersonStanding} from 'lucide-react';
import {motion} from 'framer-motion';
import {useLocale} from 'next-intl';
import {Link} from '@/i18n/routing';

const icons = [Leaf, Soup, PersonStanding];
const hrefs = ['/stay', '/experiences', '/farm'];

export default function ThreePillars({items}: {items: {title: string; text: string}[]}) {
  const locale = useLocale();
  const discoverLabel = locale === 'fr' ? 'Découvrir' : 'Discover more';
  return (
    <section className="relative px-5 py-32 md:py-48 overflow-hidden bg-olive-wash">
      {/* Decorative large background text */}
      <div className="absolute inset-x-0 top-0 overflow-hidden px-5 leading-none select-none pointer-events-none opacity-[0.035]">
        <span className="block max-w-full translate-y-[-12%] whitespace-nowrap font-serif text-[clamp(4.5rem,13vw,11rem)] italic">
          El Baya Retreat
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-20 md:grid-cols-3 md:gap-12">
          {items.map((item, index) => {
            const Icon = icons[index];
            const isMiddle = index === 1;
            const isLast = index === 2;
            
            return (
              <motion.article 
                key={item.title}
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-100px'}}
                transition={{duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1]}}
                className={`relative flex flex-col ${isMiddle ? 'md:mt-32' : isLast ? 'md:mt-16' : ''}`}
              >
                {/* Visual anchor / Icon badge */}
                <div className="relative mb-10 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-olive/10 rounded-full blur-xl scale-150" />
                  <div className="absolute inset-0 rounded-full bg-olive/[0.07]" />
                  <div className="absolute inset-0 border border-olive/25 rounded-full" />
                  <Icon className="relative h-8 w-8 text-olive md:h-10 md:w-10" strokeWidth={1} />
                  
                  {/* Small decorative line connecting icon to text */}
                  <div className="absolute -bottom-6 left-1/2 w-px h-6 bg-olive/20" />
                </div>
                
                <h2 className="font-serif text-4xl md:text-5xl italic text-dusk mb-6">{item.title}</h2>
                <p className="text-base leading-relaxed text-earth/75 font-light">{item.text}</p>
                
                <Link href={hrefs[index]} className="group mt-8 flex w-max items-center gap-4">
                  <span className="text-xs uppercase tracking-widest text-olive font-medium group-hover:text-olive-dark transition-colors">
                    {discoverLabel}
                  </span>
                  <div className="w-8 h-px bg-olive group-hover:w-12 group-hover:bg-olive-dark transition-[width,background-color] duration-300" />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
