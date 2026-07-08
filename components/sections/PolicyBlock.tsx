const policies = {
  en: [
    ['Check-in', 'From 2:00 PM. Earlier arrival is possible when the room is ready.'],
    ['Check-out', 'By 11:00 AM, with flexibility when there is no same-day arrival.'],
    ['Deposit', 'A 30% deposit confirms every booking, refundable if cancelled 7+ days before arrival.'],
    ['Cancellation', 'Free cancellation up to 7 days before arrival when no special event or group booking applies.'],
    ['Payment', 'International guests pay the deposit online with PayPal. Guests in Tunisia arrange a local bank transfer with Mahdi. The balance is settled on arrival.'],
    ['Meals', 'Farm breakfast on request (20 DT). Lunch and dinner on request (40 DT each), confirmed before arrival.'],
    ['Families', "Families and children are welcome. The farm includes open outdoor space for kids to explore. Please mention children's ages in the booking notes."],
    ['Parking', 'Free on-site parking is available. A car is recommended for the easiest arrival.'],
    ['Wi-Fi', 'Wi-Fi is available for basic use. This is a rural farm, so connection quality can vary.'],
    ['Animals', 'The farm has free-roaming animals and working dogs. Please ask before bringing pets.']
  ],
  fr: [
    ['Arrivée', "À partir de 14h. Une arrivée plus tôt est possible si la chambre est prête."],
    ['Départ', "Avant 11h, avec flexibilité s'il n'y a pas d'arrivée le même jour."],
    ['Acompte', "Un acompte de 30 % confirme chaque réservation, remboursable si annulation 7 jours ou plus avant l'arrivée."],
    ['Annulation', "Annulation gratuite jusqu'à 7 jours avant l'arrivée, hors événement spécial ou groupe."],
    ['Paiement', "Les hôtes internationaux règlent l'acompte en ligne avec PayPal. En Tunisie, l'acompte se fait par virement local avec Mahdi. Le solde est réglé à l'arrivée."],
    ['Repas', "Petit-déjeuner de la ferme sur demande (20 DT). Déjeuner et dîner sur demande (40 DT chacun), confirmés avant l'arrivée."],
    ['Familles', 'Les familles et enfants sont bienvenus. La ferme offre de grands espaces extérieurs à explorer. Indiquez les âges des enfants dans votre demande.'],
    ['Parking', 'Parking gratuit sur place. Une voiture est recommandée pour arriver facilement.'],
    ['Wi-Fi', 'Wi-Fi disponible pour un usage simple. La connexion peut varier en zone rurale.'],
    ['Animaux', 'La ferme a des animaux en liberté et des chiens de travail. Demandez avant de venir avec un animal.']
  ]
};

export default function PolicyBlock({locale}: {locale: string}) {
  const items = locale === 'fr' ? policies.fr : policies.en;

  return (
    <section className="bg-cream px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-label text-olive">{locale === 'fr' ? 'Avant de venir' : 'Before you come'}</p>
          <h2 className="mt-3 font-serif text-5xl italic">{locale === 'fr' ? 'Politiques simples.' : 'Simple stay policies.'}</h2>
          <p className="mt-4 leading-7 text-earth/75">
            {locale === 'fr'
              ? "Le parcours de réservation vous indique clairement comment confirmer vos dates et régler l'acompte."
              : 'The booking flow clearly explains how to confirm your dates and pay the deposit.'}
          </p>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {items.map(([title, text]) => (
            <div key={title} className="border border-olive/15 bg-sand/55 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-label text-olive">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-earth/75">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
