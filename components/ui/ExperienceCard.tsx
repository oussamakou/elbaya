import {Sprout} from 'lucide-react';

export default function ExperienceCard({item, index}: {item: string[]; index: number}) {
  return (
    <article className={`rounded-[8px] border border-mist bg-cream p-7 ${index % 4 === 1 ? 'md:translate-y-8' : ''}`}>
      <div className="flex items-start justify-between gap-5">
        <Sprout className="mt-1 h-6 w-6 shrink-0 text-olive" strokeWidth={1.4} />
        <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-bark">{item[2]}</span>
      </div>
      <h2 className="mt-7 font-serif text-3xl italic">{item[0]}</h2>
      <p className="mt-3 leading-7 text-earth/70">{item[1]}</p>
    </article>
  );
}
