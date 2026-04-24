const faqs = {
  en: [
    ['What is included?', 'A private room, private bathroom, breakfast every morning, access to the farm, rooftop, trails, animals, and shared outdoor spaces.'],
    ['Can I request lunch or dinner?', 'Yes. Lunch and dinner are available on request and are confirmed with your booking details.'],
    ['How do I get there?', 'The farm is near Testour, about one hour from Tunis by car. Exact arrival details are shared after your booking request.'],
    ['Do I pay now?', 'No online payment is required on the form. Payment is settled on arrival, and a 30% deposit may be requested during peak season.']
  ],
  fr: [
    ['Qu est-ce qui est inclus ?', 'Une chambre privee, une salle de bain privee, le petit-dejeuner chaque matin, et l acces a la ferme, au toit, aux sentiers, aux animaux et aux espaces exterieurs partages.'],
    ['Puis-je demander le dejeuner ou le diner ?', 'Oui. Le dejeuner et le diner sont disponibles sur demande et confirmes avec les details de votre reservation.'],
    ['Comment arriver ?', 'La ferme est pres de Testour, a environ une heure de Tunis en voiture. Les details d arrivee sont envoyes apres votre demande.'],
    ['Dois-je payer maintenant ?', 'Aucun paiement en ligne n est demande dans le formulaire. Le paiement se fait a l arrivee, avec un acompte possible de 30 % en haute saison.']
  ]
};

export default function FaqBlock({locale}: {locale: string}) {
  const items = locale === 'fr' ? faqs.fr : faqs.en;

  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-5xl italic">{locale === 'fr' ? 'Questions pratiques' : 'Practical questions'}</h2>
        <div className="mt-8 divide-y divide-mist border-y border-mist">
          {items.map(([question, answer]) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-medium">
                {question}
                <span className="text-2xl leading-none text-terracotta group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-2xl leading-7 text-earth/72">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
