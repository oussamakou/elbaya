import Image from 'next/image';
import {img} from '@/content';
import Button from './Button';

const rooms = [
  {
    image: 'room-interior.webp',
    en: {name: 'Olive Room', bed: 'Queen bed + optional single', detail: 'Warm interior, olive-grove window, private bathroom'},
    fr: {name: 'Chambre Olivier', bed: 'Lit queen + lit simple possible', detail: 'Interieur chaleureux, vue oliviers, salle de bain privee'}
  },
  {
    image: 'room_exterior_vibe.webp',
    en: {name: 'Garden Room', bed: 'Double bed + flexible guest setup', detail: 'Closest to the garden paths, quiet entrance, private bathroom'},
    fr: {name: 'Chambre Jardin', bed: 'Lit double + couchage flexible', detail: 'Proche des sentiers du jardin, entree calme, salle de bain privee'}
  },
  {
    image: 'rooftop_nightsky.webp',
    en: {name: 'Rooftop Room', bed: 'Double bed, best for 1-2 guests', detail: 'Easy rooftop access for stargazing, private bathroom'},
    fr: {name: 'Chambre Toit', bed: 'Lit double, ideale pour 1-2 hotes', detail: 'Acces facile au rooftop pour les etoiles, salle de bain privee'}
  }
];

export default function RoomCard({name, locale, index = 0}: {name: string; locale: string; index?: number}) {
  const fr = locale === 'fr';
  const room = rooms[index % rooms.length];
  const copy = fr ? room.fr : room.en;

  return (
    <article className="overflow-hidden rounded-[8px] border border-mist bg-cream">
      <div className="relative aspect-[4/3] bg-mist">
        <Image src={img(room.image)} alt={copy.name || name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        <div className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-earth shadow-sm">180 DT / {fr ? 'nuit' : 'night'}</div>
      </div>
      <div className="p-5">
        <h2 className="font-serif text-3xl italic">{copy.name}</h2>
        <div className="mt-4 space-y-2 text-sm leading-6 text-earth/75">
          <p>{copy.bed}</p>
          <p>{fr ? "Jusqu'a 3 hotes" : 'Up to 3 guests'}</p>
          <p>{copy.detail}</p>
          <p>{fr ? "Petit-dejeuner inclus : oeufs, huile d'olive, yaourt maison, fruits, pains tunisiens, jus." : "Breakfast included: farm eggs, olive oil, homemade yogurt, seasonal fruit, Tunisian breads, fresh juice."}</p>
          <p>{fr ? 'Dejeuner et diner sur demande.' : 'Lunch and dinner available on request.'}</p>
        </div>
        <Button href="/book" className="mt-6">{fr ? 'Demander cette chambre' : 'Request this room'}</Button>
      </div>
    </article>
  );
}
