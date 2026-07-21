import {ArrowRight, ChevronDown} from 'lucide-react';
import {Link} from '@/i18n/routing';
import {getAddons, type AddonCategory} from '@/content/addons';

const copy = {
  en: {
    heading: 'Add to your stay.',
    intro: 'Breakfast, time with Mahdi, or a day beyond the farm can be arranged after you choose your dates.',
    currencyNote: 'DT prices are the farm rates. Euro prices match the current Lodgify add-ons.',
    link: 'Explore the experiences',
    reveal: 'See all 9 options and current prices',
    from: 'From',
    groups: {
      meals: {title: 'Meals', summary: 'Breakfast and home-cooked meals from the farm kitchen.'},
      experiences: {title: 'Time with Mahdi', summary: 'Training, beekeeping, harvest, or cooking together.'},
      outing: {title: 'A day beyond the farm', summary: 'A private guided day through Testour and Dougga.'}
    }
  },
  fr: {
    heading: 'Ajoutez à votre séjour.',
    intro: 'Le petit-déjeuner, un moment avec Mahdi ou une journée hors de la ferme peuvent être organisés après le choix de vos dates.',
    currencyNote: 'Les prix en DT sont ceux de la ferme. Les prix en euros correspondent aux options Lodgify actuelles.',
    link: 'Découvrir les expériences',
    reveal: 'Voir les 9 options et les prix actuels',
    from: 'Dès',
    groups: {
      meals: {title: 'Repas', summary: 'Petit-déjeuner et repas maison préparés à la ferme.'},
      experiences: {title: 'Un moment avec Mahdi', summary: 'Entraînement, ruches, récolte ou cuisine ensemble.'},
      outing: {title: 'Une journée hors de la ferme', summary: 'Une journée privée et guidée à Testour et Dougga.'}
    }
  }
};

const groupOrder: AddonCategory[] = ['meals', 'experiences', 'outing'];

export default function StayAddons({locale}: {locale: string}) {
  const t = locale === 'fr' ? copy.fr : copy.en;
  const addons = getAddons(locale);
  const referencePrices: Record<AddonCategory, string> = {
    meals: addons.find((addon) => addon.id === 'breakfast')?.price || '',
    experiences: addons.find((addon) => addon.id === 'beekeeping')?.price || '',
    outing: addons.find((addon) => addon.id === 'tour')?.price || ''
  };

  return (
    <section id="optional-extras" className="scroll-mt-20 bg-sand px-5 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[.8fr_1.2fr] md:items-end">
          <h2 className="max-w-xl font-serif text-5xl md:text-6xl">{t.heading}</h2>
          <p className="max-w-2xl leading-8 text-earth/75">{t.intro}</p>
        </div>

        <div className="mt-12 grid border-y border-olive/20 md:grid-cols-3 md:divide-x md:divide-olive/20">
          {groupOrder.map((category, index) => (
            <article key={category} className={`py-7 md:px-8 md:py-9 ${index > 0 ? 'border-t border-olive/20 md:border-t-0' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index === groupOrder.length - 1 ? 'md:pr-0' : ''}`}>
              <p className="text-sm font-semibold text-olive-dark">{t.groups[category].title}</p>
              <p className="mt-3 max-w-sm leading-7 text-earth/70">{t.groups[category].summary}</p>
              <p className="mt-5 text-sm font-semibold text-earth">{category === 'outing' ? referencePrices[category] : `${t.from} ${referencePrices[category]}`}</p>
            </article>
          ))}
        </div>

        <details className="group border-b border-olive/20">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-sm font-semibold text-earth transition-colors hover:text-olive [&::-webkit-details-marker]:hidden">
            <span>{t.reveal}</span>
            <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="grid border-t border-olive/15 md:grid-cols-3 md:divide-x md:divide-olive/15">
            {groupOrder.map((category, groupIndex) => {
              const group = addons.filter((addon) => addon.category === category);
              return (
                <section key={category} className={`py-7 md:px-8 md:py-9 ${groupIndex > 0 ? 'border-t border-olive/15 md:border-t-0' : ''} ${groupIndex === 0 ? 'md:pl-0' : ''} ${groupIndex === groupOrder.length - 1 ? 'md:pr-0' : ''}`}>
                  <h3 className="text-sm font-semibold text-olive-dark">{t.groups[category].title}</h3>
                  <ul className="mt-5">
                    {group.map((addon) => (
                      <li key={addon.id} className="border-t border-olive/15 py-5 first:border-t-0 first:pt-0">
                        <h4 className="font-semibold text-earth">{addon.title}</h4>
                        <p className="mt-1 text-sm font-semibold text-earth">{addon.price}</p>
                        <p className="mt-2 text-sm leading-6 text-earth/65">{addon.description}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </details>

        <div className="mt-5 flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-6 text-earth/55">{t.currencyNote}</p>
          <Link href="/experiences" className="group inline-flex w-max items-center gap-3 font-medium text-olive-dark hover:text-earth">
            {t.link}
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
