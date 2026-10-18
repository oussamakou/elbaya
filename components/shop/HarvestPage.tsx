"use client";

import Image from 'next/image';
import {useRef, useState, type FormEvent} from 'react';
import {Check, ChevronLeft, ChevronRight, Leaf, MapPin, Minus, Pause, Play, Plus, Volume2, VolumeX, X} from 'lucide-react';
import {Link} from '@/i18n/routing';
import {money, type Product} from '@/lib/shop/types';
import {FARM_MAP, harvestQuote, harvestOffer, pickupLabel} from '@/lib/shop/harvest';
import {errorMessage} from './copy';

const media = [
  {id:'harvest', fr:'La récolte, en vrai', en:'The real harvest', duration:'0:16'},
  {id:'mehdi-orchard', fr:'Mehdi vous raconte', en:'A word from Mehdi', duration:'1:02'},
  {id:'farm-story', fr:'Au milieu des arbres', en:'Among the trees', duration:'0:37'},
];

function HarvestBasket() {
  return <svg className="harvest-basket" width="42" height="42" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M12 25 20 9m16 16L28 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <g fill="#ac493e" stroke="#80392f" strokeWidth="1.3">
      <path d="M12 23c-4-8 9-12 11-3 2 8-9 12-11 3Z"/>
      <path d="m16 16-2-4 4 2 3-3-1 5"/>
      <path d="M24 21c-2-8 11-10 12-1 1 8-10 10-12 1Z"/>
      <path d="m27 15-1-4 4 2 3-3-1 5"/>
    </g>
    <path d="m7 25 5 16h24l5-16H7Z" fill="#d6ba84" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M6 25h36M12 32h24m-21-6 3 14m6-14v14m9-14-3 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>;
}

function FarmStories({fr}: {fr:boolean}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  function togglePlayback() {
    if (!video.current) return;
    if (video.current.paused) void video.current.play().catch(()=>setPlaying(false));
    else video.current.pause();
  }
  function open(index:number, button:HTMLButtonElement) {
    trigger.current = button;
    setActive(index);
    setProgress(0);
    setOpened(true);
    dialog.current?.showModal();
  }
  function stop() {video.current?.pause(); setOpened(false); trigger.current?.focus();}
  return <section className="harvest-stories" aria-label={fr ? 'Les vidéos de la ferme' : 'Stories from the farm'}>
    <div className="harvest-stories-label"><span>{fr ? 'De la ferme, sans filtre' : 'From the farm, unfiltered'}</span><span lang="ar-TN" dir="rtl">من أرضنا ليكم</span></div>
    <div className="harvest-story-list">{media.map((item,index)=><button type="button" key={item.id} className="harvest-story" onClick={e=>open(index,e.currentTarget)} aria-label={`${fr ? 'Lire' : 'Watch'} · ${fr ? item.fr : item.en}`}>
      <span className="harvest-story-circle"><Image src={`/assets/shop/${item.id}-poster.jpg`} width={100} height={100} alt=""/><span><Play size={16} fill="currentColor"/></span></span>
      <span>{fr ? item.fr : item.en}</span>
    </button>)}</div>
    <dialog ref={dialog} className="harvest-video-dialog" onClose={stop} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} aria-labelledby="harvest-video-title">
      {opened && <video ref={video} autoPlay key={media[active].id} playsInline muted={muted} preload="metadata" onClick={togglePlayback} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onTimeUpdate={e=>{const v=e.currentTarget;setProgress(v.duration ? v.currentTime/v.duration : 0);}} poster={`/assets/shop/${media[active].id}-poster.jpg`} src={`/assets/videos/${media[active].id}.mp4`} />}
      <div className="harvest-video-head">
        <div className="harvest-story-progress" aria-hidden="true">{media.map((item,index)=><progress key={item.id} max={1} value={index<active?1:index===active?progress:0}/>)}</div>
        <span>EL BAYA · {fr?'LA VIE À LA FERME':'LIFE ON THE FARM'}</span>
        <button type="button" autoFocus aria-label={fr ? 'Fermer la vidéo' : 'Close video'} onClick={()=>dialog.current?.close()}><X size={21}/></button>
      </div>
      <div className="harvest-video-foot">
        <h2 id="harvest-video-title">{fr ? media[active].fr : media[active].en}</h2>
        <p>{fr ? 'De notre terre, pour vous.' : 'From our land, to you.'}</p>
        <div className="harvest-video-controls">
          <button type="button" aria-label={playing?(fr?'Mettre en pause':'Pause video'):(fr?'Lire la vidéo':'Play video')} onClick={togglePlayback}>{playing?<Pause size={19}/>:<Play size={19}/>}</button>
          <button type="button" aria-label={muted?(fr?'Activer le son':'Unmute video'):(fr?'Couper le son':'Mute video')} onClick={()=>setMuted(!muted)}>{muted?<VolumeX size={19}/>:<Volume2 size={19}/>}</button>
          <button className="harvest-next-story" type="button" onClick={()=>{setProgress(0);setActive((active+1)%media.length);}}>{fr ? 'Suivante' : 'Next story'} <ChevronRight size={18}/></button>
        </div>
      </div>
    </dialog>
  </section>;
}

