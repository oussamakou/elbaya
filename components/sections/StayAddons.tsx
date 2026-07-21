import Image from 'next/image';
import {ChevronDown} from 'lucide-react';
import {img} from '@/content';

type Addon = {
  title: string;
  description: string;
  price: string;
};

type AddonGroup = {
  title: string;
  items: Addon[];
};

const copy = {
  en: {
    heading: 'Make the stay your own.',
    intro: 'Add farm meals, hands-on sessions, or a local outing when you book. Every extra is arranged in advance, and seasonal activities depend on availability.',
    currencyNote: 'DT prices follow the farm rates; euro amounts match the Lodgify add-ons.',
    reveal: 'Compare all 9 add-ons',
    featured: [
      {
        category: 'From the kitchen',
        title: 'Farm breakfast',
        description: 'A seasonal breakfast prepared fresh each morning from the farm and nearby producers.',
        price: '20 DT / €6 per guest, per day',
        image: 'breakfast.webp'
      },
      {
        category: 'Move with Mahdi',
        title: 'Training session',
        description: 'A 90-minute assessment, training session, and practical plan to take home.',
        price: '70 DT / €21 per guest',
        image: 'handstand_practice.webp'
      },
      {
        category: 'October to December',
        title: 'Olive harvest',
        description: 'Pick with the family and follow the harvest. Olive oil is available separately.',
        price: '50 DT / €15 per guest',
        image: 'picking_tree_fruits.webp'
      }
    ],
    groups: [
      {
        title: 'Meals',
        items: [
          {title: 'Farm breakfast', description: 'Prepared fresh each morning.', price: '20 DT / €6 per guest, per day'},
          {title: 'Home-cooked lunch', description: 'Local ingredients; request in advance.', price: '40 DT / €12 per guest'},
          {title: 'Dinner with the family', description: 'Traditional dinner; request in advance.', price: '40 DT / €12 per guest'},
          {title: 'Kids meal', description: 'A half portion for children aged 5 to 12.', price: '20 DT / €6 per child'}
        ]
      },
      {
        title: 'Farm experiences',
        items: [
          {title: 'Training session with Mahdi', description: 'A 90-minute assessment, session, and take-home plan.', price: '70 DT / €21 per guest'},
          {title: 'Beekeeping visit', description: 'A guided hive visit with the protective suit provided.', price: '40 DT / €12 per guest'},
          {title: 'Olive harvest', description: 'Seasonal from October to December; olive oil sold separately.', price: '50 DT / €15 per guest'},
          {title: 'Cooking with the family', description: 'Prepare bread and local dishes; the shared meal is included.', price: '70 DT / €21 per guest'}
        ]
      },
      {
        title: 'Local outing',
        items: [
          {title: 'Private Testour and Dougga tour', description: 'Explore the Andalusian town and Roman city with a local guide.', price: '€74 per booking on Lodgify'}
        ]
      }
    ] satisfies AddonGroup[]
  },
  fr: {
    heading: 'Composez votre séjour.',
    intro: 'Ajoutez des repas de la ferme, des séances pratiques ou une sortie locale lors de votre réservation. Chaque option est organisée à l’avance et les activités saisonnières dépendent des disponibilités.',
    currencyNote: 'Les prix en DT suivent les tarifs de la ferme ; les montants en euros correspondent aux options Lodgify.',
    reveal: 'Comparer les 9 options',
    featured: [
      {
        category: 'De la cuisine',
        title: 'Petit-déjeuner de la ferme',
        description: 'Un petit-déjeuner de saison préparé chaque matin avec les produits de la ferme et des producteurs voisins.',
        price: '20 DT / 6 € par personne et par jour',
        image: 'breakfast.webp'
      },
      {
        category: 'Bouger avec Mahdi',
        title: 'Séance d’entraînement',
        description: 'Un bilan, une séance de 90 minutes et un plan pratique à emporter.',
        price: '70 DT / 21 € par personne',
        image: 'handstand_practice.webp'
      },
      {
        category: 'Octobre à décembre',
        title: 'Récolte des olives',
        description: 'Cueillez avec la famille et suivez la récolte. L’huile d’olive est disponible séparément.',
        price: '50 DT / 15 € par personne',
        image: 'picking_tree_fruits.webp'
      }
    ],
    groups: [
      {
        title: 'Repas',
        items: [
          {title: 'Petit-déjeuner de la ferme', description: 'Préparé chaque matin.', price: '20 DT / 6 € par personne et par jour'},
          {title: 'Déjeuner maison', description: 'Produits locaux ; à demander à l’avance.', price: '40 DT / 12 € par personne'},
          {title: 'Dîner avec la famille', description: 'Dîner traditionnel ; à demander à l’avance.', price: '40 DT / 12 € par personne'},
          {title: 'Repas enfant', description: 'Une demi-portion pour les enfants de 5 à 12 ans.', price: '20 DT / 6 € par enfant'}
        ]
      },
      {
        title: 'Expériences à la ferme',
        items: [
          {title: 'Séance avec Mahdi', description: 'Un bilan, une séance de 90 minutes et un plan à emporter.', price: '70 DT / 21 € par personne'},
          {title: 'Visite des ruches', description: 'Une visite guidée avec la tenue de protection fournie.', price: '40 DT / 12 € par personne'},
          {title: 'Récolte des olives', description: 'D’octobre à décembre ; huile d’olive vendue séparément.', price: '50 DT / 15 € par personne'},
          {title: 'Cuisine en famille', description: 'Préparez le pain et des plats locaux ; le repas partagé est inclus.', price: '70 DT / 21 € par personne'}
        ]
      },
      {
        title: 'Sortie locale',
        items: [
          {title: 'Visite privée de Testour et Dougga', description: 'Découvrez la ville andalouse et la cité romaine avec un guide local.', price: '74 € par réservation sur Lodgify'}
        ]
      }
    ] satisfies AddonGroup[]
  }
};

