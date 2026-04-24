import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function HeroSection({headline, subhead, cta, image}: {headline: string; subhead: string; cta?: string; image: string}) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dusk px-5 text-center text-cream">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-80 animate-breathe" />
      <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/30 to-dusk/10" />
      <div className="relative z-10 mx-auto max-w-4xl pt-20">
        <h1 className="whitespace-pre-line font-serif text-[clamp(2.5rem,8vw,4rem)] font-medium italic leading-[0.98] md:text-[64px]">{headline}</h1>
        <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-cream/80 md:text-lg">{subhead}</p>
        {cta && <Button href="/book" className="mt-9">{cta}</Button>}
      </div>
      <div className="absolute bottom-8 left-1/2 h-10 w-px -translate-x-1/2 overflow-hidden bg-cream/20">
        <span className="block h-4 w-px animate-drift bg-cream/80" />
      </div>
    </section>
  );
}