function PackSelection({selected,fr}: {selected:boolean;fr:boolean}) {
  return <small className={`harvest-pack-state${selected?' is-selected':''}`}>
    {selected?<Check size={14} aria-hidden="true"/>:<span className="harvest-pack-radio" aria-hidden="true"/>}
    {selected?(fr?'Sélectionné':'Selected'):(fr?'Choisir ce panier':'Choose this pack')}
  </small>;
}

function HarvestOrder({product,fr,kg,setKg}: {product:Product;fr:boolean;kg:number;setKg:(kg:number)=>void}) {
  const offer=harvestOffer(product);
  const [pickup,setPickup] = useState<'farm'|'tunis'>(offer.pickupFarm?'farm':'tunis');
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [reference,setReference] = useState('');
  const key = useRef('');
  const quote = harvestQuote(kg,offer);
  const format=(amount:number)=>money(amount,fr?'fr':'en');
  function savings(weight:number) {
    const amount=weight*offer.baseUnitPrice-harvestQuote(weight,offer).total;
    return amount>0?<small className="harvest-pack-saving">{fr?`Économisez ${format(amount)} · par rapport au tarif 5 kg`:`Save ${format(amount)} · compared with the 5 kg rate`}</small>:null;
  }
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); if(busy)return;
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);setError(''); key.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/shop/reservations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...fields,productId:product.id,variantId:product.variants[0].id,harvestKg:kg,pickup,expectedTotal:quote.total,requestKey:key.current})});
      const result = await response.json();
      if(!response.ok)throw Error(errorMessage(result.error,fr?'fr':'en'));
      setReference(result.id);
    } catch(e) {setError(e instanceof Error ? e.message : errorMessage('unavailable',fr?'fr':'en'));}
    finally {setBusy(false);}
  }
  if(reference)return <div className="harvest-confirmation" role="status"><Check size={30}/><p className="shop-eyebrow">{reference}</p><h2>{fr ? 'Votre part de récolte est demandée.' : 'Your harvest request is in.'}</h2><p>{kg} kg · {money(quote.total,fr?'fr':'en')}</p><p>{pickupLabel(pickup,fr)}</p><p>{fr ? 'Mehdi vous appelle pour confirmer la disponibilité et le rendez-vous. Vous payez au retrait.' : 'Mehdi will call to confirm availability and your pickup appointment. Pay when you collect.'}</p></div>;
  if(!offer.enabled || (!offer.pickupFarm&&!offer.pickupTunis))return <p id="harvest-order" className="shop-notice">{fr?'Les demandes sont en pause. Retrouvez bientôt les prochaines disponibilités.':'Requests are paused. Check back for the next availability.'}</p>;
  return <form id="harvest-order" className="harvest-order" onSubmit={submit} onChange={()=>{key.current='';}}>
    <fieldset disabled={busy}>
      <legend className="sr-only">{fr ? 'Votre demande de grenades' : 'Your pomegranate order request'}</legend>
      <div className="harvest-pack-heading"><h2>{fr ? 'Votre part de récolte' : 'Your share of the harvest'}</h2><span>{fr ? 'Dès 5 kg' : 'From 5 kg'}</span></div>
      <div className="harvest-packs" role="group" aria-label={fr ? 'Choisir un panier' : 'Choose a pack'}>
        <button type="button" aria-pressed={kg===5} onClick={()=>{setKg(5);key.current='';}}><span>5 kg</span><strong>{format(offer.baseUnitPrice*5)}</strong><small>{format(offer.baseUnitPrice)} / kg</small><PackSelection selected={kg===5} fr={fr}/></button>
        <button type="button" aria-pressed={kg>=10&&kg<20} onClick={()=>{setKg(kg>=10&&kg<20?kg:10);key.current='';}}><span className="harvest-pack-label">{fr ? 'Le panier classique' : 'Our signature pack'}</span><span>{kg>=10&&kg<20?kg:10} kg</span><strong>{format(offer.bulkUnitPrice*(kg>=10&&kg<20?kg:10))}</strong><small>{format(offer.bulkUnitPrice)} / kg</small>{savings(kg>=10&&kg<20?kg:10)}<PackSelection selected={kg>=10&&kg<20} fr={fr}/></button>
        <button type="button" className="harvest-value-pack" aria-pressed={kg>=20} onClick={()=>{setKg(Math.max(20,kg));key.current='';}}><span className="harvest-pack-label">{fr ? 'Recommandé · meilleur prix au kilo' : 'Recommended · best price per kg'}</span><span className="harvest-oula"><HarvestBasket/><b lang="ar-TN" dir="rtl">عولة</b><span>· {Math.max(20,kg)} kg</span></span><strong>{format(offer.largeUnitPrice*Math.max(20,kg))}</strong><small>{format(offer.largeUnitPrice)} / kg · {fr?'La réserve à partager en famille':'Stock up together, share with family'}</small>{savings(Math.max(20,kg))}<PackSelection selected={kg>=20} fr={fr}/></button>
      </div>
      <div className="harvest-quantity"><div><label htmlFor="harvest-kg">{fr ? 'Quantité totale' : 'Total quantity'}</label><small>{fr ? `Par pas de 5 kg · ${format(offer.largeUnitPrice)}/kg dès 20 kg` : `In 5 kg steps · ${format(offer.largeUnitPrice)}/kg from 20 kg`}</small></div><div className="harvest-stepper"><button type="button" disabled={kg<=5} aria-label={fr ? 'Retirer 5 kg' : 'Remove 5 kg'} onClick={()=>{setKg(kg-5);key.current='';}}><Minus size={17}/></button><output id="harvest-kg" aria-live="polite">{kg} kg</output><button type="button" disabled={kg>=500} aria-label={fr ? 'Ajouter 5 kg' : 'Add 5 kg'} onClick={()=>{setKg(kg+5);key.current='';}}><Plus size={17}/></button></div></div>
      <fieldset className="harvest-pickups"><legend>{fr ? 'Où récupérer votre panier ?' : 'Where will you collect?'}</legend>
        {(['farm','tunis'] as const).filter(p=>p==='farm'?offer.pickupFarm:offer.pickupTunis).map(place=><label key={place} className={pickup===place?'selected':''}><input type="radio" name="pickup" value={place} checked={pickup===place} onChange={()=>setPickup(place)}/><span><strong>{place==='farm' ? (fr?'À la ferme · Testour':'At the farm · Testour') : (fr?'À Tunis':'In Tunis')}</strong><small>{place==='farm' ? (fr?'Sur rendez-vous, à El Baya.':'By appointment, at El Baya.') : (fr?'Mehdi vous communique l’adresse par téléphone.':'Mehdi will call with the pickup address.')}</small></span><MapPin size={17}/></label>)}
        {pickup==='farm'&&<a href={FARM_MAP} target="_blank" rel="noreferrer">{fr ? 'Voir la ferme sur Maps ↗' : 'Find the farm on Maps ↗'}</a>}
      </fieldset>
      <div className="reservation-row"><label>{fr?'Prénom':'First name'}<input className="field" name="firstName" autoComplete="given-name" maxLength={80} required/></label><label>{fr?'Nom':'Last name'}<input className="field" name="lastName" autoComplete="family-name" maxLength={80} required/></label></div>
      <label>{fr?'Téléphone tunisien':'Tunisian phone number'}<input className="field" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+216" maxLength={30} required/></label>
      <label>{fr?'Email (facultatif)':'Email (optional)'}<input className="field" name="email" type="email" autoComplete="email" maxLength={254}/></label>
      <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off"/></div>
      <div className="harvest-total" aria-live="polite"><span>{fr?'Total à régler au retrait':'Total to pay at pickup'}</span><strong>{money(quote.total,fr?'fr':'en')}</strong></div>
      <p className="harvest-discount">{kg>=10 ? (fr?`Vous économisez ${money(kg*offer.baseUnitPrice-quote.total)} par rapport au tarif 5 kg.`:`You save ${money(kg*offer.baseUnitPrice-quote.total,'en')} compared with the 5 kg rate.`) : (fr?`Dès 10 kg : ${format(offer.bulkUnitPrice)}/kg.`:`From 10 kg: ${format(offer.bulkUnitPrice)}/kg.`)}</p>
      {error&&<p role="alert" className="shop-error">{error}</p>}
      <button type="submit" className="shop-button harvest-submit" disabled={busy}>{busy ? (fr?'Envoi…':'Sending…') : (fr?'Demander mon panier':'Request my harvest pack')} <span>→</span></button>
      <p className="harvest-form-note">{fr?'Sans paiement en ligne. Mehdi confirme la disponibilité et le retrait par téléphone. La demande ne bloque pas de stock. Vos coordonnées servent à traiter votre demande.':'No online payment. Mehdi confirms availability and pickup by phone. Requests do not hold stock. Your details are used to handle your request.'}</p>
    </fieldset>
  </form>;
}

