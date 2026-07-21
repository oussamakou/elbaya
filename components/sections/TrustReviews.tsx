import ReviewCard from '@/components/ui/ReviewCard';
import TrackedLink from '@/components/ui/TrackedLink';

const reviews = [
  {
    quote: 'A little escape into nature. I really enjoyed discovering Farm El Baya, with its olive trees, animals and delicious home-cooked Tunisian lunch.',
    name: 'Elisabeth K.',
    detail: 'Google Reviews · 5 stars · a month ago',
    href: 'https://maps.app.goo.gl/wCFfG6C1HYrkwP1G8'
  },
  {
    quote: 'I had such a lovely stay at Farm El Baya. Several archaeological sites were within the area. I loved all the creatures and the host parents fed me like a queen.',
    name: 'Audrey Chen',
    detail: 'Google Reviews · 5 stars · 2 months ago',
    href: 'https://maps.app.goo.gl/PVnavwPoR97mQqkw5'
  },
  {
    quote: "Absolutely amazing place. We planned to stay only one night but ended staying for an extra one. Don't forget to go on the rooftop and look at the stars at night.",
    name: 'Lorenzo Pagnutti',
    detail: 'Google Reviews · 5 stars · 6 months ago',
    href: 'https://maps.app.goo.gl/ugt7yjo2KjQQE2i49'
  },
  {
    quote: 'The atmosphere is authentic yet modern, a clean and calm space to take a break and come back to the essentials of life. The food is made with care and generosity.',
    name: 'Ahmed Kalfat',
    detail: 'Google Reviews · 5 stars · Tunisia',
    href: 'https://maps.app.goo.gl/JqLswfhXiLULhk7M8'
  },
  {
    quote: 'Un séjour absolument incroyable dans cette ferme aux portes de Tunis. Le rooftop offre un ciel étoilé à couper le souffle. Un séjour parfait.',
    name: 'Mehdi Slim',
    detail: 'Google Reviews · 5 stars · Tunisia',
    href: 'https://maps.app.goo.gl/4V1VoMsU2WNQuTUHA'
  },
  {
    quote: 'The breakfast was the best in our stay in Tunisia: eggs from the farm, yogurt made with their resources, oil from their olive trees.',
    name: 'David Moreno',
    detail: 'Google Reviews · 5 stars · Spain',
    href: 'https://maps.app.goo.gl/WnGpxxkdFwQGQXSEA'
  },
  {
    quote: 'A beautiful and peaceful place where life feels good. Animals, flora, and family members all form a place of tranquility far from the city.',
    name: 'Romeo Gaucher',
    detail: 'Google Reviews · 5 stars · France',
    href: 'https://maps.app.goo.gl/S9U47Q3NtoiPX6Ur7'
  },
  {
    quote: 'Perfect stop for our cross-country roadtrip. Extremely comfy place with a relaxed, welcoming atmosphere and incredibly helpful, attentive people.',
    name: 'Pascal',
    detail: 'Booking.com · 10/10 · Switzerland',
    href: 'https://www.booking.com/hotel/tn/farm-el-baya.fr.html#tab-reviews'
  },
  {
    quote: 'Comfortable stay on a farm with friendly owners. Lovely olive farm with goats and a good Tunisian breakfast. I would recommend this stay.',
    name: 'Natalie',
    detail: 'Booking.com · 8/10 · Belgium',
    href: 'https://www.booking.com/hotel/tn/farm-el-baya.fr.html#tab-reviews'
  }
];

const labels = {
  en: {
    google: 'Google review examples from recent guests',
    booking: 'Booking.com guest scores shared by travelers',
    response: 'Typical direct booking response window'
  },
  fr: {
    google: "Exemples d'avis Google de voyageurs récents",
    booking: 'Notes des voyageurs partagées sur Booking.com',
    response: 'Délai de réponse typique en réservation directe'
  }
};

export default function TrustReviews({
  heading,
  subhead,
  locale
}: {
  heading: string;
  subhead: string;
  locale: string;
}) {
  const t = locale === 'fr' ? labels.fr : labels.en;
  return (
    <section className="bg-olive-wash border-t border-olive/10 px-5 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-end">
          <div>
            <h2 className="font-serif text-5xl leading-tight">{heading}</h2>
            <p className="mt-4 max-w-md leading-7 text-earth/75">{subhead}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <TrackedLink href="https://www.google.com/maps/search/?api=1&query=Farm%20Elbaya%20Testour" event="review_source_click" target="_blank" rel="noreferrer" className="border border-olive/15 bg-cream p-5 transition hover:border-olive/40">
              <p className="font-serif text-4xl text-olive-dark">5.0</p>
              <p className="mt-1 text-sm text-earth/75">{t.google}</p>
            </TrackedLink>
            <TrackedLink href="https://www.booking.com/hotel/tn/farm-el-baya.fr.html#tab-reviews" event="review_source_click" target="_blank" rel="noreferrer" className="border border-olive/15 bg-cream p-5 transition hover:border-olive/40">
              <p className="font-serif text-4xl text-olive-dark">8-10</p>
              <p className="mt-1 text-sm text-earth/75">{t.booking}</p>
            </TrackedLink>
            <div className="border border-olive/15 bg-cream p-5">
              <p className="font-serif text-4xl text-olive-dark">24h</p>
              <p className="mt-1 text-sm text-earth/75">{t.response}</p>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reviews.slice(0, 9).map((review) => <ReviewCard key={`${review.name}-${review.detail}`} review={review} />)}
        </div>
      </div>
    </section>
  );
}
