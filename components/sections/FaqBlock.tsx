const faqs = {
  en: [
    ['What is included?', 'A private room, private bathroom, and access to the farm, rooftop, trails, animals, and shared outdoor spaces. Farm breakfast (20 DT) and meals are available as add-ons.'],
    ['Can I request breakfast, lunch or dinner?', 'Yes. Farm breakfast is 20 DT, and lunch and dinner are 40 DT each, per person - all on request and confirmed with your booking details.'],
    ['How do I get there?', 'The farm is in Slouguia village, about one hour from Tunis - take the Testour exit off the Béja highway. Exact directions and a GPS link are shared after your booking request.'],
    ['How do I pay the deposit?', 'International guests pay the 30% deposit through PayPal during Lodgify checkout. Guests in Tunisia confirm their dates with Mahdi on WhatsApp and receive local bank-transfer details. The balance is settled on arrival.'],
    ['Can we cook our own meals?', "Yes. You're welcome to use two kitchens on site - one indoor, one outdoor - if you'd rather cook than order. Small grocery shops are about 10 minutes away in Testour or Mjez El Beb."],
    ['Is there Wi-Fi, air conditioning, or heating?', "Wi-Fi is available for basic use, though connection can vary on a rural farm. There's no air conditioning - fans are provided and the room has several windows - and heating is available in winter."],
    ['Can we go horseback riding?', "There's a gentle horse on the farm. If you have riding experience, you're welcome to ride or walk with him - we don't currently offer a formal guided riding service."],
    ["What's worth visiting nearby?", 'The Roman site of Dougga is close by and well worth it, along with the towns of Testour and Teboursouk. Le Kef is about 1.5 hours away. For meals out, Les Vergers des Montagnes (15 minutes, reserve a day ahead) and Le Malouf in Testour are both good options.'],
    ['Can we check out later than 11:00 AM?', "Often, yes - especially for a late flight. Just let us know your travel plans and we'll do our best to work something out."]
  ],
  fr: [
    ["Qu'est-ce qui est inclus ?", "Une chambre privée, une salle de bain privée, et l'accès à la ferme, au toit, aux sentiers, aux animaux et aux espaces extérieurs partagés. Le petit-déjeuner de la ferme (20 DT) et les repas sont disponibles en option."],
    ['Puis-je demander le petit-déjeuner, le déjeuner ou le dîner ?', "Oui. Le petit-déjeuner de la ferme est à 20 DT, le déjeuner et le dîner à 40 DT chacun, par personne - tout sur demande et confirmé avec votre réservation."],
    ['Comment arriver ?', "La ferme se trouve au village de Slouguia, à environ une heure de Tunis - prenez la sortie de Testour sur l'autoroute de Béja. L'itinéraire exact et un lien GPS sont envoyés après votre demande."],
    ["Comment régler l'acompte ?", "Les hôtes internationaux règlent l'acompte de 30 % via PayPal pendant la réservation Lodgify. En Tunisie, les dates sont confirmées avec Mahdi sur WhatsApp avant l'envoi des coordonnées bancaires locales. Le solde se règle à l'arrivée."],
    ['Peut-on cuisiner nous-mêmes ?', "Oui. Vous avez accès à deux cuisines sur place - une intérieure, une extérieure - si vous préférez cuisiner plutôt que commander. De petites épiceries se trouvent à environ 10 minutes, à Testour ou Mjez El Beb."],
    ['Y a-t-il le Wi-Fi, la climatisation ou le chauffage ?', "Le Wi-Fi est disponible pour un usage simple, même si la connexion peut varier en zone rurale. Il n'y a pas de climatisation - des ventilateurs sont fournis et la chambre a plusieurs fenêtres - et le chauffage est disponible en hiver."],
    ["Peut-on faire de l'équitation ?", "Il y a un cheval très gentil sur la ferme. Si vous avez de l'expérience, vous pouvez le monter ou vous promener avec lui - nous ne proposons pas pour l'instant de service d'équitation encadré."],
    ['Que visiter aux alentours ?', "Le site romain de Dougga est tout proche et vaut vraiment le détour, tout comme les villages de Testour et Teboursouk. Le Kef est à environ 1h30. Pour manger à l'extérieur, Les Vergers des Montagnes (15 minutes, réservation la veille) et Le Malouf à Testour sont deux bonnes options."],
    ['Peut-on partir plus tard que 11h ?', "Souvent, oui - surtout pour un vol tardif. Indiquez-nous simplement vos plans de voyage et nous ferons de notre mieux pour nous arranger."]
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
