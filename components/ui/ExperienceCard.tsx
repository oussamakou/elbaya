import {Sprout} from 'lucide-react';

export default function ExperienceCard({item, index}: {item: string[]; index: number}) {
  return (
    <article className={`rounded-card border border-olive/15 bg-cream p-7 ${index % 4 === 1 ? 'md:translate-y-8' : ''}`}>
      <div className="flex items-start justify-between gap-5">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-olive/25 bg-olive/[0.07]">
          <Sprout className="h-5 w-5 text-olive" strokeWidth={1.4} />
        </div>
        <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-olive">{item[2]}</span>
      </div>
      <h3 className="mt-7 font-serif text-3xl italic">{item[0]}</h3>
      <p className="mt-3 leading-7 text-earth/75">{item[1]}</p>
    </article>
  );
}
