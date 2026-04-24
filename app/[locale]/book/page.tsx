import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img} from '@/content';
import BookingForm from '@/components/ui/BookingForm';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const content = getContent(locale, 'book');
  return {title: content.meta.title, description: content.meta.description, alternates: {canonical: `/${locale}/book`}, openGraph: {images: [img('breakfast.webp')]}};
}

export default async function Book({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'book');
  return (
    <>
      <section className="bg-sand px-5 pb-16 pt-40 text-center">
        <h1 className="font-serif text-6xl italic md:text-7xl">{content.hero.heading}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-earth/72">{content.hero.subhead}</p>
      </section>
      <BookingForm locale={locale} copy={content.form} />
    </>
  );
}
