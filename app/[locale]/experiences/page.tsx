import Image from 'next/image';
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {getContent, img, pageMetadata} from '@/content';
import {getBookableExperiences} from '@/content/addons';
import Button from '@/components/ui/Button';
import BookingConfidence from '@/components/sections/BookingConfidence';
import MovementFamilySection from '@/components/sections/MovementFamilySection';

const experienceImages: Record<string, string> = {
  training: 'handstand_practice.webp',
  beekeeping: 'beekeeping_activity.webp',
  'olive-harvest': 'picking_tree_fruits.webp',
  cooking: 'open_air_kitchen.webp'
};

const sectionCopy = {
  en: {
    includedEyebrow: 'Part of the stay',
    includedHeading: 'Begin with what is already here.',
    includedBody: 'No schedule is required. The land, movement area, rooftop, and daily farm life are open to every guest.',
    bookableEyebrow: 'Arranged with the farm',
    bookableHeading: 'Choose one moment to go deeper.',
    bookableBody: 'These optional experiences follow the farm’s real rhythm. Choose what fits; there is no need to fill every day.',
    prices: 'See current add-on prices',
    seasonalEyebrow: 'The farm calendar',
    seasonalHeading: 'Some days only happen in season.',
    outingEyebrow: 'Beyond the farm',
    outingHeading: 'Testour and Dougga, one private day.',
    outingBody: 'Leave the farm with a local guide for the Andalusian streets of Testour and the Roman city of Dougga, then return to the quiet of the olive groves.',
    outingCta: 'See the outing price',
    imageAlts: {
      training: 'Movement practice with Mahdi at Farm El Baya',
      beekeeping: 'A guided beekeeping visit at Farm El Baya',
      'olive-harvest': 'Guests gathering fruit during harvest season at Farm El Baya',
      cooking: 'The open-air kitchen at Farm El Baya',
      outing: 'The Roman capitol at Dougga near Farm El Baya'
    }
  },
  fr: {
    includedEyebrow: 'Compris dans le séjour',
    includedHeading: 'Commencez par ce qui est déjà là.',
    includedBody: 'Aucun programme n’est nécessaire. La terre, l’espace mouvement, le toit et la vie quotidienne de la ferme sont ouverts à chaque hôte.',
    bookableEyebrow: 'Organisé avec la ferme',
    bookableHeading: 'Choisissez un moment pour aller plus loin.',
    bookableBody: 'Ces expériences en option suivent le vrai rythme de la ferme. Choisissez ce qui vous ressemble ; nul besoin de remplir chaque journée.',
    prices: 'Voir les prix des options',
    seasonalEyebrow: 'Le calendrier de la ferme',
    seasonalHeading: 'Certaines journées n’existent qu’en saison.',
    outingEyebrow: 'Au-delà de la ferme',
    outingHeading: 'Testour et Dougga, une journée privée.',
    outingBody: 'Partez avec un guide local vers les rues andalouses de Testour et la cité romaine de Dougga, puis retrouvez le calme des oliviers.',
    outingCta: 'Voir le prix de la sortie',
    imageAlts: {
      training: 'Pratique du mouvement avec Mahdi à Farm El Baya',
      beekeeping: 'Visite guidée des ruches à Farm El Baya',
      'olive-harvest': 'Des hôtes participent à la récolte saisonnière à Farm El Baya',
      cooking: 'La cuisine en plein air de Farm El Baya',
      outing: 'Le capitole romain de Dougga près de Farm El Baya'
    }
  }
};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return pageMetadata(locale, 'experiences', '/experiences', 'movement_research_lab.webp');
}

