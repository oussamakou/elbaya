import {Leaf, Soup, PersonStanding} from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const icons = [Leaf, Soup, PersonStanding];

export default function ThreePillars({items}: {items: {title: string; text: string}[]}) {
  return (
    <section className="px-5 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = icons[index];
          return (
            <Reveal key={item.title} delay={index * 0.12} className={index === 1 ? 'md:mt-12' : index === 2 ? 'md:mt-4' : ''}>
              <article className="space-y-6">
                <Icon className="h-8 w-8 text-olive" strokeWidth={1.4} />
                <h2 className="font-serif text-4xl italic">{item.title}</h2>
                <p className="max-w-sm leading-8 text-earth/75">{item.text}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
