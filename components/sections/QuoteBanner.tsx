export default function QuoteBanner({quote}: {quote: string}) {
  return (
    <section className="bg-olive px-5 py-14 text-center text-cream md:py-20">
      <p className="mx-auto max-w-4xl font-serif text-3xl italic leading-tight md:text-5xl">“{quote}”</p>
    </section>
  );
}
