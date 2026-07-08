import Image from 'next/image';
import {useLocale} from 'next-intl';
import Button from '@/components/ui/Button';

// Server component: the headline, subhead, and LCP image are all in the first
// HTML chunk and animate with pure CSS (globals.css: .hero-line, .hero-subhead,
// .hero-cta, .hero-parallax) — nothing here waits for hydration. The parallax
// uses CSS scroll-driven animations where supported and degrades to a static
// image elsewhere.
export default function HeroSection({headline, subhead, cta, image}: {headline: string; subhead: string; cta?: string; image: string}) {
  const locale = useLocale();
  const lines = headline.split('\n');

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-dusk px-5 pb-28 pt-24 text-center text-cream md:pb-32">
      {/* Parallax Background */}
      <div className="hero-parallax absolute inset-0 z-0">
        <Image src={image} alt="" fill preload fetchPriority="high" sizes="100vw" className="object-cover opacity-80" />
      </div>

      {/* Gradients & Texture */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-dusk/40 via-transparent to-dusk" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-dusk/20 to-dusk/80" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_88%,rgba(111,114,67,0.22),transparent_55%)]" />
      <div className="grain absolute inset-0 z-0 mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl -translate-y-3 md:-translate-y-6">
        <div className="flex flex-col items-center">
          <h1 className="font-serif text-[clamp(3rem,9vw,6rem)] font-normal italic leading-[0.95] tracking-tight text-balance">
            {lines.map((line, i) => (
              // No overflow-hidden clip: a clipped-at-first-paint headline is
              // dropped as an LCP candidate (see .hero-line in globals.css).
              <span key={i} className="block pb-2">
                <span className="hero-line block" style={{'--hero-delay': `${0.2 + i * 0.15}s`} as React.CSSProperties}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-subhead mx-auto mt-8 max-w-xl text-base leading-relaxed text-cream/80 md:text-xl text-balance">
            {subhead}
          </p>

          {cta && (
            <div className="hero-cta mt-8 md:mt-10">
              <Button href="/book">{cta}</Button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scroll Indicator */}
      <div className="hero-scroll-hint absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex md:bottom-7">
        <span className="text-[10px] uppercase tracking-wide text-cream/70">{locale === 'fr' ? 'Défiler' : 'Scroll'}</span>
        <div className="h-14 w-[1px] overflow-hidden bg-cream/20">
          <div className="hero-scroll-line h-full w-full bg-cream" />
        </div>
      </div>
    </section>
  );
}
