'use client';

import Image from 'next/image';
import {useState} from 'react';
import {track} from '@vercel/analytics';
import WhatsAppLink, {WHATSAPP_PHONE} from './WhatsAppLink';

const hearOptions = ['Google', 'Airbnb', 'Booking.com', 'Instagram', 'AI / LLM (ChatGPT, Claude, Perplexity)', 'Friend', 'Other'];
const roomOptions = [
  'No preference - choose the best available room',
  'Olive Room - warm interior and olive-grove window',
  'Garden Room - closest to the garden paths',
  'Rooftop Room - easiest access for stargazing'
];
const roomOptionsFr = [
  'Sans préférence - choisissez la meilleure chambre disponible',
  'Chambre Olivier - intérieur chaleureux et vue oliviers',
  'Chambre Jardin - proche des sentiers du jardin',
  'Chambre Toit - accès facile au rooftop'
];

function buildWhatsAppMessage(form: FormData, fr: boolean) {
  const get = (key: string) => String(form.get(key) || '').trim();
  const meals = form.getAll('meals').map(String).join(', ');
  const dash = '—';

  if (fr) {
    return [
      'Bonjour Mahdi ! Je souhaite demander un séjour à Farm El Baya.',
      '',
      `Arrivée : ${get('checkIn')}`,
      `Départ : ${get('checkOut')}`,
      `Voyageurs : ${get('guests')}`,
      `Chambre : ${get('room') || dash}`,
      `Repas : ${meals || dash}`,
      `Remarques : ${get('notes') || dash}`,
      '',
      `Nom : ${get('name')}`,
      `E-mail : ${get('email')}`,
      `Téléphone : ${get('phone')}`,
      `Connu via : ${get('heard')}`
    ].join('\n');
  }

  return [
    "Hi Mahdi! I'd like to request a stay at Farm El Baya.",
    '',
    `Check-in: ${get('checkIn')}`,
    `Check-out: ${get('checkOut')}`,
    `Guests: ${get('guests')}`,
    `Room: ${get('room') || dash}`,
    `Meals: ${meals || dash}`,
    `Notes: ${get('notes') || dash}`,
    '',
    `Name: ${get('name')}`,
    `Email: ${get('email')}`,
    `Phone: ${get('phone')}`,
    `Heard about us via: ${get('heard')}`
  ].join('\n');
}

