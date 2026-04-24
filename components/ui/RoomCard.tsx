import Button from './Button';

export default function RoomCard({name, locale}: {name: string; locale: string}) {
  const fr = locale === 'fr';
  return (
    <article className="rounded-[8px] border border-mist bg-cream p-5">
      <div className="flex aspect-[4/3] items-center justify-center rounded-[6px] bg-mist text-xs uppercase tracking-[0.18em] text-bark">PHOTO: Room interior</div>
      <h2 className="mt-6 font-serif text-3xl italic">{name}</h2>
      <div className="mt-4 space-y-2 text-sm leading-6 text-earth/75">
        <p>{fr ? "Jusqu'à 3 hôtes" : 'Up to 3 guests'}</p>
        <p>{fr ? 'Salle de bain privée incluse' : 'Private bathroom included'}</p>
        <p className="font-medium text-earth">180 DT / {fr ? 'nuit' : 'night'}</p>
        <p>{fr ? "Petit-déjeuner inclus : œufs, huile d'olive, yaourt maison, fruits, pains tunisiens, jus." : "Breakfast included: farm eggs, olive oil, homemade yogurt, seasonal fruit, Tunisian breads, fresh juice."}</p>
        <p>{fr ? 'Déjeuner et dîner sur demande.' : 'Lunch and dinner available on request.'}</p>
      </div>
      <Button href="/book" className="mt-6">{fr ? 'Réserver cette chambre →' : 'Book this room →'}</Button>
    </article>
  );
}
