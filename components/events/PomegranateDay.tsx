'use client';

import {useEffect, useRef, useState, type FormEvent} from 'react';
import './pomegranate-day.css';

type Field = 'name' | 'email' | 'from' | 'been';
type Values = Record<Field, string>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const rules: Record<Field, (v: Values) => string> = {
  name: (v) => (clean(v.name).length < 2 ? 'Please add your full name.' : ''),
  email: (v) => (EMAIL.test(clean(v.email)) ? '' : 'Please check your email address.'),
  from: (v) => (clean(v.from).length < 2 ? 'Please tell us where you are coming from.' : ''),
  been: (v) => (v.been ? '' : 'Please choose one.'),
};
const serverErrors: Record<string, string> = {
  event_closed: 'Requests for Pomegranate Day are closed.',
  email: 'Please check your email address.',
  rate_limit: 'Too many attempts from this connection. Please wait a little and try again.',
  invalid: 'Please check the form fields.',
};

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
  const [values, setValues] = useState<Values>({name: '', email: '', from: '', been: ''});
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [summary, setSummary] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | {waitlist: boolean; already: boolean}>(null);
  const [floatShown, setFloatShown] = useState(false);
  const key = useRef('');
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    from: useRef<HTMLInputElement>(null),
    been: useRef<HTMLInputElement>(null),
  };
  const doneTitle = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const whenRef = useRef<HTMLElement>(null);

  // Phone: a floating button once the top is scrolled away, hidden while the form is on screen.
  useEffect(() => {
    if (!('IntersectionObserver' in window) || !whenRef.current || !cardRef.current) return;
    let topOut = false, cardIn = false;
    const update = () => setFloatShown(topOut && !cardIn);
    const a = new IntersectionObserver(([e]) => { topOut = !e.isIntersecting; update(); });
    const b = new IntersectionObserver(([e]) => { cardIn = e.isIntersecting; update(); }, {threshold: 0.1});
    a.observe(whenRef.current);
    b.observe(cardRef.current);
    return () => { a.disconnect(); b.disconnect(); };
  }, []);

  useEffect(() => {
    if (done) doneTitle.current?.focus({preventScroll: true});
  }, [done]);

  function set(field: Field, value: string) {
    const next = {...values, [field]: value};
    setValues(next);
    if (errors[field]) setErrors((e) => ({...e, [field]: rules[field](next)}));
  }
  function check(field: Field) {
    if (clean(values[field])) setErrors((e) => ({...e, [field]: rules[field](values)}));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    if (form.get('website')) return; // hidden field filled by a bot
    const found = (Object.keys(rules) as Field[]).map((f) => [f, rules[f](values)] as const).filter(([, m]) => m);
    setErrors(Object.fromEntries(found));
    if (found.length) {
      setSummary(found.length === 1 ? 'One detail needs a look.' : `${found.length} details need a look.`);
      refs[found[0][0]].current?.focus();
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
          email: clean(values.email),
          from: clean(values.from),
          been: values.been,
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
                <label htmlFor="email">Email</label>
                <input type="email" autoComplete="email" inputMode="email" maxLength={254} enterKeyHint="next" disabled={!open} {...fieldProps('email')} />
                <p className="error" id="email-error">{errors.email}</p>
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
                    ? 'We already have your request. We will be in touch soon.'
                    : done.waitlist
                      ? 'Your request is in. All places are taken for now, so you are on our waiting list. If a spot opens, we will write to you.'
                      : 'Your request is in. Places are limited, so we confirm each guest personally. We will be in touch soon.'}
                </p>
              </div>
              {!done.already && (<dl className="summary">
                <dt>Name</dt><dd>{clean(values.name)}</dd>
                <dt>Email</dt><dd>{clean(values.email)}</dd>
                <dt>From</dt><dd>{clean(values.from)}</dd>
                <dt>Been before</dt><dd>{values.been === 'yes' ? 'Yes' : 'No, first time'}</dd>
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