export default async function Experiences({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const content = getContent(locale, 'experiences');
  const t = locale === 'fr' ? sectionCopy.fr : sectionCopy.en;
  const bookable = getBookableExperiences(locale);
  const farmExperiences = bookable.filter((addon) => addon.category === 'experiences');
  const outing = bookable.find((addon) => addon.category === 'outing');

  return (
    <>
      <section className="relative flex min-h-[82vh] items-end overflow-hidden bg-dusk px-5 pb-20 text-cream">
        <Image src={img('movement_research_lab.webp')} alt="The Movement Area at Farm El Baya" fill preload fetchPriority="high" sizes="100vw" className="object-cover animate-breathe opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/30 to-transparent" />
        <h1 className="relative mx-auto max-w-6xl font-serif text-5xl italic leading-tight md:text-7xl">{content.hero}</h1>
      </section>

      <MovementFamilySection locale={locale} />

      <section className="bg-sand px-5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-[.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.includedEyebrow}</p>
              <h2 className="mt-3 max-w-xl font-serif text-5xl leading-tight">{t.includedHeading}</h2>
            </div>
            <p className="max-w-2xl leading-8 text-earth/75">{t.includedBody}</p>
          </div>
          <div className="mt-10 grid border-y border-olive/20 md:grid-cols-4 md:divide-x md:divide-olive/20">
            {content.included.map((item, index) => (
              <article key={item[0]} className={`py-7 md:px-7 md:py-9 ${index > 0 ? 'border-t border-olive/20 md:border-t-0' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index === content.included.length - 1 ? 'md:pr-0' : ''}`}>
                <h3 className="font-serif text-2xl text-earth">{item[0]}</h3>
                <p className="mt-3 text-sm leading-6 text-earth/65">{item[1]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.bookableEyebrow}</p>
              <h2 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">{t.bookableHeading}</h2>
              <p className="mt-5 leading-8 text-earth/75">{t.bookableBody}</p>
            </div>
            <Button href="/stay#optional-extras" variant="ghost">{t.prices}</Button>
          </div>

          <div className="mt-14">
            {farmExperiences.map((experience, index) => (
              <article key={experience.id} className="grid gap-8 border-t border-olive/20 py-12 md:grid-cols-2 md:items-center md:gap-16 md:py-16">
                <div className={`relative aspect-[4/3] overflow-hidden rounded-card bg-mist ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <Image
                    src={img(experienceImages[experience.id])}
                    alt={t.imageAlts[experience.id as keyof typeof t.imageAlts]}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="max-w-xl">
                  <p className="text-sm font-medium text-olive-dark">{experience.experienceLabel}</p>
                  <h3 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{experience.title}</h3>
                  <p className="mt-5 leading-8 text-earth/70">{experience.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-8 border-y border-olive/20 py-10 md:grid-cols-[.6fr_1.4fr] md:items-start md:py-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.seasonalEyebrow}</p>
              <h3 className="mt-3 max-w-md font-serif text-4xl leading-tight">{t.seasonalHeading}</h3>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {content.seasonal.map((item) => (
                <article key={item[0]}>
                  <p className="text-sm font-medium text-olive-dark">{item[2]}</p>
                  <h4 className="mt-3 font-serif text-2xl">{item[0]}</h4>
                  <p className="mt-3 leading-7 text-earth/65">{item[1]}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {outing && (
        <section className="bg-sand px-5 py-24 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_.9fr] md:items-center md:gap-16">
            <div className="relative aspect-[16/11] overflow-hidden rounded-card bg-mist">
              <Image src={img('dougga_capitol.webp')} alt={t.imageAlts.outing} fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.outingEyebrow}</p>
              <h2 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">{t.outingHeading}</h2>
              <p className="mt-6 leading-8 text-earth/75">{t.outingBody}</p>
              <Button href="/stay#optional-extras" className="mt-8">{t.outingCta}</Button>
            </div>
          </div>
        </section>
      )}

      <section className="bg-cream px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-label text-olive">{content.eventsHeading}</p>
              <h2 className="mt-3 font-serif text-5xl leading-tight">{locale === 'fr' ? 'Quand venir.' : 'When to come.'}</h2>
            </div>
            <p className="max-w-2xl leading-7 text-earth/75">{content.eventsSubhead}</p>
          </div>
          <div className="mt-10 border-y border-olive/20">
            {content.events.map((event) => (
              <article key={event[0]} className="grid min-w-0 gap-3 border-t border-olive/15 py-6 first:border-t-0 md:grid-cols-[260px_minmax(0,1fr)_110px] md:items-baseline md:gap-8">
                <h3 className="min-w-0 font-serif text-2xl leading-tight">{event[0]}</h3>
                <p className="text-sm leading-6 text-earth/70">{event[1]}</p>
                <p className="text-sm font-medium text-olive-dark md:text-right">{event[2]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BookingConfidence locale={locale} />
    </>
  );
}
