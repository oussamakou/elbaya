'use client';

import {useEffect, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {Globe2, MapPin} from 'lucide-react';
import LodgifyWidget from '@/components/ui/LodgifyWidget';
import WhatsAppLink from '@/components/ui/WhatsAppLink';
import TunisiaAvailabilityCalendar from '@/components/sections/TunisiaAvailabilityCalendar';

type BookingMode = 'international' | 'tunisia';

const copy = {
  en: {
    chooser: 'Choose your booking method',
    international: 'International',
    internationalDetail: 'Pay online',
    tunisia: 'Tunisia',
    tunisiaDetail: 'Pay locally',
    internationalEyebrow: 'International booking',
    internationalHeading: 'Choose your dates and book online.',
    internationalIntro: 'The calendar shows live availability and your total price. Continue through Lodgify to secure the booking with PayPal.',
    tunisiaEyebrow: 'Booking from Tunisia',
    tunisiaHeading: 'Check the dates. Confirm directly with Mahdi.',
    tunisiaIntro: 'Choose available dates below, then send the completed request on WhatsApp to arrange the deposit by Tunisian bank transfer.',
    calendar: 'Lodgify live availability',
    internationalNoteTitle: 'Secure online confirmation',
    internationalNote: 'The 30% deposit is paid through PayPal. Your remaining balance is settled on arrival.',
    internationalQuestion: 'Want to ask about meals, experiences, or getting here before you book?',
    askMahdi: 'Ask Mahdi on WhatsApp'
  },
  fr: {
    chooser: 'Choisissez votre mode de réservation',
    international: 'International',
    internationalDetail: 'Paiement en ligne',
    tunisia: 'Tunisie',
    tunisiaDetail: 'Paiement local',
    internationalEyebrow: 'Réservation internationale',
    internationalHeading: 'Choisissez vos dates et réservez en ligne.',
    internationalIntro: 'Le calendrier affiche les disponibilités en direct et le prix total. Continuez sur Lodgify pour confirmer avec PayPal.',
    tunisiaEyebrow: 'Réservation depuis la Tunisie',
    tunisiaHeading: 'Vérifiez les dates. Confirmez directement avec Mahdi.',
    tunisiaIntro: "Choisissez les dates disponibles ci-dessous, puis envoyez la demande complète sur WhatsApp pour organiser l'acompte par virement tunisien.",
    calendar: 'Disponibilités Lodgify en direct',
    internationalNoteTitle: 'Confirmation sécurisée en ligne',
    internationalNote: "L'acompte de 30 % est réglé via PayPal. Le solde est payé à l'arrivée.",
    internationalQuestion: "Une question sur les repas, les expériences ou l'accès avant de réserver ?",
    askMahdi: 'Écrire à Mahdi sur WhatsApp'
  }
};

export default function BookingFlow({locale}: {locale: string}) {
  const lang = locale === 'fr' ? 'fr' : 'en';
  const t = copy[lang];
  const [mode, setMode] = useState<BookingMode>('international');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const savedMode = window.sessionStorage.getItem('farm-el-baya-booking-mode');
      if (savedMode === 'international' || savedMode === 'tunisia') setMode(savedMode);
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }
  }, []);

  function selectMode(nextMode: BookingMode) {
    setMode(nextMode);
    try {
      window.sessionStorage.setItem('farm-el-baya-booking-mode', nextMode);
    } catch {
      // The booking choice still works for this render when storage is unavailable.
    }
  }

  const transition = reduceMotion ? {duration: 0} : {duration: 0.32, ease: [0.22, 1, 0.36, 1] as const};
  const panelMotion = {
    initial: reduceMotion ? {opacity: 0} : {opacity: 0, y: 8},
    animate: {opacity: 1, y: 0},
    exit: reduceMotion ? {opacity: 0} : {opacity: 0, y: -5}
  };

  return (
    <div className="mx-auto max-w-2xl text-left">
      <div className="mx-auto max-w-lg">
        <p className="text-center text-xs font-semibold uppercase tracking-label text-olive">{t.chooser}</p>
        <div className="mt-4 grid grid-cols-2 rounded-card border border-olive/20 bg-cream p-1.5" role="group" aria-label={t.chooser}>
          {([
            {value: 'international' as const, label: t.international, detail: t.internationalDetail, Icon: Globe2},
            {value: 'tunisia' as const, label: t.tunisia, detail: t.tunisiaDetail, Icon: MapPin}
          ]).map(({value, label, detail, Icon}) => {
            const selected = mode === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => selectMode(value)}
                className={`relative isolate min-h-14 rounded-md px-3 py-2 text-left transition-colors duration-200 ${selected ? 'text-cream' : 'text-earth hover:bg-mist'}`}
              >
                {selected && (
                  <motion.span
                    layoutId="booking-mode-selection"
                    className="absolute inset-0 -z-10 rounded-md bg-olive"
                    transition={transition}
                  />
                )}
                <span className="flex items-center justify-center gap-2">
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                  <span>
                    <span className="block text-sm font-semibold leading-5">{label}</span>
                    <span className={`block text-xs leading-4 ${selected ? 'text-cream/80' : 'text-earth/75'}`}>{detail}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${mode}-intro`}
          {...panelMotion}
          transition={transition}
          className="mx-auto mt-8 max-w-xl text-center"
          aria-live="polite"
        >
          <p className="text-xs font-semibold uppercase tracking-label text-olive">
            {mode === 'international' ? t.internationalEyebrow : t.tunisiaEyebrow}
          </p>
          <h3 className="mt-3 font-serif text-3xl italic leading-tight md:text-4xl">
            {mode === 'international' ? t.internationalHeading : t.tunisiaHeading}
          </h3>
          <p className="mt-3 text-sm leading-7 text-earth/75">
            {mode === 'international' ? t.internationalIntro : t.tunisiaIntro}
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${mode}-booking`}
          {...panelMotion}
          transition={transition}
          className="mx-auto mt-7 max-w-lg"
        >
          {mode === 'international' ? (
            <>
              <p className="mb-3 text-xs font-semibold uppercase tracking-label text-olive">{t.calendar}</p>
              <LodgifyWidget locale={locale} />
              <div className="mt-6 overflow-hidden rounded-card border border-olive/15 bg-cream p-6">
                <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.internationalNoteTitle}</p>
                <p className="mt-3 leading-7 text-earth/75">{t.internationalNote}</p>
                <p className="mt-5 border-t border-olive/15 pt-5 text-sm leading-6 text-earth/75">
                  {t.internationalQuestion}{' '}
                  <WhatsAppLink locale={locale} className="font-semibold text-olive underline decoration-olive/30 underline-offset-4 hover:decoration-olive" event="international_booking_question_click">
                    {t.askMahdi}
                  </WhatsAppLink>
                </p>
              </div>
            </>
          ) : (
            <TunisiaAvailabilityCalendar locale={locale} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
