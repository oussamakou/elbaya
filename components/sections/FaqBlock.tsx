const faqs = {
  en: [
    ['What is included?', 'A private room, private bathroom, and access to the farm, rooftop, trails, animals, and shared outdoor spaces. Farm breakfast (20 DT) and meals are available as add-ons.'],
    ['Can I request breakfast, lunch or dinner?', 'Yes. Farm breakfast is 20 DT, and lunch and dinner are 40 DT each, per person - all on request and confirmed with your booking details.'],
    ['How do I get there?', 'The farm is near Testour, about one hour from Tunis by car. Exact arrival details are shared after your booking request.'],
    ['Do I pay now?', 'No online payment is required. A 30% deposit confirms your booking (refundable if cancelled 7+ days before), and the balance is settled on arrival.']
  ],
  fr: [
    ["Qu'est-ce qui est inclus ?", "Une chambre privée, une salle de bain privée, et l'accès à la ferme, au toit, aux sentiers, aux animaux et aux espaces extérieurs partagés. Le petit-déjeuner de la ferme (20 DT) et les repas sont disponibles en option."],
    ['Puis-je demander le petit-déjeuner, le déjeuner ou le dîner ?', "Oui. Le petit-déjeuner de la ferme est à 20 DT, le déjeuner et le dîner à 40 DT chacun, par personne - tout sur demande et confirmé avec votre réservation."],
    ['Comment arriver ?', "La ferme est près de Testour, à environ une heure de Tunis en voiture. Les détails d'arrivée sont envoyés après votre demande."],
    ['Dois-je payer maintenant ?', "Aucun paiement en ligne n'est demandé. Un acompte de 30 % confirme votre réservation (remboursable si annulation 7 jours ou plus avant), et le solde se règle à l'arrivée."]
  ]
};

export default function FaqBlock({locale}: {locale: string}) {
  const items = locale === 'fr' ? faqs.fr : faqs.en;

  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-5xl italic">{locale === 'fr' ? 'Questions pratiques' : 'Practical questions'}</h2>
        <div className="mt-8 divide-y divide-olive/15 border-y border-olive/15">
          {items.map(([question, answer]) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-medium">
                {question}
                <span className="text-2xl leading-none text-olive transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-2xl leading-7 text-earth/75">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