export default function HarvestPage({product,locale,otherProducts=[]}: {product:Product;locale:'fr'|'en';otherProducts?:Product[]}) {
  const fr=locale==='fr';
  const uploaded=product.images.filter(src=>!src.endsWith('.svg'));
  const photos=(uploaded.length?uploaded:[product.images[0]||'/assets/shop/pomegranate.svg']).map(src=>({src,fr:'Les grenades d’El Baya',en:'El Baya pomegranates'}));
  const offer=harvestOffer(product);
  const format=(amount:number)=>money(amount,locale);
  const description=product.description[locale]||product.description.fr;
  const customDescription=description&&!description.includes('formats, les prix')&&!description.includes('Pack sizes, prices');
  const [photo,setPhoto]=useState(0);
  const [kg,setKg]=useState(10);
  const quote=harvestQuote(kg,offer);
  const currentPhoto=photos[photo]||photos[0];
  return <main className="harvest-page shop-wrap">
    <div className="harvest-topline"><Link href="/farm">{fr?'El Baya · une ferme à Testour':'El Baya · a farm in Testour'}</Link><span lang="ar-TN" dir="rtl">رمان بلادنا، من أرضنا ليكم</span></div>
    <section className="harvest-hero">
      <div className="harvest-visuals">
        <div className="harvest-photo"><Image key={currentPhoto.src} src={currentPhoto.src} alt={fr?currentPhoto.fr:currentPhoto.en} fill sizes="(min-width: 900px) 48vw, 100vw" preload className="object-cover" unoptimized={currentPhoto.src.startsWith('/api/')} /><span className="harvest-photo-caption">{fr?'Images de la ferme · récolte 2026':'From our farm · harvest 2026'}</span>{photos.length>1&&<div className="harvest-photo-nav"><button type="button" aria-label={fr?'Image précédente':'Previous image'} onClick={()=>setPhoto((photo+photos.length-1)%photos.length)}><ChevronLeft size={19}/></button><span>{photo+1} / {photos.length}</span><button type="button" aria-label={fr?'Image suivante':'Next image'} onClick={()=>setPhoto((photo+1)%photos.length)}><ChevronRight size={19}/></button></div>}</div>
        {offer.showStories!==false&&<FarmStories fr={fr}/>}
      </div>
      <div className="harvest-offer">
        <p className="shop-eyebrow">{fr?'LES GRENADES D’EL BAYA · SAISON 2026':'EL BAYA POMEGRANATES · SEASON 2026'}</p>
        <h1>{fr?'Les grenades d’El Baya.':'El Baya pomegranates.'}</h1>
        <p className="harvest-intro">{customDescription?description:fr?'Une terre familiale à Testour, des arbres soignés par Mehdi, et la récolte qu’on a envie de partager.':'Family land in Testour, trees cared for by Mehdi, and a harvest we want to share with you.'}</p>
        <p className="harvest-growing"><Leaf size={18}/>{fr?'Culture bio, sans pesticides.':'Organically grown without pesticides, as described by Mehdi.'}</p>
        <p className="harvest-limited">{fr?'Cette saison, une petite quantité de notre récolte est proposée à la communauté. Chaque demande est confirmée personnellement.':'This season, we’re sharing a limited part of our harvest with the community. Each request is confirmed personally.'}</p>
        <HarvestOrder product={product} fr={fr} kg={kg} setKg={setKg}/>
      </div>
    </section>
    <section className="harvest-story-section"><div><p className="shop-eyebrow">{fr?'UNE FERME QUI SE RACONTE':'A FARM WITH A STORY'}</p><h2>{fr?'On cultive.\nOn accueille.\nOn partage.':'We grow.\nWe welcome.\nWe share.'}</h2><p lang="ar-TN" dir="rtl" className="harvest-arabic">من أرضنا، بكل محبّة</p></div><div><p>{fr?'El Baya, c’est la terre de la famille de Mehdi. Les oliviers, les grenadiers, le potager et les ruches font partie du quotidien. La permaculture guide le travail : prendre soin du sol, laisser de la place au vivant et suivre les saisons.':'El Baya is Mehdi’s family land. Olive trees, pomegranates, the vegetable garden and beehives are part of everyday life. Permaculture guides the work: caring for the soil, making room for living things and following the seasons.'}</p><p>{fr?'Cette année, on ouvre une petite part de la récolte à celles et ceux qui veulent retrouver ce lien avec la terre. Vous voyez les arbres, vous entendez Mehdi, vous savez à qui parler.':'This year, we’re opening a small part of the harvest to people who want that connection with the land. See the trees, hear from Mehdi and know who to speak to.'}</p><Link href="/farm" className="pantry-text-link">{fr?'Découvrir la vie à El Baya':'Meet the farm'} →</Link></div></section>
    <section className="harvest-details" aria-label={fr?'Les détails de votre panier':'Your harvest pack, explained'}>
      {[{title:fr?'Comment fonctionne le prix ?':'How does the price work?',text:fr?`5 kg : ${format(offer.baseUnitPrice*5)} (${format(offer.baseUnitPrice)}/kg). Dès 10 kg, tout le panier passe à ${format(offer.bulkUnitPrice)}/kg : ${format(offer.bulkUnitPrice*10)} pour 10 kg, ${format(offer.bulkUnitPrice*15)} pour 15 kg. Dès 20 kg, le panier passe à ${format(offer.largeUnitPrice)}/kg : ${format(offer.largeUnitPrice*20)} pour 20 kg. Ajoutez 5 kg à la fois.`:`5 kg costs ${format(offer.baseUnitPrice*5)} (${format(offer.baseUnitPrice)}/kg). From 10 kg, the whole pack is ${format(offer.bulkUnitPrice)}/kg: ${format(offer.bulkUnitPrice*10)} for 10 kg, ${format(offer.bulkUnitPrice*15)} for 15 kg. From 20 kg, the whole pack is ${format(offer.largeUnitPrice)}/kg: ${format(offer.largeUnitPrice*20)} for 20 kg. Add in 5 kg steps.`},{title:fr?'Où et quand récupérer les grenades ?':'Where and when can I collect?',text:fr?`Retrait ${[offer.pickupFarm?'à la ferme de Testour':'',offer.pickupTunis?'à Tunis':''].filter(Boolean).join(' ou ')}. Mehdi vous appelle pour confirmer la disponibilité et le rendez-vous.${offer.pickupTunis?' L’adresse de Tunis vous sera communiquée directement.':''}`:`Pickup ${[offer.pickupFarm?'at the farm in Testour':'',offer.pickupTunis?'in Tunis':''].filter(Boolean).join(' or ')}. Mehdi calls to confirm availability and your appointment.${offer.pickupTunis?' The Tunis address is shared directly.':''}`},{title:fr?'Comment payer ?':'How do I pay?',text:fr?'Vous payez en espèces au retrait. Aucun acompte ni paiement en ligne. Votre demande sera confirmée par téléphone.':'Pay cash when you collect. No deposit or online payment. Your request is confirmed by phone.'}].map((item,index)=><details key={item.title} open={index===0}><summary>{item.title}<Plus size={18}/></summary><p>{item.text}</p></details>)}
    </section>
    {otherProducts.length>0&&<section className="harvest-other"><p className="shop-eyebrow">{fr?'AUSSI À LA FERME':'ALSO AT THE FARM'}</p><h2>{fr?'À chaque récolte, sa saison.':'Every harvest has its season.'}</h2><div>{otherProducts.map(p=><Link key={p.id} href={`/products/${p.id}`}><span>{fr?p.name.fr:p.name.en||p.name.fr}</span><span>{fr?'Découvrir':'Explore'} →</span></Link>)}</div></section>}
    {offer.enabled&&<div className="harvest-mobile-cta"><span>{fr?`Votre panier · ${kg} kg`:`Your pack · ${kg} kg`} <strong>{format(quote.total)}</strong></span><a href="#harvest-order">{fr?'Choisir mon panier':'Choose my pack'} ↑</a></div>}
  </main>;
}
