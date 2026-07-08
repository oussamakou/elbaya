'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import dynamic from 'next/dynamic';
import {Globe2, MapPin} from 'lucide-react';
import WhatsAppLink from '@/components/ui/WhatsAppLink';

type BookingMode = 'international' | 'tunisia';

function BookingPanelSkeleton() {
  return (
    <div className="min-h-[246px] animate-pulse rounded-card border border-olive/15 bg-cream p-5" aria-busy="true">
      <div className="h-11 rounded-md bg-mist" />
      <div className="mt-4 h-11 rounded-md bg-mist" />
      <div className="mt-5 h-12 rounded-full bg-olive/20" />
    </div>
  );
}

// Each booking path is downloaded only after the visitor chooses it. In
// particular, this keeps Lodgify's third-party bundle off the initial page.
const LodgifyWidget = dynamic(() => import('@/components/ui/LodgifyWidget'), {
  loading: BookingPanelSkeleton
});
const TunisiaAvailabilityCalendar = dynamic(() => import('@/components/sections/TunisiaAvailabilityCalendar'), {
  loading: BookingPanelSkeleton
});

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

function readModeParam(value: string | null): BookingMode | null {
  return value === 'international' || value === 'tunisia' ? value : null;
}

export default function BookingFlow({locale}: {locale: string}) {
  const lang = locale === 'fr' ? 'fr' : 'en';
  const t = copy[lang];
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<BookingMode | null>(() => readModeParam(searchParams.get('mode')));

  // Re-reads the URL when it changes on an already-mounted page (e.g. the
  // hero button linking to /book?mode=international triggers a client-side
  // transition rather than a full reload, so the initial useState lazy
  // initializer above won't re-run on its own).
  useEffect(() => {
    const paramMode = readModeParam(searchParams.get('mode'));
    if (paramMode) setMode(paramMode);
  }, [searchParams]);

  function selectMode(nextMode: BookingMode) {
    setMode(nextMode);
  }

  return (
    <div className="mx-auto max-w-2xl text-left">
      <div className="mx-auto max-w-lg">
        <p className="text-center text-xs font-semibold uppercase tracking-label text-olive">{t.chooser}</p>
        <div className="relative mt-4 grid grid-cols-2 rounded-card border border-olive/20 bg-cream p-1.5" role="group" aria-label={t.chooser}>
          {/* Sliding selection pill: sized to one grid cell, slides by its own
              width when the Tunisia option is active. Reduced motion is handled
              by the global prefers-reduced-motion rule in globals.css. */}
          {mode && (
            <span
              aria-hidden="true"
              className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-sm bg-olive transition-transform duration-300 ease-out ${mode === 'tunisia' ? 'translate-x-full' : 'translate-x-0'}`}
            />
          )}
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
                className={`relative min-h-14 rounded-sm px-3 py-2 text-left transition-colors duration-200 ${selected ? 'text-cream' : 'text-earth hover:bg-mist'}`}
              >
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

      {/* Nothing expensive is mounted until the visitor explicitly chooses a path. */}
      {mode && <div key={`${mode}-intro`} className="panel-enter mx-auto mt-8 max-w-xl text-center" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-label text-olive">
            {mode === 'international' ? t.internationalEyebrow : t.tunisiaEyebrow}
          </p>
          <h3 className="mt-3 font-serif text-3xl italic leading-tight md:text-4xl">
            {mode === 'international' ? t.internationalHeading : t.tunisiaHeading}
          </h3>
          <p className="mt-3 text-sm leading-7 text-earth/75">
            {mode === 'international' ? t.internationalIntro : t.tunisiaIntro}
          </p>
      </div>}

      {mode && <div key={`${mode}-booking`} className="panel-enter mx-auto mt-7 max-w-lg" style={{animationDelay: '90ms'}}>
          {mode === 'international' ? (
            <>
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-label text-olive">{t.calendar}</p>
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
      </div>}
    </div>
  );
}
