'use client';

import {useEffect, useRef, useState, type FormEvent} from 'react';
import {FAMILY_RELATIONS, MAX_FAMILY, relationEn, type PartyType, type Relation} from '@/lib/events/party';
import './pomegranate-day.css';

type Field = 'name' | 'phone' | 'from' | 'been';
type Values = Record<Field, string>;
// Eight digits are a Tunisian number; anything else needs its country code (+33…, 0033…).
const phoneOk = (v: string) => {
  const raw = v.replace(/[\s().\/-]/g, '');
  return /^[2-9][0-9]{7}$/.test(raw) || /^(\+|00)(216[2-9][0-9]{7}|(?!216)[1-9][0-9]{7,14})$/.test(raw);
};
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const rules: Record<Field, (v: Values) => string> = {
  name: (v) => (clean(v.name).length < 2 ? 'Please add your full name.' : ''),
  phone: (v) => (phoneOk(v.phone) ? '' : 'Please check your WhatsApp number. Add the country code if it is not Tunisian.'),
  from: (v) => (clean(v.from).length < 2 ? 'Please tell us where you are coming from.' : ''),
  been: (v) => (v.been ? '' : 'Please choose one.'),
};
const serverErrors: Record<string, string> = {
  event_closed: 'Requests for Pomegranate Day are closed.',
  whatsapp: 'Please check your WhatsApp number. Add the country code if it is not Tunisian.',
  rate_limit: 'Too many attempts from this connection. Please wait a little and try again.',
  invalid: 'Please check the form fields.',
  party: 'Please check the people coming with you.',
};

