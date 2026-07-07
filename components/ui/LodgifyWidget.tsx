'use client';

import {useEffect, useRef} from 'react';
import type {CSSProperties} from 'react';

// Lodgify "book now box" — inline availability calendar + price + Book button.
// Account 659917 / rental 815603. Booking mode is set Lodgify-side to
// "request to book / pay on arrival".
const WEBSITE_ID = '659917';
const RENTAL_ID = '815603';
const SLUG = 'mahdi-khamassi';
const SCRIPT_SRC = 'https://app.lodgify.com/book-now-box/stable/renderBookNowBox.js';

const theme: CSSProperties = {
  display: 'block',
  width: '100%',
  minHeight: '246px',
  // Farm El Baya palette — olive primary (from the logo), cream surface, your fonts.
  ['--ldg-bnb-background' as string]: '#FAF7F2',
  ['--ldg-bnb-border-radius' as string]: '8px',
  ['--ldg-bnb-box-shadow' as string]: '0px 16px 40px -12px rgba(44, 24, 16, 0.18)',
  ['--ldg-bnb-padding' as string]: '14px',
  ['--ldg-bnb-input-background' as string]: '#ffffff',
  ['--ldg-bnb-button-border-radius' as string]: '9999px',
  ['--ldg-bnb-color-primary' as string]: '#6F7243',
  ['--ldg-bnb-color-primary-lighter' as string]: '#A4A887',
  ['--ldg-bnb-color-primary-darker' as string]: '#565932',
  ['--ldg-bnb-color-primary-contrast' as string]: '#FAF7F2',
  ['--ldg-component-calendar-cell-selection-bg-color' as string]: '#6F7243',
  ['--ldg-component-calendar-cell-selection-color' as string]: '#FAF7F2',
  ['--ldg-component-calendar-cell-selected-bg-color' as string]: '#E4E5D3',
  ['--ldg-component-calendar-cell-selected-color' as string]: '#2C1810',
  ['--ldg-bnb-font-family' as string]: 'inherit'
};

const labels = {
  en: {
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guests: 'Guests',
    guestsSingular: '{{NumberOfGuests}} guest',
    guestsPlural: '{{NumberOfGuests}} guests',
    totalPrice: 'Total price:',
    selectDates: 'Select dates to see total price',
    fromLabel: 'From',
    perNight: 'per night',
    book: 'Book now',
    guestsBreakdown: 'Guests',
    adults: '{"one":"adult","other":"adults"}',
    adultsDesc: 'Ages {minAge} or above',
    children: '{"one":"child","other":"children"}',
    childrenDesc: 'Ages {minAge}-{maxAge}',
    childrenNo: 'Not suitable for children',
    infants: '{"one":"infant","other":"infants"}',
    infantsDesc: 'Under {maxAge}',
    infantsNo: 'Not suitable for infants',
    pets: '{"one":"pet","other":"pets"}',
    petsNo: 'Not allowed',
    done: 'Done'
  },
  fr: {
    checkIn: 'Arrivée',
    checkOut: 'Départ',
    guests: 'Voyageurs',
    guestsSingular: '{{NumberOfGuests}} voyageur',
    guestsPlural: '{{NumberOfGuests}} voyageurs',
    totalPrice: 'Prix total :',
    selectDates: 'Sélectionnez vos dates pour voir le prix total',
    fromLabel: 'Dès',
    perNight: 'par nuit',
    book: 'Réserver',
    guestsBreakdown: 'Voyageurs',
    adults: '{"one":"adulte","other":"adultes"}',
    adultsDesc: 'Âges {minAge} et plus',
    children: '{"one":"enfant","other":"enfants"}',
    childrenDesc: 'Âges {minAge}-{maxAge}',
    childrenNo: 'Non adapté aux enfants',
    infants: '{"one":"bébé","other":"bébés"}',
    infantsDesc: 'Moins de {maxAge}',
    infantsNo: 'Non adapté aux bébés',
    pets: '{"one":"animal","other":"animaux"}',
    petsNo: 'Non autorisés',
    done: 'Terminé'
  }
};

export default function LodgifyWidget({locale}: {locale: string}) {
  const lang = locale === 'fr' ? 'fr' : 'en';
  const t = labels[lang];
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // The Lodgify script renders by scanning the DOM for #lodgify-book-now-box when it
  // executes (it exposes no global API). With Next.js client-side navigation the
  // script only runs once on full load, so we (re)append it on every mount to render
  // on each visit. The injection itself is deferred one tick: React Strict Mode
  // replays mount -> cleanup -> mount synchronously in dev, and injecting the script
  // immediately would run Lodgify's (non-reentrant) bundle twice back to back against
  // the same container, which throws inside its internals. Deferring lets the
  // synchronous replay's cleanup cancel the first injection before it ever fires, so
  // the script only actually loads once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      container.innerHTML = '';
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
      scriptRef.current = script;
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      scriptRef.current?.remove();
      scriptRef.current = null;
    };
  }, [lang]);

  return (
    <div
      ref={containerRef}
      id="lodgify-book-now-box"
      style={theme}
      data-rental-id={RENTAL_ID}
      data-website-id={WEBSITE_ID}
      data-slug={SLUG}
      data-language-code={lang}
      data-new-tab="true"
      data-version="stable"
      data-has-guests-breakdown
      data-check-in-label={t.checkIn}
      data-check-out-label={t.checkOut}
      data-guests-label={t.guests}
      data-guests-singular-label={t.guestsSingular}
      data-guests-plural-label={t.guestsPlural}
      data-total-price-label={t.totalPrice}
      data-select-dates-to-see-price-label={t.selectDates}
      data-minimum-price-per-night-first-label={t.fromLabel}
      data-minimum-price-per-night-second-label={t.perNight}
      data-book-button-label={t.book}
      data-guests-breakdown-label={t.guestsBreakdown}
      data-adults-label={t.adults}
      data-adults-description={t.adultsDesc}
      data-children-label={t.children}
      data-children-description={t.childrenDesc}
      data-children-not-allowed-label={t.childrenNo}
      data-infants-label={t.infants}
      data-infants-description={t.infantsDesc}
      data-infants-not-allowed-label={t.infantsNo}
      data-pets-label={t.pets}
      data-pets-not-allowed-label={t.petsNo}
      data-done-label={t.done}
    />
  );
}
