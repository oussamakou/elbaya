import Image from 'next/image';
import {img} from '@/content';
import Button from '@/components/ui/Button';

const copy = {
  en: {
    eyebrow: 'Movement and family space',
    heading: 'A farm where bodies can move.',
    text: 'Farm El Baya now includes Mahdi’s Mouvement Research space: an indoor and outdoor practice environment for handstands, calisthenics, mobility, rings, climbing, and playful physical exploration.',
    family: 'Families are welcome too. Children have open farm space and a dedicated playground area with trampoline-style play, so slow days are easier for parents and more alive for kids.',
    cta: 'See experiences',
    cards: [
      ['Mouvement Research', 'A training and research facility for strength, balance, mobility, rings, bodyweight practice.'],
      ['Open-air practice', 'Move under the trees, practice handstands, or join simple morning movement when Mahdi is available.'],
      ['Kids playground', 'A family-friendly play area with trampoline-style play and space for children to move outside.']
    ],
    alts: {
      trampoline: 'Mahdi jumping on the trampoline with two children at Farm El Baya',
      pushups: 'A girl doing push-ups during a training session at Farm El Baya',
      pullups: 'Mahdi doing pull-ups on a bar between trees at Farm El Baya'
    }
  },
  fr: {
    eyebrow: 'Mouvement et espace famille',
    heading: 'Une ferme où le corps peut bouger.',
    text: "Farm El Baya inclut maintenant l'espace Mouvement Research de Mahdi : un lieu intérieur et extérieur pour équilibres, callisthénie, mobilité, anneaux, grimpe et exploration physique.",
    family: "Les familles sont bienvenues. Les enfants ont de l'espace sur la ferme et une aire de jeux dédiée avec trampoline, pour des journées plus simples pour les parents et plus vivantes pour les enfants.",
    cta: 'Voir les expériences',
    cards: [
      ['Mouvement Research', 'Un espace de pratique pour force, équilibre, mobilité, anneaux, poids du corps et grimpe.'],
      ['Pratique en plein air', 'Bouger sous les arbres, travailler les équilibres ou rejoindre un mouvement matinal quand Mahdi est disponible.'],
      ['Aire de jeux enfants', 'Un espace famille avec trampoline et de la place dehors pour que les enfants bougent.']
    ],
    alts: {
      trampoline: 'Mahdi saute sur le trampoline avec deux enfants à Farm El Baya',
      pushups: "Une fille fait des pompes pendant une séance d'entraînement à Farm El Baya",
      pullups: 'Mahdi fait des tractions sur une barre entre les arbres à Farm El Baya'
    }
  }
};

// `compact` drops the family paragraph, the two secondary photos, and the
// three-card grid — used on the home page, which already gets the full
// version's photos elsewhere on the page. /experiences keeps the full read.
export default function MovementFamilySection({locale, compact = false}: {locale: string; compact?: boolean}) {
  const t = locale === 'fr' ? copy.fr : copy.en;

  return (
    <section className="bg-cream px-5 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.eyebrow}</p>
          <h2 className="mt-3 max-w-xl font-serif text-5xl italic leading-tight md:text-6xl">{t.heading}</h2>
          <p className="mt-6 max-w-xl leading-8 text-earth/75">{t.text}</p>
          {!compact && <p className="mt-4 max-w-xl leading-8 text-earth/75">{t.family}</p>}
          <Button href="/experiences" className="mt-8">{t.cta}</Button>
        </div>
        <div className="grid gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mist">
            <Image src={img('tampoline_fun.webp')} alt={t.alts.trampoline} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
          {!compact && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-mist">
                <Image src={img('pushup_exercise.webp')} alt={t.alts.pushups} fill sizes="(min-width: 640px) 28vw, 100vw" className="object-cover" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-mist">
                <Image src={img('pullup_bar_between_trees.webp')} alt={t.alts.pullups} fill sizes="(min-width: 640px) 28vw, 100vw" className="object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
      {!compact && (
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-3">
          {t.cards.map(([title, text]) => (
            <article key={title} className="border border-olive/15 bg-sand/55 p-6">
              <h3 className="font-serif text-3xl italic">{title}</h3>
              <p className="mt-3 leading-7 text-earth/75">{text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
