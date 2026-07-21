import Image from 'next/image';
import {img} from '@/content';
import Button from './Button';

const copy = {
  en: {
    name: 'The Baya Room',
    rate: 'From 180 DT / night',
    intro: 'The Baya Room is private and air-conditioned. The olive groves, rooftop, and quiet of a working farm are just outside.',
    specs: ['Private room with a private bathroom', 'Sleeps up to 3 guests', 'Air conditioning'],
    cta: 'Request the Baya Room'
  },
  fr: {
    name: 'La Chambre Baya',
    rate: 'Dès 180 DT / nuit',
    intro: "La Chambre Baya est privée et climatisée. Les oliviers, le toit et le calme d'une ferme vivante sont juste dehors.",
    specs: ['Chambre privée avec salle de bain privée', "Jusqu'à 3 hôtes", 'Climatisation'],
    cta: 'Demander la Chambre Baya'
  }
};

export default function RoomShowcase({locale}: {locale: string}) {
  const t = locale === 'fr' ? copy.fr : copy.en;

  return (
    <section className="px-5 pb-24">
      <div className="mx-auto grid max-w-7xl items-stretch gap-6 md:grid-cols-2">
        <div className="grid gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mist ring-1 ring-inset ring-earth/10">
            <Image src={img('room-interior.webp')} alt={`${t.name} interior`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            <div className="absolute left-4 top-4 rounded-full border border-olive/25 bg-cream px-3 py-1 text-xs font-semibold text-earth shadow-sm">{t.rate}</div>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-mist ring-1 ring-inset ring-earth/10">
            <Image src={img('picking_tree_fruits.webp')} alt={`${t.name} surroundings`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-card border border-olive/15 bg-cream p-7 md:p-10">
          <h2 className="font-serif text-5xl italic">{t.name}</h2>
          <p className="mt-5 leading-8 text-earth/75">{t.intro}</p>
          <ul className="mt-7 space-y-2 text-sm leading-6 text-earth/75">
            {t.specs.map((s) => <li key={s}>· {s}</li>)}
          </ul>
          <Button href="/book" className="mt-8 w-fit">{t.cta}</Button>
        </div>
      </div>
    </section>
  );
}
