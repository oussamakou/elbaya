import Image from 'next/image';
import {img} from '@/content';
import Button from '@/components/ui/Button';

const copy = {
  en: {
    eyebrow: 'Movement and family space',
    heading: 'A farm where bodies can move.',
    text: 'Farm El Baya now includes Mahdi’s movement area: an indoor and outdoor space for yoga, calisthenics, mobility, rings, climbing, and playful physical exploration - part farm gym, part open ground for a run or parkour.',
    family: 'Families are welcome too. Children have open farm space to roam and animals to meet, so slow days are easier for parents and more alive for kids.',
    cta: 'See experiences',
    alts: {
      trampoline: 'Mahdi jumping on the trampoline with two children at Farm El Baya',
      pushups: 'A girl doing push-ups during a training session at Farm El Baya',
      pullups: 'Mahdi doing pull-ups on a bar between trees at Farm El Baya'
    }
  },
  fr: {
    eyebrow: 'Mouvement et espace famille',
    heading: 'Une ferme où le corps peut bouger.',
    text: "Farm El Baya inclut maintenant l'espace mouvement de Mahdi : un lieu intérieur et extérieur pour le yoga, la callisthénie, la mobilité, les anneaux, la grimpe et l'exploration physique - une salle de sport à la ferme, avec de l'espace pour courir ou faire du parkour.",
    family: "Les familles sont bienvenues. Les enfants ont de l'espace sur la ferme pour explorer et des animaux à rencontrer, pour des journées plus simples pour les parents et plus vivantes pour les enfants.",
    cta: 'Voir les expériences',
    alts: {
      trampoline: 'Mahdi saute sur le trampoline avec deux enfants à Farm El Baya',
      pushups: "Une fille fait des pompes pendant une séance d'entraînement à Farm El Baya",
      pullups: 'Mahdi fait des tractions sur une barre entre les arbres à Farm El Baya'
    }
  }
};

// The homepage keeps this concise; /experiences adds the family context and
// secondary photography before continuing into the longer editorial story.
export default function MovementFamilySection({locale, compact = false}: {locale: string; compact?: boolean}) {
  const t = locale === 'fr' ? copy.fr : copy.en;

  return (
    <section className="bg-cream px-5 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          {!compact && <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.eyebrow}</p>}
          <h2 className={`${compact ? '' : 'mt-3 italic'} max-w-xl font-serif text-5xl leading-tight md:text-6xl`}>{t.heading}</h2>
          <p className="mt-6 max-w-xl leading-8 text-earth/75">{t.text}</p>
          {!compact && <p className="mt-4 max-w-xl leading-8 text-earth/75">{t.family}</p>}
          {compact && <Button href="/experiences" className="mt-8">{t.cta}</Button>}
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
    </section>
  );
}
