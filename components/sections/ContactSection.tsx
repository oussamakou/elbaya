"use client";
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {Link} from '@/i18n/routing';
import {errorMessage} from '@/components/shop/copy';

const inputClass='mt-2 block w-full rounded-md border border-olive/25 bg-cream px-4 py-3 text-base text-earth outline-none focus:border-olive focus:ring-2 focus:ring-olive/20';
export default function ContactSection({locale,standalone=false}:{locale:string;standalone?:boolean}) {
  const fr=locale==='fr';
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[sent,setSent]=useState(false);
  const [ready,setReady]=useState(false);
  useEffect(()=>setReady(true),[]);
  const key=useRef('');
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();if(busy)return;
    const values=Object.fromEntries(new FormData(event.currentTarget));
    key.current ||= crypto.randomUUID();setBusy(true);setError('');
    try {
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,requestKey:key.current})});
      const result=await response.json();
      if(!response.ok)throw Error(errorMessage(result.error,fr?'fr':'en'));
      setSent(true);
    }catch(e){setError(e instanceof Error?e.message:(fr?'Envoi indisponible. Réessayez.':'Unable to send. Please try again.'));}
    finally{setBusy(false);}
  }
  const title=fr?'Un mot à Mehdi.':'A note to Mehdi.';
  return <section id="contact" className={`${standalone?'pb-20 pt-36 md:pt-40':'border-t border-olive/15 py-16 md:py-24'} bg-sand px-5`}>
    <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-[.85fr_1fr] md:gap-20">
      <div>
        <p className="text-xs font-medium uppercase tracking-label text-olive">{fr?'PARLONS D’EL BAYA':'LET’S TALK EL BAYA'}</p>
        {standalone?<h1 className="mt-4 font-serif text-5xl italic leading-tight md:text-6xl">{title}</h1>:<h2 className="mt-4 font-serif text-5xl italic leading-tight md:text-6xl">{title}</h2>}
        <p className="mt-5 max-w-md leading-8 text-earth/75">{fr?'Une question sur la ferme, un séjour ou une idée à partager ? Écrivez à Mehdi. Il reçoit votre message directement par email et pourra vous répondre.':'A question about the farm, a stay, or an idea to share? Write to Mehdi. Your message goes straight to his email so he can reply to you.'}</p>
        <p className="mt-7 text-sm leading-7 text-earth/70">{fr?'Vous avez déjà vos dates en tête ?':'Already have dates in mind?'}{' '}<Link href="/book" className="border-b border-olive pb-1 text-olive">{fr?'Voir les disponibilités':'Check availability'} →</Link></p>
      </div>
      {sent?<div role="status" className="rounded-lg border border-olive/25 bg-cream p-7 md:p-10"><p className="text-xs uppercase tracking-label text-olive">{fr?'MESSAGE REÇU':'MESSAGE RECEIVED'}</p><h2 className="mt-4 font-serif text-4xl italic">{fr?'Merci pour votre message.':'Thank you for your note.'}</h2><p className="mt-4 leading-7 text-earth/75">{fr?'Votre message est enregistré pour Mehdi. Il pourra vous répondre à l’adresse email indiquée.':'Your message has been saved for Mehdi. He can reply to the email address you provided.'}</p></div>:<form onSubmit={submit} onChange={()=>{key.current='';}}>
        <fieldset disabled={busy||!ready} className="grid min-w-0 gap-5">
          <legend className="sr-only">{fr?'Contacter Mehdi':'Contact Mehdi'}</legend>
          <label className="text-sm">{fr?'Votre nom':'Your name'}<input className={inputClass} name="name" autoComplete="name" maxLength={120} required/></label>
          <label className="text-sm">{fr?'Votre email':'Your email'}<input className={inputClass} name="email" type="email" autoComplete="email" maxLength={254} required/></label>
          <label className="text-sm">{fr?'Téléphone (facultatif)':'Phone (optional)'}<input className={inputClass} name="phone" type="tel" autoComplete="tel" maxLength={30}/></label>
          <label className="text-sm">{fr?'Votre message':'Your message'}<textarea className={inputClass} name="message" rows={5} minLength={10} maxLength={4000} required placeholder={fr?'Dites-nous ce que vous avez en tête…':'Tell us what you have in mind…'}/></label>
          <div hidden aria-hidden="true"><input name="website" autoComplete="off" tabIndex={-1}/></div>
          {error&&<p role="alert" className="text-sm text-red-800">{error}</p>}
          <button disabled={busy} className="inline-flex min-h-12 items-center justify-between gap-5 rounded-full bg-olive px-6 py-3 text-sm text-cream transition hover:bg-olive-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive disabled:opacity-60">{busy?(fr?'Envoi…':'Sending…'):(fr?'Envoyer à Mehdi':'Send to Mehdi')}<span aria-hidden="true">→</span></button>
          <p className="text-xs leading-6 text-earth/60">{fr?'Vos coordonnées servent uniquement à répondre à votre demande. Les champs nom, email et message sont obligatoires.':'Your contact details are used only to respond to your enquiry. Name, email and message are required.'}</p>
        </fieldset>
      </form>}
    </div>
  </section>;
}
