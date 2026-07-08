import Reveal from '@/components/ui/Reveal';

export default function QuoteBanner({quote}: {quote: string}) {
  return (
    <section className="relative overflow-hidden bg-olive-dark px-5 py-32 md:py-48 text-center text-sand">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(164,168,135,0.16),_transparent_60%)]" />
      <div className="grain absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal variant="zoom">
          {/* Massive decorative quotation marks */}
          <span className="absolute -top-16 left-1/2 -translate-x-1/2 font-serif text-[180px] leading-none text-olive-light/20 select-none md:-top-24 md:text-[240px]">
            “
          </span>

          <p className="relative font-serif text-3xl italic leading-[1.3] md:text-5xl lg:text-6xl text-balance">
            {quote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
