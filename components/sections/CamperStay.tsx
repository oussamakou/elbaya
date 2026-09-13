import Image from 'next/image';
import {MessageCircle} from 'lucide-react';
import {img} from '@/content';
import WhatsAppLink from '@/components/ui/WhatsAppLink';

const copy = {
  en: {
    eyebrow: 'Another way to stay',
    heading: 'Your own wheels. A night among the olive trees.',
    text: 'Travelling in a campervan, motorhome, rooftop tent, or equipped car? We welcome one vehicle at a time for a quiet night at the farm. If you are booking the Baya Room too, add the pitch during Lodgify checkout; otherwise request it directly on WhatsApp.',
    price: '45 DT / €14',
    priceNote: 'per vehicle · per night · up to 2 guests',
    facts: ['One vehicle', 'Up to 2 guests', 'By request'],
    cta: 'Request a camper stay',
    note: 'Standalone camper stays are requests, not instant bookings. Mahdi confirms availability and practical access on WhatsApp. Meals are not included.',
    imageAlt: 'A white camper van parked beneath the trees at Farm El Baya at night',
    imageCaption: 'Arrive in your own van. Sleep beneath the trees.'
  },
  fr: {
    eyebrow: 'Une autre façon de séjourner',
    heading: 'Votre véhicule. Une nuit parmi les oliviers.',
    text: "Vous voyagez en van, camping-car, tente de toit ou voiture aménagée ? Nous accueillons un véhicule à la fois pour une nuit calme à la ferme. Si vous réservez aussi la Chambre Baya, ajoutez l’emplacement pendant la réservation Lodgify ; sinon, faites votre demande directement sur WhatsApp.",
    price: '45 DT / 14 €',
    priceNote: 'par véhicule · par nuit · jusqu’à 2 personnes',
    facts: ['Un véhicule', 'Jusqu’à 2 personnes', 'Sur demande'],
    cta: 'Demander un emplacement',
    note: "Les séjours en véhicule seul sont sur demande, sans réservation instantanée. Mahdi confirme les disponibilités et l’accès pratique sur WhatsApp. Les repas ne sont pas inclus.",
    imageAlt: 'Un van blanc stationné sous les arbres à Farm El Baya la nuit',
    imageCaption: 'Venez avec votre van. Dormez sous les arbres.'
  }
};

const messages = {
  en: `Hi Mahdi, I would like to request a camper stay at Farm El Baya.

Arrival:
Departure:
Number of guests:
Vehicle type:
Approximate vehicle length:
Electricity needed: Yes / No`,
  fr: `Bonjour Mahdi, je souhaite demander un emplacement pour véhicule aménagé à Farm El Baya.

Arrivée :
Départ :
Nombre de voyageurs :
Type de véhicule :
Longueur approximative :
Besoin d’électricité : Oui / Non`
};

export default function CamperStay({locale}: {locale: string}) {
  const fr = locale === 'fr';
  const t = fr ? copy.fr : copy.en;

  return (
    <section id="camper-stays" className="scroll-mt-20 bg-cream px-5 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-16">
        <div className="relative min-h-[28rem] overflow-hidden rounded-card bg-mist md:min-h-[40rem]">
          <Image
            src={img('car-caming.jpg')}
            alt={t.imageAlt}
            fill
            sizes="(min-width: 768px) 46vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dusk/80 to-transparent px-6 pb-6 pt-24 text-sm text-cream/85">
            {t.imageCaption}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-label text-olive-dark">{t.eyebrow}</p>
          <h2 className="mt-4 max-w-2xl font-serif text-5xl italic leading-[1.02] md:text-6xl">{t.heading}</h2>
          <p className="mt-6 max-w-2xl leading-8 text-earth/75">{t.text}</p>

          <div className="mt-9 border-y border-olive/20 py-7">
            <p className="font-serif text-4xl italic text-earth">{t.price}</p>
            <p className="mt-2 text-sm text-earth/60">{t.priceNote}</p>
            <div className="mt-6 grid grid-cols-3 divide-x divide-olive/20 text-sm font-medium text-earth/75">
              {t.facts.map((fact) => <p key={fact} className="px-3 first:pl-0 last:pr-0">{fact}</p>)}
            </div>
          </div>

          <WhatsAppLink
            locale={locale}
            message={fr ? messages.fr : messages.en}
            event="camper_stay_whatsapp_click"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-olive px-6 py-3 text-sm font-semibold text-cream transition-[scale,background-color] duration-300 hover:bg-olive-dark active:scale-[0.96]"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            {t.cta}
          </WhatsAppLink>
          <p className="mt-4 max-w-xl text-sm leading-6 text-earth/55">{t.note}</p>
        </div>
      </div>
    </section>
  );
}
