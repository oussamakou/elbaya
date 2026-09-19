'use client';
import {useLocale} from 'next-intl';
export default function ShopError({reset}: {reset: () => void}) {
  const fr = useLocale() === 'fr';
  return (
    <section className="mx-auto max-w-2xl px-6 pb-24 pt-40">
      <h1 className="font-serif text-5xl italic">
        {fr
          ? 'La boutique fait une petite pause.'
          : 'The shop is taking a short pause.'}
      </h1>
      <p className="my-6 leading-8">
        {fr
          ? 'Impossible de charger les produits pour le moment. Réessayez dans un instant.'
          : 'We couldn’t load the products just now. Please try again in a moment.'}
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-olive px-6 py-3 text-cream"
      >
        {fr ? 'Réessayer' : 'Try again'}
      </button>
    </section>
  );
}
