'use client';

import {Leaf, Soup, PersonStanding} from 'lucide-react';
import {motion} from 'framer-motion';

const icons = [Leaf, Soup, PersonStanding];

export default function ThreePillars({items}: {items: {title: string; text: string}[]}) {
  return (
    <section className="relative px-5 py-32 md:py-48 overflow-hidden bg-sand">
      {/* Decorative large background text */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none select-none pointer-events-none opacity-[0.03]">
        <span className="block font-serif text-[20vw] whitespace-nowrap italic translate-y-[-20%]">
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
                  <div className="absolute inset-0 bg-terracotta/10 rounded-full blur-xl scale-150" />
                  <div className="absolute inset-0 border border-olive/20 rounded-full" />
                  <Icon className="relative h-8 w-8 text-olive md:h-10 md:w-10" strokeWidth={1} />
                  
                  {/* Small decorative line connecting icon to text */}
                  <div className="absolute -bottom-6 left-1/2 w-px h-6 bg-olive/20" />
                </div>
                
                <h2 className="font-serif text-4xl md:text-5xl italic text-dusk mb-6">{item.title}</h2>
                <p className="text-base leading-relaxed text-earth/80 font-light">{item.text}</p>
                
                <div className="mt-8 flex items-center gap-4 group cursor-pointer w-max">
                  <span className="text-xs uppercase tracking-widest text-terracotta font-medium group-hover:text-olive transition-colors">
                    Discover More
                  </span>
                  <div className="w-8 h-px bg-terracotta group-hover:w-12 group-hover:bg-olive transition-all duration-300" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
