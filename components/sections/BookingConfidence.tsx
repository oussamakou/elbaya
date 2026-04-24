import Button from '@/components/ui/Button';
import WhatsAppLink from '@/components/ui/WhatsAppLink';

const content = {
  en: {
    eyebrow: 'Book direct with confidence',
    heading: 'No platform fees. Clear next steps. A real host replies.',
    text: 'Send your dates, guest count, and room preference. Mahdi replies within 24 hours with availability, meal options, and any deposit details before anything is confirmed.',
    cta: 'Request availability',
    points: ['Breakfast included every morning', 'Payment settled on arrival', 'Lunch, dinner, and farm experiences on request', 'One hour from Tunis, 15 minutes from Testour']
  },
  fr: {
    eyebrow: 'Reserver en direct, simplement',
    heading: 'Pas de commission. Des etapes claires. Un vrai hote vous repond.',
    text: 'Envoyez vos dates, le nombre de voyageurs et votre preference de chambre. Mahdi repond sous 24 heures avec les disponibilites, les repas possibles et les details de l acompte avant confirmation.',
    cta: 'Demander les disponibilites',
    points: ['Petit-dejeuner inclus chaque matin', 'Paiement a l arrivee', 'Dejeuner, diner et experiences sur demande', 'A 1 heure de Tunis, 15 minutes de Testour']
  }
};

export default function BookingConfidence({locale}: {locale: string}) {
  const copy = locale === 'fr' ? content.fr : content.en;

  return (
    <section className="bg-earth px-5 py-16 text-cream md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">{copy.eyebrow}</p>
          <h2 className="mt-4 max-w-xl font-serif text-4xl italic leading-tight md:text-5xl">{copy.heading}</h2>
          <p className="mt-5 max-w-xl leading-8 text-cream/72">{copy.text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/book">{copy.cta}</Button>
            <WhatsAppLink locale={locale} className="inline-flex items-center justify-center rounded-full border border-cream/45 px-6 py-3 text-sm font-semibold text-cream transition hover:bg-cream hover:text-dusk">
              WhatsApp Mahdi
            </WhatsAppLink>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {copy.points.map((point) => (
            <div key={point} className="border border-cream/12 bg-cream/5 p-5">
              <p className="leading-7 text-cream/82">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