export default function BookingForm({locale, copy}: {locale: string; copy: {submit: string; success: string; error: string; payment: string; deposit: string}}) {
  const fr = locale === 'fr';
  const today = new Date().toISOString().split('T')[0];
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');
  const [dateError, setDateError] = useState(false);
  const [waUrl, setWaUrl] = useState('');
  const labels = {
    name: fr ? 'Nom complet *' : 'Full name *',
    email: fr ? 'Adresse e-mail *' : 'Email address *',
    phone: fr ? 'WhatsApp / Téléphone *' : 'WhatsApp / Phone *',
    in: fr ? "Date d'arrivée *" : 'Check-in date *',
    out: fr ? 'Date de départ *' : 'Check-out date *',
    guests: fr ? "Nombre d'hôtes *" : 'Number of guests *',
    room: fr ? 'Préférence de chambre' : 'Room preference',
    meals: fr ? 'Repas souhaités' : 'Meal requests',
    notes: fr ? 'Demandes particulières' : 'Special requests or notes',
    heard: fr ? 'Comment nous avez-vous connus ?' : 'How did you hear about us?'
  };

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    track('booking_form_submit_attempt');
    const form = event.currentTarget;
    const data = new FormData(form);
    setDateError(false);

    if (String(data.get('checkOut')) <= String(data.get('checkIn'))) {
      setDateError(true);
      track('booking_form_validation_error', {reason: 'checkout_before_checkin'});
      return;
    }

    // Primary, can't-silently-fail delivery: the guest sends the request from
    // their own WhatsApp, opening a real thread with Mahdi.
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildWhatsAppMessage(data, fr))}`;
    setWaUrl(url);
    setStatus('sent');
    track('booking_form_whatsapp_open');
    // window.open must run synchronously inside the gesture to dodge popup blockers.
    window.open(url, '_blank', 'noopener,noreferrer');

    // Best-effort backup record for the owner's own log/analytics. Never gates the UI.
    const payload = Object.fromEntries(data.entries()) as Record<string, unknown>;
    payload.meals = data.getAll('meals').map(String).join(', ');
    fetch('/api/book', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)}).catch(() => {});
  }

  return (
    <section className="px-5 pb-24">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[0.42fr_0.58fr]">
        <aside className="h-fit border border-mist bg-earth p-7 text-cream md:sticky md:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">{fr ? 'Avant de réserver' : 'Before you request'}</p>
          <h2 className="mt-4 font-serif text-4xl italic leading-tight">{fr ? 'Une demande, pas un paiement immédiat.' : 'A request, not an instant charge.'}</h2>
          <p className="mt-5 leading-8 text-cream/72">
            {fr
              ? "Votre message confirme les chambres, les repas et l'arrivée. Vous recevez une réponse claire avant toute confirmation."
              : 'Your message confirms rooms, meals, and arrival details. You get a clear reply before anything is confirmed.'}
          </p>
          <div className="mt-7 space-y-3 text-sm text-cream/82">
            <p>{fr ? 'Seulement 3 chambres privées sur la ferme' : 'Only 3 private rooms on the farm'}</p>
            <p>{fr ? "Week-ends et saisons de récolte partent en premier" : 'Weekends and harvest seasons fill first'}</p>
            <p>{fr ? 'Réponse sous 24 heures' : 'Reply within 24 hours'}</p>
            <p>{fr ? 'Aucun paiement avant confirmation' : 'No payment before confirmation'}</p>
            <p>{fr ? 'La demande se termine sur WhatsApp pour une réponse plus rapide' : 'Your request finishes on WhatsApp for the fastest reply'}</p>
          </div>
          <WhatsAppLink locale={locale} className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-cream/45 px-5 py-3 text-sm font-semibold text-cream transition hover:bg-cream/20">
            {fr ? 'Question rapide sur WhatsApp' : 'Quick question on WhatsApp'}
          </WhatsAppLink>
        </aside>

        <div className="rounded-[8px] border border-mist bg-cream p-5 md:p-9">
          <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
            <p className="text-sm text-earth/60 md:col-span-2">{fr ? 'Les champs marqués * sont obligatoires.' : 'Fields marked * are required.'}</p>
            <label className="space-y-2 text-sm font-medium">{labels.name}<input className="field" name="name" required autoComplete="name" /></label>
            <label className="space-y-2 text-sm font-medium">{labels.email}<input className="field" name="email" type="email" required autoComplete="email" /></label>
            <label className="space-y-2 text-sm font-medium">{labels.phone}<input className="field" name="phone" required autoComplete="tel" inputMode="tel" /></label>
            <label className="space-y-2 text-sm font-medium">{labels.guests}<input className="field" name="guests" type="number" min="1" max="9" required /></label>
            <label className="space-y-2 text-sm font-medium">{labels.in}<input className="field" name="checkIn" type="date" min={today} required /></label>
            <label className="space-y-2 text-sm font-medium">{labels.out}<input className="field" name="checkOut" type="date" min={today} required /></label>
            <label className="space-y-2 text-sm font-medium md:col-span-2">{labels.room}
              <select className="field" name="room">
                {(fr ? roomOptionsFr : roomOptions).map((room) => <option key={room}>{room}</option>)}
              </select>
            </label>
            <fieldset className="space-y-3 rounded-[8px] border border-mist p-4 md:col-span-2">
              <legend className="px-2 text-sm font-medium">{labels.meals}</legend>
              {(fr ? ['Petit-déjeuner seulement (inclus)', 'Déjeuner certains jours (sur demande)', 'Dîner certains jours (sur demande)'] : ['Breakfast only (included)', 'Lunch on some days (on request)', 'Dinner on some days (on request)']).map((meal) => (
                <label key={meal} className="flex min-h-8 items-center gap-3 text-sm"><input name="meals" value={meal} type="checkbox" /> {meal}</label>
              ))}
            </fieldset>
            <label className="space-y-2 text-sm font-medium md:col-span-2">{labels.notes}<textarea className="field min-h-32" name="notes" placeholder={fr ? 'Heure d’arrivée, allergies, repas, questions...' : 'Arrival time, allergies, meals, questions...'} /></label>
            <label className="space-y-2 text-sm font-medium md:col-span-2">{labels.heard}
              <select className="field" name="heard">{hearOptions.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <div className="rounded-[8px] border border-terracotta/25 bg-sand p-5 md:col-span-2">
              <p className="leading-7">{copy.payment}</p>
              <p className="mt-3 text-sm text-bark">{copy.deposit}</p>
            </div>
            {dateError && (
              <p role="alert" className="text-sm font-medium text-terracotta md:col-span-2">
                {fr ? "La date de départ doit être après la date d'arrivée." : 'Check-out must be after check-in.'}
              </p>
            )}
            <div className="md:col-span-2">
              <button className="w-full rounded-full bg-terracotta px-7 py-4 text-sm font-semibold text-cream transition hover:bg-earth active:scale-[0.97] md:w-fit">
                {fr ? 'Demander sur WhatsApp' : 'Request on WhatsApp'}
              </button>
              <p className="mt-3 text-sm text-earth/60">{fr ? 'Vous ne serez pas facturé en envoyant cette demande.' : 'You will not be charged by sending this request.'}</p>
            </div>
            {status === 'sent' && (
              <div className="flex items-center gap-4 rounded-[8px] bg-sand p-4 md:col-span-2">
                <span className="relative block h-16 w-20 shrink-0">
                  <Image src="/assets/images/logo-cropped.png" alt="" fill sizes="80px" className="object-contain" />
                </span>
                <p className="text-sm leading-6 text-earth/75">
                  {fr
                    ? 'WhatsApp s’est ouvert avec votre demande prête à envoyer — appuyez sur Envoyer pour joindre Mahdi (réponse sous 24 h). '
                    : "WhatsApp opened with your request ready to send — tap send to reach Mahdi (reply within 24h). "}
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-terracotta underline">
                    {fr ? "Si rien ne s’est ouvert, appuyez ici." : "If nothing opened, tap here."}
                  </a>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
