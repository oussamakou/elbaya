'use client';

import Image from 'next/image';
import {useState} from 'react';

const hearOptions = ['Google', 'Airbnb', 'Booking.com', 'Instagram', 'Friend', 'Other'];

export default function BookingForm({locale, copy}: {locale: string; copy: {submit: string; success: string; error: string; payment: string; deposit: string}}) {
  const fr = locale === 'fr';
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
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
      <div className="mx-auto max-w-4xl rounded-[8px] border border-mist bg-cream p-5 md:p-9">
        <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">{labels.name}<input className="field" name="name" required /></label>
          <label className="space-y-2 text-sm font-medium">{labels.email}<input className="field" name="email" type="email" required /></label>
          <label className="space-y-2 text-sm font-medium">{labels.phone}<input className="field" name="phone" required /></label>
          <label className="space-y-2 text-sm font-medium">{labels.guests}<input className="field" name="guests" type="number" min="1" max="9" required /></label>
          <label className="space-y-2 text-sm font-medium">{labels.in}<input className="field" name="checkIn" type="date" required /></label>
          <label className="space-y-2 text-sm font-medium">{labels.out}<input className="field" name="checkOut" type="date" required /></label>
          <label className="space-y-2 text-sm font-medium md:col-span-2">{labels.room}
            <select className="field" name="room">
              <option>{fr ? 'Sans préférence' : 'No preference'}</option>
              <option>Room 1</option><option>Room 2</option><option>Room 3</option>
            </select>
          </label>
          <fieldset className="space-y-3 rounded-[8px] border border-mist p-4 md:col-span-2">
            <legend className="px-2 text-sm font-medium">{labels.meals}</legend>
            {(fr ? ['Petit-déjeuner seulement (inclus)', 'Déjeuner certains jours (sur demande)', 'Dîner certains jours (sur demande)'] : ['Breakfast only (included)', 'Lunch on some days (on request)', 'Dinner on some days (on request)']).map((meal) => (
              <label key={meal} className="flex items-center gap-3 text-sm"><input name="meals" value={meal} type="checkbox" /> {meal}</label>
            ))}
          </fieldset>
          <label className="space-y-2 text-sm font-medium md:col-span-2">{labels.notes}<textarea className="field min-h-32" name="notes" /></label>
          <label className="space-y-2 text-sm font-medium md:col-span-2">{labels.heard}
            <select className="field" name="heard">{hearOptions.map((item) => <option key={item}>{item}</option>)}</select>
          </label>
          <div className="rounded-[8px] border border-terracotta/25 bg-sand p-5 md:col-span-2">
            <p className="leading-7">{copy.payment}</p>
            <p className="mt-3 text-sm text-bark">{copy.deposit}</p>
          </div>
          <button disabled={status === 'loading'} className="rounded-full bg-terracotta px-7 py-3 text-sm font-medium text-cream transition hover:bg-earth active:scale-[0.97] md:w-fit">{copy.submit}</button>
          {status === 'success' && (
            <div className="flex items-center gap-4 rounded-[8px] bg-sand p-4 md:col-span-2">
              <Image src="/assets/images/logo.webp" alt="" width={80} height={36} />
              <p className="text-sm leading-6 text-earth/75">{copy.success}</p>
            </div>
          )}
          {status === 'error' && <p className="text-sm text-terracotta md:col-span-2">{copy.error}</p>}
        </form>
      </div>
    </section>
  );
}
