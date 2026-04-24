import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img, photos} from '@/content';
import HeroSection from '@/components/sections/HeroSection';
import QuoteBanner from '@/components/sections/QuoteBanner';
import ThreePillars from '@/components/sections/ThreePillars';
import PhotoGrid from '@/components/ui/PhotoGrid';
import ReviewCard from '@/components/ui/ReviewCard';
import Reveal from '@/components/ui/Reveal';
import ForgeTeaser from '@/components/sections/ForgeTeaser';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const content = getContent(locale, 'home');
  return {title: content.meta.title, description: content.meta.description, alternates: {canonical: `/${locale}`}, openGraph: {images: [img('breakfast.webp')]}};
}

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'home');
  return (
    <>
      <HeroSection image={img('breakfast.webp')} headline={content.hero.headline} subhead={content.hero.subhead} cta={content.hero.cta} />
      <QuoteBanner quote={content.quote} />
      <ThreePillars items={content.pillars} />
      <PhotoGrid photos={photos} />
      <section className="px-5 pb-24">
        <Reveal className="mx-auto mb-10 max-w-7xl">
          <h2 className="font-serif text-5xl italic">{content.reviews.heading}</h2>
          <p className="mt-3 font-serif text-2xl italic text-bark">{content.reviews.subhead}</p>
        </Reveal>
        <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
          {content.reviews.items.map((review) => <ReviewCard key={review.name} review={review} />)}
        </div>
      </section>
      <ForgeTeaser content={content.forge} />
    </>
  );
}
