import Image from 'next/image';
import {img} from '@/content';

const copy = {
  en: {
    heading: 'A day at El Baya.',
    intro: 'From first light in the Baya Room to breakfast, harvest work, and unhurried hours among the olive trees.',
    captions: {
      'interior-baya-room.webp': ['The Baya Room', 'Private, quiet, and open to the groves'],
      'breakfast.webp': ['Breakfast each morning', 'Seasonal and prepared on the farm'],
      'picking_tree_fruits.webp': ['Picking season', 'Fruit trees across the farm'],
      'beekeeping_activity.webp': ['At the hives', 'A guided visit with the suit provided'],
      'figs_and_olive_oil.webp': ['Figs and olive oil', 'Picked and pressed at El Baya'],
      'livestock.webp': ['Forty acres of farm life', 'Animals, open land, and room to wander']
    }
  },
  fr: {
    heading: 'Une journée à El Baya.',
    intro: 'Des premières lueurs dans la Chambre Baya au petit-déjeuner, à la récolte et aux heures lentes parmi les oliviers.',
    captions: {
      'interior-baya-room.webp': ['La Chambre Baya', 'Privée, calme et ouverte sur les oliviers'],
      'breakfast.webp': ['Le petit-déjeuner du matin', 'De saison et préparé à la ferme'],
      'picking_tree_fruits.webp': ['La saison des cueillettes', 'Des arbres fruitiers à travers la ferme'],
      'beekeeping_activity.webp': ['Auprès des ruches', 'Une visite guidée avec la tenue fournie'],
      'figs_and_olive_oil.webp': ["Figues et huile d'olive", 'Récolte et pressage à El Baya'],
      'livestock.webp': ['Seize hectares de vie', 'Animaux, terre ouverte et espace pour marcher']
    }
  }
};

const altText: Record<string, string> = {
  'interior-baya-room.webp': 'The private Baya Room at Farm El Baya',
  'breakfast.webp': 'Farm breakfast spread at Farm El Baya',
  'picking_tree_fruits.webp': 'Guests picking fruit from a tree at Farm El Baya',
  'beekeeping_activity.webp': 'Beekeeping among the olive groves',
  'figs_and_olive_oil.webp': 'Fresh figs and olive oil from the farm',
  'livestock.webp': 'Animals grazing across Farm El Baya'
};

const positions: Record<string, string> = {
  'interior-baya-room.webp': '50% 48%',
  'breakfast.webp': '50% 58%',
  'picking_tree_fruits.webp': '52% 50%',
  'beekeeping_activity.webp': '50% 45%',
  'figs_and_olive_oil.webp': '54% 48%',
  'livestock.webp': '50% 58%'
};

const layout = [
  'col-span-2 lg:col-span-8 lg:row-span-2',
  'col-span-1 lg:col-span-4',
  'col-span-1 lg:col-span-4',
  'col-span-2 lg:col-span-5',
  'col-span-1 lg:col-span-3',
  'col-span-1 lg:col-span-4'
];

const mobileAspect = [
  'aspect-[4/3]',
  'aspect-square',
  'aspect-square',
  'aspect-[16/10]',
  'aspect-square',
  'aspect-square'
];

export default function PhotoGrid({photos, locale}: {photos: string[]; locale: string}) {
  const t = locale === 'fr' ? copy.fr : copy.en;

  return (
    <section className="bg-sand px-5 py-24 text-earth md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 border-b border-olive/20 pb-10 md:grid-cols-[.8fr_1.2fr] md:items-end md:pb-12">
          <h2 className="max-w-xl font-serif text-5xl leading-[1.02] md:text-6xl">{t.heading}</h2>
          <p className="max-w-2xl leading-8 text-earth/70">{t.intro}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 lg:grid-cols-12 lg:grid-rows-[360px_260px_360px] lg:gap-5">
        {photos.map((photo, index) => (
          <div
            key={photo}
            className={`group min-w-0 ${layout[index]}`}
          >
            <figure className="flex h-full min-h-0 flex-col">
              <div className={`relative min-h-0 flex-1 overflow-hidden rounded-card bg-earth ${mobileAspect[index]} lg:aspect-auto`}>
                <Image
                  src={img(photo)}
                  alt={altText[photo] || 'Farm El Baya'}
                  fill
                  loading={photo === 'picking_tree_fruits.webp' ? 'eager' : 'lazy'}
                  unoptimized={photo === 'picking_tree_fruits.webp'}
                  sizes={index === 0 ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 42vw, 50vw'}
                  style={{objectPosition: positions[photo]}}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium text-earth">{t.captions[photo as keyof typeof t.captions][0]}</span>
                <span className="hidden text-right text-xs text-earth/55 md:block">{t.captions[photo as keyof typeof t.captions][1]}</span>
              </figcaption>
            </figure>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