type Person = {name: string; relation: Relation | ''};
const PARTY_OPTIONS: [PartyType, string, string][] = [
  ['alone', 'Just me', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0'],
  ['family', 'With family', 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20a6 6 0 0 1 12 0M16.5 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM15.5 15.2A4.8 4.8 0 0 1 21 20'],
  ['friend', 'With a friend', 'M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a5.5 5.5 0 0 1 11 0M16 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM10.5 20a5.5 5.5 0 0 1 11 0'],
];
const NOTE_MAX = 600;

const Clock = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);

export default function PomegranateDay({
  open,
  full,
  calendar,
  maps,
  fontClass,
}: {
  fontClass: string;
  open: boolean;
  full: boolean;
  calendar: {google: string; outlook: string};
  maps: string;
}) {
  const [values, setValues] = useState<Values>({name: '', phone: '', from: '', been: ''});
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [summary, setSummary] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | {waitlist: boolean; already: boolean}>(null);
  const [floatShown, setFloatShown] = useState(false);
  const [partyType, setPartyType] = useState<PartyType>('alone');
  const [people, setPeople] = useState<Person[]>([]);
  const [peopleErrors, setPeopleErrors] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const peopleRefs = useRef<(HTMLInputElement | null)[]>([]);
  const key = useRef('');
  const refs = {
    name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    from: useRef<HTMLInputElement>(null),
    been: useRef<HTMLInputElement>(null),
  };
  const doneTitle = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const whenRef = useRef<HTMLElement>(null);

  // Phone: a floating button between the date and the form; it hides once the form comes into view, and after sending.
  useEffect(() => {
    const when = whenRef.current, card = cardRef.current;
    if (!when || !card || done) { setFloatShown(false); return; }
    let frame = 0;
    const update = () => {
      frame = 0;
      setFloatShown(when.getBoundingClientRect().bottom < 0 && card.getBoundingClientRect().top > window.innerHeight - 60);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [done]);

  useEffect(() => {
    if (done) doneTitle.current?.focus({preventScroll: true});
  }, [done]);

  function set(field: Field, value: string) {
    const next = {...values, [field]: value};
    setValues(next);
    setSummary('');
    if (errors[field]) setErrors((e) => ({...e, [field]: rules[field](next)}));
  }
  function check(field: Field) {
    if (clean(values[field])) setErrors((e) => ({...e, [field]: rules[field](values)}));
  }

  function personError(p: Person) {
    if (clean(p.name).length < 2) return partyType === 'friend' ? 'Please add your friend’s name.' : 'Please add their name.';
    if (partyType === 'family' && !p.relation) return 'Please choose how you are related.';
    return '';
  }
  function choosePartyType(type: PartyType) {
    setPartyType(type);
    setPeopleErrors([]);
    setPeople((current) => {
      if (type === 'alone') return [];
      if (type === 'friend') return [{name: current[0]?.name || '', relation: 'friend'}];
      return current.length && partyType === 'family' ? current : [{name: current[0]?.name || '', relation: ''}];
    });
  }
  function setPerson(i: number, patch: Partial<Person>) {
    setPeople((list) => list.map((p, j) => (j === i ? {...p, ...patch} : p)));
    setSummary('');
    if (peopleErrors[i]) setPeopleErrors((errs) => errs.map((e, j) => (j === i ? '' : e)));
  }
  function addPerson() {
    if (people.length >= MAX_FAMILY) return;
    setPeople((list) => [...list, {name: '', relation: ''}]);
    window.setTimeout(() => peopleRefs.current[people.length]?.focus(), 0);
  }
  function removePerson(i: number) {
    setPeople((list) => list.filter((_, j) => j !== i));
    setPeopleErrors((errs) => errs.filter((_, j) => j !== i));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    if (form.get('website')) return; // hidden field filled by a bot
    const found = (Object.keys(rules) as Field[]).map((f) => [f, rules[f](values)] as const).filter(([, m]) => m);
    setErrors(Object.fromEntries(found));
    const personErrs = people.map(personError);
    setPeopleErrors(personErrs);
    const total = found.length + personErrs.filter(Boolean).length;
    if (total) {
      setSummary(total === 1 ? 'One detail needs a look.' : `${total} details need a look.`);
      if (found.length) refs[found[0][0]].current?.focus();
      else peopleRefs.current[personErrs.findIndex(Boolean)]?.focus();
      return;
    }
    setSummary('');
    setBusy(true);
    key.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/events/pomegranate-day', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: clean(values.name),
          phone: clean(values.phone),
          from: clean(values.from),
          been: values.been,
          party: {type: partyType, people: people.map((p) => ({name: clean(p.name), relation: p.relation}))},
          note: note.trim(),
          requestKey: key.current,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(serverErrors[result.error] || 'We could not send your request just now. Please try again in a moment.');
      setDone({waitlist: Boolean(result.waitlist), already: Boolean(result.already)});
      cardRef.current?.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    } catch (e) {
      setSummary((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const firstName = clean(values.name).split(' ')[0];
  const fieldProps = (f: Exclude<Field, 'been'>) => ({
    id: f,
    name: f,
    ref: refs[f],
    value: values[f],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(f, e.target.value),
    onBlur: () => check(f),
    'aria-invalid': errors[f] ? (true as const) : undefined,
    'aria-describedby': `${f}-error`,
    required: true,
  });

  return (
    <div className={`pd ${fontClass}`}>
      <div className="wrap">
        <div className="left">
          <header className="intro">
            <div className="art-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="art" src="/assets/events/pomegranate-sketch.svg" width={300} height={172} alt="Hand-drawn watercolor sketch of a whole pomegranate and one cut open" />
              <span className="seed" style={{left: '22%', ['--d' as string]: '17s', ['--w' as string]: '0s', ['--x' as string]: '6px'}} aria-hidden="true" />
              <span className="seed" style={{left: '58%', ['--d' as string]: '21s', ['--w' as string]: '7s', ['--x' as string]: '-8px'}} aria-hidden="true" />
              <span className="seed" style={{left: '80%', ['--d' as string]: '19s', ['--w' as string]: '12s', ['--x' as string]: '5px'}} aria-hidden="true" />
            </div>
            <div className="hero-text">
              <p className="eyebrow">A day by Farm Elbaya</p>
              <h1>Pomegranate Day</h1>
              <p className="ar hello" lang="ar" dir="rtl">يوم الرمّان في فيرمة البية</p>
              <p className="lede">An afternoon for our community, on the land where this year&apos;s pomegranates grew.</p>
            </div>

            <section className="when" aria-label="When" ref={whenRef}>
              <p className="when-line"><span>Sunday, 1 November</span><span className="sep" aria-hidden="true">·</span><span className="clock">3 – 7 pm</span></p>
              <div className="tl" role="img" aria-label="3:00 pm: arrival, farm walk, harvest and tasting. 5:30 pm: sunset on the rooftop, until 7:00 pm.">
                <div className="tl-times" aria-hidden="true"><span className="t0">3:00 pm</span><span className="t1">5:30 pm</span><span className="t2">7:00 pm</span></div>
                <div className="tl-bar" aria-hidden="true"><i className="a" /><i className="b" /><b className="d0" /><b className="d1" /><b className="d2" /></div>
                <div className="tl-labels" aria-hidden="true"><span>Arrival, walk, harvest, tasting</span><span>Sunset, rooftop</span></div>
              </div>
              <p className="cal">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
                Add to calendar
                <a href={calendar.google} target="_blank" rel="noopener">Google</a>
                <span aria-hidden="true">·</span>
                <a href={calendar.outlook} target="_blank" rel="noopener">Outlook</a>
              </p>
            </section>
          </header>

          <section className="day" aria-labelledby="day-title">
            <p className="eyebrow" id="day-title">The day</p>
            <ol className="steps">
              <li className="step" style={{['--ic' as string]: '#565932', ['--bc' as string]: '#CBCDB8'}}>
                <span className="badge" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14Z" /><path d="M5 19 13 11" /></svg></span>
                <div>
                  <h3>Arrival and farm walk <span className="tchip"><Clock />3:00 pm</span></h3>
                  <p>We begin together with a walk through the farm.</p>
                </div>
              </li>
              <li className="step" style={{['--ic' as string]: '#9B2335', ['--bc' as string]: '#E3BDC0'}}>
                <span className="badge" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="13.5" r="6.5" /><path d="M9.5 7.6 10.5 5l1.5 1.5L13.5 5l1 2.6" /></svg></span>
                <div>
                  <h3>Harvest</h3>
                  <p>We walk among the trees and see how each one grew: four years of natural farming, without pesticides. Then you pick your own.</p>
                  <p className="offer"><i className="dia" aria-hidden="true" /><span>Special offer on the pomegranates you want to take home.</span></p>
                </div>
              </li>
              <li className="step" style={{['--ic' as string]: '#8A5A12', ['--bc' as string]: '#E6D3AE'}}>
                <span className="badge" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 11h16a8 8 0 0 1-16 0Z" /><path d="M9 21h6" /></svg></span>
                <div>
                  <h3>Tasting</h3>
                  <p>You are the first to taste our own products, local and made the traditional way. This is the birth of the Farm Elbaya brand.</p>
                  <div className="chips">
                    <span className="chip">Pomegranate jam</span>
                    <span className="chip ar" lang="ar" dir="rtl">مسفوف</span>
                    <span className="chip">Pomegranate molasses</span>
                    <span className="chip surprise"><span className="dots" aria-hidden="true"><i /><i /><i /></span>and surprises</span>
                  </div>
                </div>
              </li>
              <li className="step" style={{['--ic' as string]: '#7A2335', ['--bc' as string]: '#D9BEC4'}}>
                <span className="badge" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 18h16" /><path d="M7 18a5 5 0 0 1 10 0" /><path d="M12 5v3M5.6 9.6l1.8 1.8M18.4 9.6l-1.8 1.8" /></svg></span>
                <div>
                  <h3>Sunset on the rooftop <span className="tchip sun"><Clock />5:30 – 7:00 pm</span></h3>
                  <p>
                    As the light turns gold, we gather on the rooftop for the{' '}
                    <span className="ar" lang="ar" dir="rtl" style={{fontSize: '1.25em', color: 'var(--red)'}}>لمّة</span>: sharing stories, sharing what we tasted, and letting the day slow down together.
                  </p>
                </div>
              </li>
            </ol>
          </section>
        </div>

        <section className="card" id="card" aria-labelledby={done ? 'review-title' : 'form-title'} ref={cardRef}>
          {!done ? (
            <form onSubmit={submit} noValidate autoComplete="on">
              <div>
                <h2 id="form-title">Request your spot</h2>
                <p className="sub">Sunday 1 November · <span style={{whiteSpace: 'nowrap'}}>3 – 7 pm</span> · Testour</p>
              </div>
              {!open && <p className="closed" role="status">Requests are closed for now. Thank you for your interest.</p>}
              {open && full && <p className="closed" role="status">All places are taken. You can still send a request and we will keep you on our waiting list.</p>}

              <div className="pd-field">
                <label htmlFor="name">Full name</label>
                <input type="text" autoComplete="name" maxLength={80} enterKeyHint="next" disabled={!open} {...fieldProps('name')} />
                <p className="error" id="name-error">{errors.name}</p>
              </div>
              <div className="pd-field">
                <label htmlFor="phone">WhatsApp number</label>
                <input type="tel" autoComplete="tel" inputMode="tel" maxLength={30} placeholder="+216" enterKeyHint="next" disabled={!open} {...fieldProps('phone')} />
                <p className="error" id="phone-error">{errors.phone}</p>
              </div>
              <div className="pd-field">
                <label htmlFor="from">Coming from</label>
                <input type="text" autoComplete="address-level2" maxLength={80} placeholder="City or town" enterKeyHint="done" disabled={!open} {...fieldProps('from')} />
                <p className="error" id="from-error">{errors.from}</p>
              </div>
              <fieldset aria-describedby="been-error" disabled={!open}>
                <legend>Been to the farm before?</legend>
                <div className="pills">
                  {[['yes', 'Yes'], ['no', 'No, first time']].map(([value, label], i) => (
                    <label className="pill" htmlFor={`been-${value}`} key={value}>
                      <input
                        type="radio"
                        id={`been-${value}`}
                        name="been"
                        value={value}
                        ref={i === 0 ? refs.been : undefined}
                        checked={values.been === value}
                        onChange={() => { setValues((v) => ({...v, been: value})); setErrors((e) => ({...e, been: ''})); }}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <p className="error" id="been-error">{errors.been}</p>
              </fieldset>

              <fieldset className="party" disabled={!open}>
                <legend>Coming with anyone?</legend>
                <p className="hint">Bring the people you love. Everyone you bring is part of your request, and we confirm each place personally.</p>
                <div className="party-options">
                  {PARTY_OPTIONS.map(([value, label, icon]) => (
                    <label className="party-option" key={value}>
                      <input type="radio" name="party" value={value} checked={partyType === value} onChange={() => choosePartyType(value)} />
                      <span>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon} /></svg>
                        {label}
                        <small>{value === 'alone' ? 'only you' : value === 'family' ? `up to ${MAX_FAMILY}` : '+1'}</small>
                      </span>
                    </label>
                  ))}
                </div>

                {partyType !== 'alone' && (
                  <div className="companions">
                    {people.map((person, i) => (
                      <div className="companion" key={i}>
                        <span className="avatar" aria-hidden="true">{clean(person.name).charAt(0).toUpperCase() || i + 1}</span>
                        <div className="companion-body">
                          <input
                            type="text"
                            ref={(el) => { peopleRefs.current[i] = el; }}
                            value={person.name}
                            maxLength={80}
                            placeholder={partyType === 'friend' ? 'Your friend’s name' : 'Their name'}
                            aria-label={partyType === 'friend' ? 'Your friend’s name' : `Name of family member ${i + 1}`}
                            aria-invalid={peopleErrors[i] ? true : undefined}
                            onChange={(e) => setPerson(i, {name: e.target.value})}
                          />
                          {partyType === 'family' ? (
                            <div className="relations" role="radiogroup" aria-label={`How you are related to ${clean(person.name) || `family member ${i + 1}`}`}>
                              {FAMILY_RELATIONS.map((rel) => (
                                <label className="relation" key={rel}>
                                  <input type="radio" name={`relation-${i}`} value={rel} checked={person.relation === rel} onChange={() => setPerson(i, {relation: rel})} />
                                  <span>{relationEn[rel]}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <p className="relation-fixed">Friend · your +1</p>
                          )}
                          {peopleErrors[i] && <p className="error">{peopleErrors[i]}</p>}
                        </div>
                        {partyType === 'family' && people.length > 1 && (
                          <button type="button" className="remove" onClick={() => removePerson(i)} aria-label={`Remove ${clean(person.name) || `family member ${i + 1}`}`}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {partyType === 'family' && people.length < MAX_FAMILY && (
                      <button type="button" className="add-person" onClick={addPerson}>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                        Add someone
                        <small>{people.length} of {MAX_FAMILY}</small>
                      </button>
                    )}
                    <p className="party-total">
                      Your request: <strong>{1 + people.length} people</strong>
                      {partyType === 'family' && people.length === MAX_FAMILY ? ' · the most we can welcome per family' : ''}
                    </p>
                  </div>
                )}
              </fieldset>

              <div className="pd-field">
                <label htmlFor="note">A note for us <span className="optional">optional</span></label>
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  maxLength={NOTE_MAX}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="A special request, something you look forward to, anything you would like us to know…"
                  disabled={!open}
                />
                {note.length > NOTE_MAX - 100 && <small className="count">{note.length} / {NOTE_MAX}</small>}
              </div>
              <div className="hp" aria-hidden="true">
                <label htmlFor="website">Leave this empty</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <p className="live" role="alert">{summary}</p>
              <button className="btn" type="submit" disabled={busy || !open}>{busy ? 'Sending…' : 'Request my spot'}</button>
            </form>
          ) : (
            <div className="review">
              <span className="okmark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5 10 17l9-10" /></svg></span>
              <div>
                <h2 id="review-title" tabIndex={-1} ref={doneTitle}>Thank you{firstName ? `, ${firstName}` : ''}</h2>
                <p className="sub" style={{marginBottom: 0}}>
                  {done.already
                    ? 'We already have your request. We will be in touch on WhatsApp soon.'
                    : done.waitlist
                      ? 'Your request is in. All places are taken for now, so you are on our waiting list. If a spot opens, we will message you on WhatsApp.'
                      : `Your request${people.length ? ` for ${1 + people.length} people` : ''} is in. Places are limited, so we confirm each guest personally. We will be in touch on WhatsApp soon.`}
                </p>
              </div>
              {!done.already && (<dl className="summary">
                <dt>Name</dt><dd>{clean(values.name)}</dd>
                <dt>WhatsApp</dt><dd>{clean(values.phone)}</dd>
                <dt>From</dt><dd>{clean(values.from)}</dd>
                <dt>Been before</dt><dd>{values.been === 'yes' ? 'Yes' : 'No, first time'}</dd>
                <dt>Coming with</dt><dd>{people.length ? people.map((p) => `${clean(p.name)} (${p.relation ? relationEn[p.relation] : ''})`).join(', ') : 'Just me'}</dd>
                {note.trim() && (<><dt>Your note</dt><dd style={{whiteSpace: 'pre-wrap'}}>{note.trim()}</dd></>)}
              </dl>)}
            </div>
          )}

          <div className="links">
            <a href={maps} target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></svg>Find the farm on Maps</a>
            <a href="https://www.farmelbaya.com/" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></svg>farmelbaya.com</a>
          </div>
        </section>
      </div>

      <a className={`btn float${floatShown ? ' show' : ''}`} href="#card" aria-hidden={!floatShown} tabIndex={floatShown ? 0 : -1}>
        Request my spot
      </a>
    </div>
  );
}
