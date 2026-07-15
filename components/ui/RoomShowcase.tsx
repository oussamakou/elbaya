import Image from 'next/image';
import {img} from '@/content';
import Button from './Button';

const copy = {
  en: {
    name: 'The Baya Room',
    rate: 'From 180 DT / night',
    intro: 'A private, air-conditioned room with the olive groves, rooftop, and indoor-outdoor movement gym just outside.',
    specs: ['Private room with a private bathroom', 'Sleeps up to 3 guests', 'Air conditioning', 'Indoor-outdoor movement gym included'],
    addons: ['Farm breakfast on request - 20 DT', 'Lunch & dinner on request - 40 DT each'],
    cta: 'Request the Baya Room'
  },
  fr: {
    name: 'La Chambre Baya',
    rate: 'Dès 180 DT / nuit',
    intro: "Une chambre privée et climatisée, avec les oliviers, le toit et l'espace de mouvement intérieur et extérieur juste dehors.",
    specs: ['Chambre privée avec salle de bain privée', "Jusqu'à 3 hôtes", 'Climatisation', 'Espace de mouvement intérieur et extérieur inclus'],
    addons: ['Petit-déjeuner de la ferme sur demande - 20 DT', 'Déjeuner et dîner sur demande - 40 DT chacun'],
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
            <Image src={img('room_exterior_vibe.webp')} alt={`${t.name} surroundings`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-card border border-olive/15 bg-cream p-7 md:p-10">
          <h2 className="font-serif text-5xl italic">{t.name}</h2>
          <p className="mt-5 leading-8 text-earth/75">{t.intro}</p>
          <ul className="mt-7 space-y-2 text-sm leading-6 text-earth/75">
            {t.specs.map((s) => <li key={s}>· {s}</li>)}
          </ul>
          <div className="mt-6 border-t border-olive/15 pt-5">
            <p className="text-xs font-semibold uppercase tracking-label text-olive">{locale === 'fr' ? 'En option' : 'Add-ons'}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-earth/75">
              {t.addons.map((a) => <li key={a}>· {a}</li>)}
            </ul>
          </div>
          <Button href="/book" className="mt-8 w-fit">{t.cta}</Button>
        </div>
      </div>
    </section>
  );
}
