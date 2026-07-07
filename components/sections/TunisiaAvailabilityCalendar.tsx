'use client';

import {useEffect, useMemo, useState} from 'react';
import {CalendarDays, ChevronLeft, ChevronRight, MessageCircle, RefreshCw} from 'lucide-react';
import WhatsAppLink from '@/components/ui/WhatsAppLink';

type BlockedRange = {start: string; end: string};
type Availability = {blocked: BlockedRange[]; today: string; checkedAt: string};

const copy = {
  en: {
    title: 'Availability calendar',
    previous: 'Previous month',
    next: 'Next month',
    loading: 'Checking available dates…',
    errorTitle: 'The calendar is temporarily unavailable.',
    errorText: 'Try again, or ask Mahdi to check your dates directly.',
    retry: 'Try again',
    ask: 'Ask Mahdi on WhatsApp',
    available: 'Available',
    unavailable: 'Unavailable',
    checkoutOnly: 'Available for check-out only',
    past: 'Past date',
    selected: 'Selected stay',
    arrival: 'Check-in',
    departure: 'Check-out',
    selectArrival: 'Select a check-in date',
    selectDeparture: 'Now select your check-out date',
    firstName: 'First name',
    firstNamePlaceholder: 'Your first name',
    guests: 'Guests',
    guestOptions: ['1 guest', '2 guests', '3 guests'],
    send: 'Send selected dates on WhatsApp',
    incompleteDates: 'Select your check-in and check-out dates',
    incompleteName: 'Enter your first name to continue',
    note: 'Availability may take a short time to synchronize. Mahdi confirms your dates before you transfer the deposit.',
    nextTitle: 'What happens next',
    steps: [
      'Mahdi checks the dates and confirms the exact 30% deposit.',
      'You receive the policy and Tunisian bank details.',
      'The booking is added to Lodgify after the deposit is received.'
    ]
  },
  fr: {
    title: 'Calendrier des disponibilités',
    previous: 'Mois précédent',
    next: 'Mois suivant',
    loading: 'Vérification des dates disponibles…',
    errorTitle: 'Le calendrier est temporairement indisponible.',
    errorText: 'Réessayez ou demandez directement à Mahdi de vérifier vos dates.',
    retry: 'Réessayer',
    ask: 'Écrire à Mahdi sur WhatsApp',
    available: 'Disponible',
    unavailable: 'Indisponible',
    checkoutOnly: 'Disponible uniquement comme date de départ',
    past: 'Date passée',
    selected: 'Séjour sélectionné',
    arrival: 'Arrivée',
    departure: 'Départ',
    selectArrival: "Choisissez une date d'arrivée",
    selectDeparture: 'Choisissez maintenant votre date de départ',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Votre prénom',
    guests: 'Voyageurs',
    guestOptions: ['1 voyageur', '2 voyageurs', '3 voyageurs'],
    send: 'Envoyer les dates sur WhatsApp',
    incompleteDates: "Choisissez vos dates d'arrivée et de départ",
    incompleteName: 'Indiquez votre prénom pour continuer',
    note: 'La synchronisation peut prendre un peu de temps. Mahdi confirme les dates avant votre virement.',
    nextTitle: 'La suite',
    steps: [
      "Mahdi vérifie les dates et confirme le montant exact de l'acompte de 30 %.",
      'Vous recevez les conditions et les coordonnées bancaires tunisiennes.',
      "La réservation est ajoutée à Lodgify après réception de l'acompte."
    ]
  }
};

