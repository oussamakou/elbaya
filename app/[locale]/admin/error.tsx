'use client';
export default function AdminError({reset}: {reset: () => void}) {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-24 pt-40">
      <h1 className="font-serif text-5xl italic">
        La boutique est indisponible.
      </h1>
      <p className="my-6 leading-8">
        La connexion au stockage n’a pas abouti. Réessayez dans un instant. Si
        le problème persiste, contactez la personne qui gère votre site.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-olive px-6 py-3 text-cream"
      >
        Réessayer
      </button>
    </section>
  );
}