export default function StayAddons({locale}: {locale: string}) {
  const t = locale === 'fr' ? copy.fr : copy.en;

  return (
    <section className="bg-cream px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[.8fr_1.2fr] md:items-end">
          <div>
            <h2 className="max-w-xl font-serif text-5xl italic md:text-6xl">{t.heading}</h2>
          </div>
          <p className="max-w-2xl leading-8 text-earth/75">{t.intro}</p>
        </div>

        <div className="mt-12 grid border-y border-olive/15 md:grid-cols-3 md:divide-x md:divide-olive/15">
          {t.featured.map((addon, index) => (
            <article key={addon.title} className={`py-7 md:px-7 ${index > 0 ? 'border-t border-olive/15 md:border-t-0' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index === t.featured.length - 1 ? 'md:pr-0' : ''}`}>
              <div className="relative mb-6 hidden aspect-[5/4] overflow-hidden rounded-card bg-mist md:block">
                <Image src={img(addon.image)} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-label text-olive-dark">{addon.category}</p>
              <h3 className="mt-3 text-xl font-semibold text-earth">{addon.title}</h3>
              <p className="mt-3 text-sm leading-6 text-earth/70">{addon.description}</p>
              <p className="mt-5 text-sm font-semibold text-earth">{addon.price}</p>
            </article>
          ))}
        </div>

        <details className="group mt-8 border-y border-olive/20">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-sm font-semibold text-earth transition-colors hover:text-olive [&::-webkit-details-marker]:hidden">
            <span>{t.reveal}</span>
            <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="border-t border-olive/15 pb-4">
            {t.groups.map((group) => (
              <section key={group.title} className="grid gap-5 border-b border-olive/15 py-8 last:border-b-0 md:grid-cols-[.35fr_1fr]">
                <h3 className="text-lg font-semibold text-earth">{group.title}</h3>
                <div>
                  {group.items.map((addon) => (
                    <div key={addon.title} className="grid gap-2 border-t border-olive/15 py-5 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_auto] sm:gap-8">
                      <div>
                        <h4 className="font-semibold text-earth">{addon.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-earth/65">{addon.description}</p>
                      </div>
                      <p className="text-sm font-semibold text-earth sm:text-right">{addon.price}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </details>
        <p className="mt-4 text-xs leading-5 text-earth/55">{t.currencyNote}</p>
      </div>
    </section>
  );
}
