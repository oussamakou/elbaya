const policies = {
  en: [
    ['Check-in', 'From 3:00 PM. Earlier arrival is possible when the room is ready.'],
    ['Check-out', 'By 11:00 AM, with flexibility when there is no same-day arrival.'],
    ['Deposit', 'A 30% deposit may be requested in peak periods to secure your dates.'],
    ['Cancellation', 'Free cancellation up to 7 days before arrival when no special event or group booking applies.'],
    ['Payment', 'Payment is settled on arrival by cash or bank transfer. International guests can settle by cash on arrival or a Wise transfer.'],
    ['Meals', 'Breakfast is included. Lunch and dinner are available on request and confirmed before arrival.'],
    ['Families', 'Families and children are welcome. The farm includes open outdoor space and a kids playground area. Please mention children ages in the booking notes.'],
    ['Parking', 'Free on-site parking is available. A car is recommended for the easiest arrival.'],
    ['Wi-Fi', 'Wi-Fi is available for basic use. This is a rural farm, so connection quality can vary.'],
    ['Animals', 'The farm has free-roaming animals and working dogs. Please ask before bringing pets.']
  ],
  fr: [
    ['Arrivée', "À partir de 15h. Une arrivée plus tôt est possible si la chambre est prête."],
    ['Départ', "Avant 11h, avec flexibilité s'il n'y a pas d'arrivée le même jour."],
    ['Acompte', 'Un acompte de 30 % peut être demandé en haute saison pour bloquer vos dates.'],
    ['Annulation', "Annulation gratuite jusqu'à 7 jours avant l'arrivée, hors événement spécial ou groupe."],
    ['Paiement', "Paiement à l'arrivée en espèces ou par virement. Les hôtes internationaux peuvent régler en espèces à l'arrivée ou par un virement Wise."],
    ['Repas', "Petit-déjeuner inclus. Déjeuner et dîner sur demande, confirmés avant l'arrivée."],
    ['Familles', 'Les familles et enfants sont bienvenus. La ferme inclut des espaces extérieurs et une aire de jeux enfants. Indiquez les âges dans votre demande.'],
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
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bark">{locale === 'fr' ? 'Avant de venir' : 'Before you come'}</p>
          <h2 className="mt-3 font-serif text-5xl italic">{locale === 'fr' ? 'Politiques simples.' : 'Simple stay policies.'}</h2>
          <p className="mt-4 leading-7 text-earth/72">
            {locale === 'fr'
              ? 'Les détails finaux sont confirmés avec Mahdi après votre demande, avant tout acompte.'
              : 'Final details are confirmed with Mahdi after your request, before any deposit is taken.'}
          </p>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {items.map(([title, text]) => (
            <div key={title} className="border border-mist bg-sand/55 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-bark">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-earth/75">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
