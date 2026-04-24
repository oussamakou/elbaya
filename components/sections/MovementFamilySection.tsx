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
      ['Mouvement Research', 'A training and research facility for strength, balance, mobility, climbing, rings, and bodyweight practice.'],
      ['Open-air practice', 'Move under the trees, practice handstands, or join simple morning movement when Mahdi is available.'],
      ['Kids playground', 'A family-friendly play area with trampoline-style play and space for children to move outside.']
    ]
  },
  fr: {
    eyebrow: 'Mouvement et espace famille',
    heading: 'Une ferme ou le corps peut bouger.',
    text: 'Farm El Baya inclut maintenant l espace Mouvement Research de Mahdi : un lieu interieur et exterieur pour equilibres, callisthenie, mobilite, anneaux, grimpe et exploration physique.',
    family: 'Les familles sont bienvenues. Les enfants ont de l espace sur la ferme et une aire de jeux dediee avec trampoline, pour des journees plus simples pour les parents et plus vivantes pour les enfants.',
    cta: 'Voir les experiences',
    cards: [
      ['Mouvement Research', 'Un espace de pratique pour force, equilibre, mobilite, grimpe, anneaux et poids du corps.'],
      ['Pratique en plein air', 'Bouger sous les arbres, travailler les equilibres ou rejoindre un mouvement matinal quand Mahdi est disponible.'],
      ['Aire de jeux enfants', 'Un espace famille avec trampoline et de la place dehors pour que les enfants bougent.']
    ]
  }
};

export default function MovementFamilySection({locale}: {locale: string}) {
  const t = locale === 'fr' ? copy.fr : copy.en;

  return (
    <section className="bg-cream px-5 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bark">{t.eyebrow}</p>
          <h2 className="mt-3 max-w-xl font-serif text-5xl italic leading-tight md:text-6xl">{t.heading}</h2>
          <p className="mt-6 max-w-xl leading-8 text-earth/75">{t.text}</p>
          <p className="mt-4 max-w-xl leading-8 text-earth/75">{t.family}</p>
          <Button href="/experiences" className="mt-8">{t.cta}</Button>
        </div>
        <div className="grid gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-mist">
            <Image src={img('mouvement_research.png')} alt="Farm El Baya Mouvement Research facility" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] bg-mist">
              <Image src={img('handstand_practice.png')} alt="Handstand practice at Farm El Baya" fill sizes="(min-width: 640px) 28vw, 100vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] bg-mist">
              <Image src={img('kids_training.png')} alt="Kids training and play area at Farm El Baya" fill sizes="(min-width: 640px) 28vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-3">
        {t.cards.map(([title, text]) => (
          <article key={title} className="border border-mist bg-sand/55 p-6">
            <h3 className="font-serif text-3xl italic">{title}</h3>
            <p className="mt-3 leading-7 text-earth/72">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
