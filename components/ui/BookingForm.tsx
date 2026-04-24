'use client';

import Image from 'next/image';
import {useState} from 'react';
import WhatsAppLink from './WhatsAppLink';

const hearOptions = ['Google', 'Airbnb', 'Booking.com', 'Instagram', 'Friend', 'Other'];

export default function BookingForm({locale, copy}: {locale: string; copy: {submit: string; success: string; error: string; payment: string; deposit: string}}) {
  const fr = locale === 'fr';
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const labels = {
    name: fr ? 'Nom complet *' : 'Full name *',
    email: fr ? 'Adresse e-mail *' : 'Email address *',
    phone: fr ? 'WhatsApp / Telephone *' : 'WhatsApp / Phone *',
    in: fr ? "Date d'arrivee *" : 'Check-in date *',
    out: fr ? 'Date de depart *' : 'Check-out date *',
    guests: fr ? "Nombre d'hotes *" : 'Number of guests *',
    room: fr ? 'Preference de chambre' : 'Room preference',
    meals: fr ? 'Repas souhaites' : 'Meal requests',
    notes: fr ? 'Demandes particulieres' : 'Special requests or notes',
    heard: fr ? 'Comment nous avez-vous connus ?' : 'How did you hear about us?'
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (String(data.checkOut) <= String(data.checkIn)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    const res = await fetch('/api/book', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    setStatus(res.ok ? 'success' : 'error');
    if (res.ok) form.reset();
  }

  return (
    <section className="px-5 pb-24">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[0.42fr_0.58fr]">
        <aside className="h-fit border border-mist bg-earth p-7 text-cream md:sticky md:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">{fr ? 'Avant de reserver' : 'Before you request'}</p>
          <h2 className="mt-4 font-serif text-4xl italic leading-tight">{fr ? 'Une demande, pas un paiement immediat.' : 'A request, not an instant charge.'}</h2>
          <p className="mt-5 leading-8 text-cream/72">
            {fr
              ? 'Votre message permet de confirmer les chambres, les repas et l arrivee. Vous recevez une reponse claire avant toute confirmation.'
              : 'Your message confirms rooms, meals, and arrival details. You get a clear reply before anything is confirmed.'}
          </p>
          <div className="mt-7 space-y-3 text-sm text-cream/82">
            <p>{fr ? 'Reponse sous 24 heures' : 'Reply within 24 hours'}</p>
            <p>{fr ? 'Petit-dejeuner inclus' : 'Breakfast included'}</p>
            <p>{fr ? 'Paiement a l arrivee' : 'Payment on arrival'}</p>
            <p>{fr ? 'Ajoutez votre numero WhatsApp pour une reponse plus rapide' : 'Add your WhatsApp number for the fastest reply'}</p>
          </div>
          <WhatsAppLink locale={locale} className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-cream/45 px-5 py-3 text-sm font-semibold text-cream transition hover:bg-cream hover:text-dusk">
            {fr ? 'Question rapide sur WhatsApp' : 'Quick question on WhatsApp'}
          </WhatsAppLink>
        </aside>

        <div className="rounded-[8px] border border-mist bg-cream p-5 md:p-9">
          <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">{labels.name}<input className="field" name="name" required autoComplete="name" /></label>
            <label className="space-y-2 text-sm font-medium">{labels.email}<input className="field" name="email" type="email" required autoComplete="email" /></label>
            <label className="space-y-2 text-sm font-medium">{labels.phone}<input className="field" name="phone" required autoComplete="tel" /></label>
            <label className="space-y-2 text-sm font-medium">{labels.guests}<input className="field" name="guests" type="number" min="1" max="9" required /></label>
            <label className="space-y-2 text-sm font-medium">{labels.in}<input className="field" name="checkIn" type="date" required /></label>
            <label className="space-y-2 text-sm font-medium">{labels.out}<input className="field" name="checkOut" type="date" required /></label>
            <label className="space-y-2 text-sm font-medium md:col-span-2">{labels.room}
              <select className="field" name="room">
                <option>{fr ? 'Sans preference' : 'No preference'}</option>
                <option>Room 1</option><option>Room 2</option><option>Room 3</option>
              </select>
            </label>
            <fieldset className="space-y-3 rounded-[8px] border border-mist p-4 md:col-span-2">
              <legend className="px-2 text-sm font-medium">{labels.meals}</legend>
              {(fr ? ['Petit-dejeuner seulement (inclus)', 'Dejeuner certains jours (sur demande)', 'Diner certains jours (sur demande)'] : ['Breakfast only (included)', 'Lunch on some days (on request)', 'Dinner on some days (on request)']).map((meal) => (
                <label key={meal} className="flex min-h-8 items-center gap-3 text-sm"><input name="meals" value={meal} type="checkbox" /> {meal}</label>
              ))}
            </fieldset>
            <label className="space-y-2 text-sm font-medium md:col-span-2">{labels.notes}<textarea className="field min-h-32" name="notes" placeholder={fr ? 'Arrivee, allergies, repas, questions...' : 'Arrival time, allergies, meals, questions...'} /></label>
            <label className="space-y-2 text-sm font-medium md:col-span-2">{labels.heard}
              <select className="field" name="heard">{hearOptions.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <div className="rounded-[8px] border border-terracotta/25 bg-sand p-5 md:col-span-2">
              <p className="leading-7">{copy.payment}</p>
              <p className="mt-3 text-sm text-bark">{copy.deposit}</p>
            </div>
            <div className="md:col-span-2">
              <button disabled={status === 'loading'} className="w-full rounded-full bg-terracotta px-7 py-4 text-sm font-semibold text-cream transition hover:bg-earth active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70 md:w-fit">
                {status === 'loading' ? (fr ? 'Envoi en cours...' : 'Sending request...') : copy.submit}
              </button>
              <p className="mt-3 text-sm text-earth/60">{fr ? 'Vous ne serez pas facture en envoyant ce formulaire.' : 'You will not be charged by sending this form.'}</p>
            </div>
            {status === 'success' && (
              <div className="flex items-center gap-4 rounded-[8px] bg-sand p-4 md:col-span-2">
                <Image src="/assets/images/logo.png" alt="" width={140} height={60} className="scale-[2] object-contain" />
                <p className="text-sm leading-6 text-earth/75">{copy.success}</p>
              </div>
            )}
            {status === 'error' && <p className="text-sm text-terracotta md:col-span-2">{copy.error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
