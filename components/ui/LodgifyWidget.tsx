'use client';

import {useEffect, useRef} from 'react';
import type {CSSProperties} from 'react';

// Lodgify portable search bar (account 659917). Themed to the Farm El Baya palette.
// Booking mode is configured Lodgify-side as "request to book / pay on arrival".
const WEBSITE_ID = '659917';
const CHECKOUT_BASE = 'https://checkout.lodgify.com/mahdi-khamassi';
const RENTAL_ID = '815603';
const SCRIPT_SRC = 'https://app.lodgify.com/portable-search-bar/stable/renderPortableSearchBar.js';

const theme: CSSProperties = {
  display: 'block',
  width: '100%',
  // Lodgify CSS variables — terracotta primary on a cream surface, pill buttons.
  ['--ldg-psb-background' as string]: '#FAF7F2',
  ['--ldg-psb-border-radius' as string]: '8px',
  ['--ldg-psb-padding' as string]: '14px',
  ['--ldg-psb-input-background' as string]: '#ffffff',
  ['--ldg-psb-button-border-radius' as string]: '9999px',
  ['--ldg-psb-color-primary' as string]: '#C4622D',
  ['--ldg-psb-color-primary-lighter' as string]: '#E0A483',
  ['--ldg-psb-color-primary-darker' as string]: '#2C1810',
  ['--ldg-psb-color-primary-contrast' as string]: '#FAF7F2',
  ['--ldg-semantic-color-primary' as string]: '#C4622D',
  ['--ldg-semantic-color-primary-lighter' as string]: '#E0A483',
  ['--ldg-semantic-color-primary-darker' as string]: '#2C1810',
  ['--ldg-semantic-color-primary-contrast' as string]: '#FAF7F2',
  ['--ldg-component-modal-z-index' as string]: '999'
};

const labels = {
  en: {
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guests: 'Guests',
    guestsSingular: '{{NumberOfGuests}} guest',
    guestsPlural: '{{NumberOfGuests}} guests',
    search: 'Check availability',
    done: 'Done'
  },
  fr: {
    checkIn: 'Arrivée',
    checkOut: 'Départ',
    guests: 'Voyageurs',
    guestsSingular: '{{NumberOfGuests}} voyageur',
    guestsPlural: '{{NumberOfGuests}} voyageurs',
    search: 'Vérifier les disponibilités',
    done: 'Terminé'
  }
};

export default function LodgifyWidget({locale}: {locale: string}) {
  const lang = locale === 'fr' ? 'fr' : 'en';
  const t = labels[lang];
  const containerRef = useRef<HTMLDivElement>(null);

  // The Lodgify script renders by scanning the DOM for #lodgify-search-bar when it
  // executes. With Next.js client-side navigation the script only runs once on full
  // load, so we (re)append it on every mount so the widget renders each visit.
  useEffect(() => {
    const container = containerRef.current;
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
      if (container) container.innerHTML = '';
    };
  }, [lang]);

  return (
    <div
      ref={containerRef}
      id="lodgify-search-bar"
      style={theme}
      data-website-id={WEBSITE_ID}
      data-language-code={lang}
      data-checkout-page-url={`${CHECKOUT_BASE}/${lang}/#/${RENTAL_ID}`}
      data-dates-check-in-label={t.checkIn}
      data-dates-check-out-label={t.checkOut}
      data-guests-counter-label={t.guests}
      data-guests-input-singular-label={t.guestsSingular}
      data-guests-input-plural-label={t.guestsPlural}
      data-search-button-label={t.search}
      data-done-label={t.done}
      data-new-tab="true"
      data-version="stable"
      data-has-guests-breakdown
    />
  );
}