function parseDateKey(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function dateKey(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(value: string, amount: number) {
  const date = parseDateKey(value);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}

function monthValue(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

function isBlocked(value: string, ranges: BlockedRange[]) {
  return ranges.some((range) => value >= range.start && value < range.end);
}

function hasBlockedNight(start: string, end: string, ranges: BlockedRange[]) {
  for (let cursor = start; cursor < end; cursor = addDays(cursor, 1)) {
    if (isBlocked(cursor, ranges)) return true;
  }
  return false;
}

function monthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  return Array.from({length: 42}, (_, index) => {
    const date = new Date(month.getFullYear(), month.getMonth(), index - mondayOffset + 1);
    return {date, key: dateKey(date), inMonth: date.getMonth() === month.getMonth()};
  });
}

export default function TunisiaAvailabilityCalendar({locale}: {locale: string}) {
  const lang = locale === 'fr' ? 'fr' : 'en';
  const localeCode = lang === 'fr' ? 'fr-FR' : 'en-GB';
  const t = copy[lang];
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [failed, setFailed] = useState(false);
  const [requestKey, setRequestKey] = useState(0);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    setFailed(false);

    async function loadAvailability() {
      try {
        const response = await fetch('/api/availability', {signal: controller.signal});
        if (!response.ok) throw new Error('Availability request failed.');
        const data = await response.json() as Availability;
        if (!Array.isArray(data.blocked) || !/^\d{4}-\d{2}-\d{2}$/.test(data.today)) throw new Error('Availability response is invalid.');
        setAvailability(data);
        const today = parseDateKey(data.today);
        setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setFailed(true);
      }
    }

    void loadAvailability();
    return () => controller.abort();
  }, [requestKey]);

  const days = useMemo(() => monthDays(month), [month]);
  const weekdays = useMemo(() => Array.from({length: 7}, (_, index) => {
    const monday = new Date(2024, 0, 1 + index);
    return new Intl.DateTimeFormat(localeCode, {weekday: 'short'}).format(monday).replace('.', '');
  }), [localeCode]);
  const monthLabel = new Intl.DateTimeFormat(localeCode, {month: 'long', year: 'numeric'}).format(month);
  const today = availability?.today ?? dateKey(new Date());
  const firstMonth = parseDateKey(today);
  firstMonth.setDate(1);
  const lastMonth = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + 11, 1);
  const canGoPrevious = monthValue(month) > monthValue(firstMonth);
  const canGoNext = monthValue(month) < monthValue(lastMonth);

  function moveMonth(amount: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  }

  function dayDisabled(value: string) {
    if (!availability || value < availability.today) return true;
    if (!checkIn || checkOut || value <= checkIn) return isBlocked(value, availability.blocked);
    return hasBlockedNight(checkIn, value, availability.blocked);
  }

  function selectDay(value: string) {
    if (dayDisabled(value)) return;
    if (!checkIn || checkOut || value <= checkIn) {
      setCheckIn(value);
      setCheckOut(null);
      return;
    }
    setCheckOut(value);
  }

  function formatSelectedDate(value: string) {
    return new Intl.DateTimeFormat(localeCode, {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'}).format(parseDateKey(value));
  }

  const trimmedFirstName = firstName.trim();
  const whatsappMessage = checkIn && checkOut && trimmedFirstName
    ? lang === 'fr'
      ? `Bonjour Mahdi, je m'appelle ${trimmedFirstName} et je voudrais réserver la Chambre Baya en tant que voyageur en Tunisie.\n\nArrivée : ${formatSelectedDate(checkIn)}\nDépart : ${formatSelectedDate(checkOut)}\nVoyageurs : ${guests}\n\nJe comprends que les dates sont confirmées après réception de l'acompte de 30 %.`
      : `Hello Mahdi, my name is ${trimmedFirstName} and I would like to book the Baya Room as a guest in Tunisia.\n\nCheck-in: ${formatSelectedDate(checkIn)}\nCheck-out: ${formatSelectedDate(checkOut)}\nGuests: ${guests}\n\nI understand that the dates are confirmed after the 30% deposit is received.`
    : '';
  const readyToSend = Boolean(checkIn && checkOut && trimmedFirstName);
  const incompleteLabel = !checkIn || !checkOut ? t.incompleteDates : t.incompleteName;

  if (failed) {
    return (
      <div className="rounded-card border border-olive/15 bg-cream p-6 text-center" role="alert">
        <CalendarDays aria-hidden="true" className="mx-auto h-6 w-6 text-olive" strokeWidth={1.7} />
        <h4 className="mt-4 text-lg font-semibold">{t.errorTitle}</h4>
        <p className="mt-2 text-sm leading-6 text-earth/75">{t.errorText}</p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => setRequestKey((value) => value + 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-earth/30 px-5 py-2.5 text-sm font-semibold transition-[scale,background-color,color] duration-300 hover:bg-earth hover:text-cream active:scale-[0.96]">
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            {t.retry}
          </button>
          <WhatsAppLink locale={locale} event="availability_error_whatsapp_click" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-olive px-5 py-2.5 text-sm font-semibold text-cream transition-[scale,background-color] duration-300 hover:bg-olive-dark active:scale-[0.96]">
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            {t.ask}
          </WhatsAppLink>
        </div>
      </div>
    );
  }

  if (!availability) {
    return (
      <div className="rounded-card border border-olive/15 bg-cream p-4 sm:p-6" aria-busy="true" aria-label={t.loading}>
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-mist" />
          <div className="h-11 w-24 animate-pulse rounded-full bg-mist" />
        </div>
        <div className="mt-6 grid grid-cols-7 gap-1">
          {Array.from({length: 42}, (_, index) => <span key={index} className="h-10 animate-pulse rounded bg-mist/70" />)}
        </div>
        <p className="mt-5 text-center text-sm text-earth/75">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-olive/15 bg-cream p-3 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.title}</p>
          <h4 className="mt-1 font-serif text-2xl italic capitalize">{monthLabel}</h4>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => moveMonth(-1)} disabled={!canGoPrevious} aria-label={t.previous} className="flex h-11 w-11 items-center justify-center rounded-full border border-olive/20 transition-[scale,background-color,color,opacity] duration-300 hover:bg-olive hover:text-cream active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-30">
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => moveMonth(1)} disabled={!canGoNext} aria-label={t.next} className="flex h-11 w-11 items-center justify-center rounded-full border border-olive/20 transition-[scale,background-color,color,opacity] duration-300 hover:bg-olive hover:text-cream active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-30">
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7" aria-hidden="true">
        {weekdays.map((weekday) => <span key={weekday} className="py-2 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-earth/75">{weekday}</span>)}
      </div>
      <div className="grid grid-cols-7" role="group" aria-label={`${t.title}, ${monthLabel}`}>
        {days.map(({date, key, inMonth}) => {
          if (!inMonth) return <span key={key} className="h-11" aria-hidden="true" />;
          const disabled = dayDisabled(key);
          const blocked = isBlocked(key, availability.blocked);
          const checkoutOnly = blocked && !disabled && Boolean(checkIn && key > checkIn);
          const endpoint = key === checkIn || key === checkOut;
          const withinRange = Boolean(checkIn && checkOut && key > checkIn && key < checkOut);
          const dayLabel = new Intl.DateTimeFormat(localeCode, {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}).format(date);
          const statusLabel = key < availability.today ? t.past : checkoutOnly ? t.checkoutOnly : blocked ? t.unavailable : t.available;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => selectDay(key)}
              aria-label={`${dayLabel}, ${statusLabel}`}
              aria-pressed={endpoint || withinRange}
              aria-current={key === availability.today ? 'date' : undefined}
              className={`relative flex h-11 items-center justify-center rounded-md text-sm font-medium transition-[scale,background-color,color] duration-200 active:scale-[0.94] disabled:cursor-not-allowed ${
                endpoint
                  ? 'bg-olive text-cream'
                  : withinRange
                    ? 'bg-olive/10 text-earth'
                    : disabled
                      ? 'text-earth/30 line-through'
                      : 'text-earth hover:bg-mist'
              }`}
            >
              {date.getDate()}
              {key === availability.today && !endpoint && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-olive" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-olive/15 pt-4 text-xs text-earth/75">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-olive/30" />{t.available}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-mist" />{t.unavailable}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-olive" />{t.selected}</span>
      </div>

      <div className="mt-6 rounded-card bg-sand/70 p-4">
        <p className="text-sm font-semibold text-earth">{checkIn ? (checkOut ? t.selected : t.selectDeparture) : t.selectArrival}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.arrival}</p>
            <p className="mt-1 min-h-6 text-sm text-earth/75">{checkIn ? formatSelectedDate(checkIn) : '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.departure}</p>
            <p className="mt-1 min-h-6 text-sm text-earth/75">{checkOut ? formatSelectedDate(checkOut) : '—'}</p>
          </div>
        </div>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-label text-olive" htmlFor="tunisia-booking-first-name">{t.firstName}</label>
        <input
          id="tunisia-booking-first-name"
          type="text"
          required
          autoComplete="given-name"
          maxLength={60}
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder={t.firstNamePlaceholder}
          className="mt-2 min-h-11 w-full rounded-card border border-earth/20 bg-cream px-3 text-sm text-earth placeholder:text-earth/50"
        />
        <label className="mt-4 block text-xs font-semibold uppercase tracking-label text-olive" htmlFor="tunisia-booking-guests">{t.guests}</label>
        <select id="tunisia-booking-guests" value={guests} onChange={(event) => setGuests(Number(event.target.value))} className="mt-2 min-h-11 w-full rounded-card border border-earth/20 bg-cream px-3 text-sm text-earth">
          {t.guestOptions.map((label, index) => <option key={label} value={index + 1}>{label}</option>)}
        </select>
      </div>

      <div className="mt-5">
        {readyToSend ? (
          <WhatsAppLink locale={locale} message={whatsappMessage} event="local_booking_whatsapp_click" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-olive px-5 py-3 text-center text-sm font-semibold text-cream transition-[scale,background-color] duration-300 hover:bg-olive-dark active:scale-[0.96]">
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            {t.send}
          </WhatsAppLink>
        ) : (
          <button type="button" disabled className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-olive/35 px-5 py-3 text-center text-sm font-semibold text-cream" aria-label={incompleteLabel}>
            {incompleteLabel}
          </button>
        )}
        <p className="mt-4 text-xs leading-5 text-earth/75">{t.note}</p>
      </div>

      <div className="mt-6 border-t border-olive/15 pt-5">
        <p className="text-xs font-semibold uppercase tracking-label text-olive">{t.nextTitle}</p>
        <ol className="mt-3 space-y-3">
          {t.steps.map((step, index) => (
            <li key={step} className="grid grid-cols-[1.75rem_1fr] gap-2 text-sm leading-6 text-earth/75">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-olive/25 text-xs font-semibold text-olive" aria-hidden="true">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
