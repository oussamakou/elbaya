import Image from 'next/image';
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img} from '@/content';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import RoomCard from '@/components/ui/RoomCard';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const content = getContent(locale, 'stay');
  return {title: content.meta.title, description: content.meta.description, alternates: {canonical: `/${locale}/stay`}, openGraph: {images: [img('breakfast.webp')]}};
}

export default async function Stay({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'stay');
  return (
    <>
      <section className="relative flex min-h-[76vh] items-end overflow-hidden bg-dusk px-5 pb-20 text-cream">
        <Image src={img('room-interior.webp')} alt="" fill priority className="object-cover animate-breathe opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/25 to-transparent" />
        <h1 className="relative mx-auto max-w-7xl font-serif text-6xl italic md:text-7xl">{content.hero}</h1>
      </section>
      <section className="px-5 py-20 text-center">
        <p className="mx-auto max-w-3xl font-serif text-3xl leading-snug md:text-4xl">{content.intro}</p>
      </section>
      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {content.rooms.map((room) => <RoomCard key={room} name={room} locale={locale} />)}
        </div>
      </section>
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.1fr_.9fr]">
          <Image src={img('breakfast.webp')} alt="" width={900} height={720} className="rounded-[8px] object-cover" />
          <Reveal><h2 className="font-serif text-5xl italic">{content.breakfast.heading}</h2><p className="mt-6 leading-8 text-earth/75">{content.breakfast.text}</p></Reveal>
        </div>
      </section>
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-bark">{content.cabin.label}</p>
          <h2 className="mt-4 font-serif text-6xl italic">{content.cabin.heading}</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-earth/75">{content.cabin.text}</p>
          <Button href="/book" className="mt-8">{content.cabin.button}</Button>
        </div>
      </section>
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-5xl italic">{content.nearby.heading}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-4">{content.nearby.items.map((item) => <p key={item} className="border-t border-mist pt-5 leading-7 text-earth/75">{item}</p>)}</div>
        </div>
      </section>
    </>
  );
}
