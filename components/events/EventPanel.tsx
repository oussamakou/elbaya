"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, Download, Mail, Printer, Search, Trash2, UserCheck } from "lucide-react";
import type { EventSettings, Guest, GuestStatus } from "@/lib/events/pomegranate";
import "./event-admin.css";

// Owner tab for Pomegranate Day: every request, a decision per guest, emails, and check-in on the day.
export type EventData = { settings: EventSettings; guests: Guest[]; emailReady: boolean };
type Action = "event_settings" | "event_guest" | "event_bulk" | "event_remove" | "event_email";
type Run = (action: Action, data: unknown) => Promise<unknown>;

const statusNames: Record<GuestStatus, string> = {
  new: "À traiter",
  confirmed: "Confirmé",
  waitlist: "Liste d’attente",
  declined: "Refusé",
};
const emailNames: Record<Exclude<GuestStatus, "new">, string> = {
  confirmed: "l’email de confirmation",
  waitlist: "l’email de liste d’attente",
  declined: "l’email de refus",
};
const filters = {
  all: { label: "Toutes", test: () => true },
  new: { label: "À traiter", test: (g: Guest) => g.status === "new" },
  confirmed: { label: "Confirmés", test: (g: Guest) => g.status === "confirmed" },
  waitlist: { label: "Liste d’attente", test: (g: Guest) => g.status === "waitlist" },
  declined: { label: "Refusés", test: (g: Guest) => g.status === "declined" },
  first: { label: "Première visite", test: (g: Guest) => g.been === "no" },
  unmailed: { label: "Sans email envoyé", test: (g: Guest) => g.status !== "new" && !g.emailed?.[g.status] },
};
type Filter = keyof typeof filters;
const received = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Tunis" });
const fmt = (iso?: string) => (iso ? received.format(new Date(iso)) : "");
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function csv(guests: Guest[]) {
  const head = ["Réf.", "Reçue", "Nom", "Email", "Téléphone", "Vient de", "Déjà venu", "Statut", "Email envoyé", "Présent", "Note"];
  const rows = guests.map((g) => [
    g.id, fmt(g.createdAt), g.name, g.email, g.phone || "", g.from, g.been === "yes" ? "Oui" : "Non",
    statusNames[g.status], g.status !== "new" && g.emailed?.[g.status] ? fmt(g.emailed[g.status]) : "",
    g.checkedInAt ? fmt(g.checkedInAt) : "", g.ownerNote || "",
  ]);
  const cell = (v: string) => (/[",;\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return "﻿" + [head, ...rows].map((r) => r.map(cell).join(";")).join("\r\n");
}
function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Settings({ settings, confirmed, run }: { settings: EventSettings; confirmed: number; run: Run }) {
  const [open, setOpen] = useState(settings.open),
    [capacity, setCapacity] = useState(String(settings.capacity)),
    [busy, setBusy] = useState(false),
    [msg, setMsg] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    setOpen(settings.open);
    setCapacity(String(settings.capacity));
  }, [settings.revision, settings.open, settings.capacity]);
  const cap = Number(capacity);
  const dirty = open !== settings.open || cap !== settings.capacity;
  async function save() {
    setBusy(true);
    setError("");
    setMsg("");
    try {
      await run("event_settings", { open, capacity: cap, revision: settings.revision });
      setMsg("Réglages enregistrés.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="event-settings">
      <button type="button" role="switch" aria-checked={open} className="event-switch" disabled={busy} onClick={() => setOpen((v) => !v)}>
        <span className="event-switch-track" aria-hidden="true" />
        <span className="event-switch-text">
          <strong>{open ? "Demandes ouvertes" : "Demandes fermées"}</strong>
          <small>{open ? "Le formulaire accepte de nouvelles demandes." : "Le formulaire affiche « fermé »."}</small>
        </span>
      </button>
      <label className="event-capacity">
        Places
        <input className="field" type="number" min={1} max={3000} inputMode="numeric" value={capacity} disabled={busy} onChange={(e) => setCapacity(e.target.value)} />
        <small>{confirmed} confirmé{confirmed > 1 ? "s" : ""}. Au-delà, les nouvelles demandes passent en liste d’attente.</small>
      </label>
      <div className="event-settings-actions">
        <button type="button" className="shop-button" disabled={busy || !dirty || !Number.isInteger(cap) || cap < 1} onClick={save}>
          Enregistrer
        </button>
        {msg && !dirty && <span className="inbox-saved" role="status"><Check size={15} />{msg}</span>}
        {error && <p role="alert" className="shop-error">{error}</p>}
      </div>
    </div>
  );
}

function GuestCard({
  guest, selected, onSelect, run, emailReady, dayMode,
}: {
  guest: Guest; selected: boolean; onSelect: (v: boolean) => void; run: Run; emailReady: boolean; dayMode: boolean;
}) {
  const [note, setNote] = useState(guest.ownerNote || ""),
    [busy, setBusy] = useState(false),
    [saved, setSaved] = useState(""),
    [error, setError] = useState("");
  useEffect(() => setNote(guest.ownerNote || ""), [guest.revision, guest.ownerNote]);
  useEffect(() => {
    if (!saved) return;
    const t = window.setTimeout(() => setSaved(""), 3000);
    return () => window.clearTimeout(t);
  }, [saved]);
  async function act(action: Action, data: unknown, done = "Enregistré") {
    setBusy(true);
    setError("");
    try {
      await run(action, data);
      setSaved(done);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const update = (patch: Record<string, unknown>, done?: string) => act("event_guest", { id: guest.id, revision: guest.revision, ...patch }, done);
  const mailKind = guest.status === "new" ? null : guest.status;
  const mailedAt = mailKind ? guest.emailed?.[mailKind] : undefined;
  return (
    <article className="inbox-card event-card" data-status={guest.status} data-selected={selected || undefined}>
      <div className="inbox-card-main">
        <p className="inbox-card-meta">
          <label className="event-select">
            <input type="checkbox" checked={selected} onChange={(e) => onSelect(e.target.checked)} aria-label={`Sélectionner ${guest.name}`} />
          </label>
          <span className="inbox-status">{statusNames[guest.status]}</span>
          <span>{guest.id} · reçue le {fmt(guest.createdAt)}</span>
          {guest.arrivedWhenFull && <span className="event-tag">arrivée après complet</span>}
        </p>
        <h3>{guest.name}</h3>
        <p className="inbox-order">
          <span className="inbox-place">{guest.from}</span>
          <span className={`event-tag${guest.been === "no" ? " first" : ""}`}>{guest.been === "yes" ? "Déjà venu à la ferme" : "Première visite"}</span>
          {guest.checkedInAt && <span className="event-tag here"><UserCheck size={13} />Présent · {fmt(guest.checkedInAt)}</span>}
        </p>
        <div className="inbox-contact">
          <a className="pantry-text-link" href={`mailto:${guest.email}?subject=${encodeURIComponent("Pomegranate Day · Farm Elbaya")}`}>
            <Mail size={15} /> {guest.email}
          </a>
          {guest.phone && <a className="pantry-text-link" href={`https://wa.me/${guest.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">WhatsApp {guest.phone}</a>}
        </div>
      </div>
      <div className="inbox-card-side">
        {dayMode ? (
          <button type="button" className={`shop-button${guest.checkedInAt ? " secondary" : ""} event-checkin`} disabled={busy} onClick={() => update({ checkedIn: !guest.checkedInAt }, guest.checkedInAt ? "Arrivée annulée" : "Arrivée notée")}>
            <UserCheck size={17} />
            {guest.checkedInAt ? "Annuler l’arrivée" : "Marquer présent"}
          </button>
        ) : (
          <div className="inbox-steps event-steps" role="group" aria-label="Décision">
            {(Object.keys(statusNames) as GuestStatus[]).map((s) => (
              <button key={s} type="button" aria-pressed={guest.status === s} disabled={busy} onClick={() => guest.status !== s && update({ status: s })}>
                {guest.status === s && <Check size={13} />}
                {s === "new" ? "À traiter" : s === "confirmed" ? "Confirmer" : s === "waitlist" ? "Attente" : "Refuser"}
              </button>
            ))}
          </div>
        )}
        {mailKind && !dayMode && (
          <div className="event-mail">
            <button
              type="button"
              className="shop-button secondary"
              disabled={busy || !emailReady}
              onClick={() => {
                if (mailedAt && !window.confirm(`${emailNames[mailKind]} a déjà été envoyé le ${fmt(mailedAt)}. L’envoyer de nouveau ?`)) return;
                void act("event_email", { ids: [guest.id], again: Boolean(mailedAt) }, "Email envoyé");
              }}
            >
              <Mail size={16} />
              {mailedAt ? "Renvoyer" : "Envoyer"} {emailNames[mailKind]}
            </button>
            <small>{mailedAt ? `Envoyé le ${fmt(mailedAt)}` : emailReady ? "Pas encore envoyé" : "Envoi d’emails non activé : écrivez depuis votre messagerie."}</small>
          </div>
        )}
        <label>
          Note privée
          <textarea className="field" rows={2} maxLength={1000} value={note} disabled={busy} placeholder="Ex. vient avec sa sœur" onChange={(e) => setNote(e.target.value)} />
        </label>
        <div className="inbox-card-actions">
          {note !== (guest.ownerNote || "") && (
            <button type="button" className="shop-button secondary" disabled={busy} onClick={() => update({ ownerNote: note })}>
              Enregistrer la note
            </button>
          )}
          {saved && !busy && <span className="inbox-saved" role="status"><Check size={15} />{saved}</span>}
          <button
            type="button"
            className="inbox-cancel"
            disabled={busy}
            onClick={() => {
              if (window.confirm(`Supprimer définitivement la demande de ${guest.name} ?\n\nÀ faire seulement à sa demande ou pour un doublon.`))
                void act("event_remove", { id: guest.id }, "Supprimée");
            }}
          >
            <Trash2 size={14} /> Supprimer
          </button>
        </div>
        {error && <p role="alert" className="shop-error">{error}</p>}
      </div>
    </article>
  );
}

export default function EventPanel({ data, run }: { data: EventData; run: Run }) {
  const { guests, settings, emailReady } = data;
  const [filter, setFilter] = useState<Filter>(() => (guests.some(filters.new.test) ? "new" : "all")),
    [query, setQuery] = useState(""),
    [dayMode, setDayMode] = useState(false),
    [selected, setSelected] = useState<Set<string>>(new Set()),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  const count = (s: GuestStatus) => guests.filter((g) => g.status === s).length;
  const confirmed = count("confirmed");
  // The list is fixed when a view is chosen (or a request arrives), so a card that changes
  // status stays in place with its feedback instead of vanishing mid-task.
  const viewIds = useMemo(() => {
    const q = norm(query.trim());
    return guests
      .filter(dayMode ? filters.confirmed.test : filters[filter].test)
      .filter((g) => !q || norm(`${g.name} ${g.email} ${g.from} ${g.ownerNote || ""} ${g.id} ${g.phone || ""}`).includes(q))
      .sort((a, b) => (dayMode ? a.name.localeCompare(b.name, "fr") : 0))
      .map((g) => g.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, query, dayMode, guests.length]);
  const byId = new Map(guests.map((g) => [g.id, g]));
  const visible = viewIds.map((id) => byId.get(id)).filter((g): g is Guest => Boolean(g));
  // Drop selections that are no longer on the list (deleted guests).
  useEffect(() => {
    setSelected((s) => new Set([...s].filter((id) => guests.some((g) => g.id === id))));
  }, [guests]);
  const chosen = guests.filter((g) => selected.has(g.id));
  const allVisibleSelected = visible.length > 0 && visible.every((g) => selected.has(g.id));

  async function bulk(action: Action, payload: unknown, done: (r: unknown) => string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await run(action, payload);
      setNotice(done(r));
      setSelected(new Set());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function bulkStatus(status: GuestStatus) {
    if (!chosen.length) return;
    if (!window.confirm(`Passer ${chosen.length} demande${chosen.length > 1 ? "s" : ""} en « ${statusNames[status]} » ?`)) return;
    void bulk("event_bulk", { ids: chosen.map((g) => g.id), status }, () => `${chosen.length} demande${chosen.length > 1 ? "s" : ""} mise${chosen.length > 1 ? "s" : ""} à jour.`);
  }
  function bulkEmail() {
    const ready = chosen.filter((g) => g.status !== "new");
    const fresh = ready.filter((g) => g.status !== "new" && !g.emailed?.[g.status]);
    if (!ready.length) return setError("Choisissez d’abord une décision (confirmé, attente ou refusé) pour ces demandes.");
    if (!window.confirm(`Envoyer à chaque invité l’email qui correspond à sa décision ?\n\n${fresh.length} à envoyer${ready.length - fresh.length ? ` · ${ready.length - fresh.length} déjà envoyé(s), ignoré(s)` : ""}.`)) return;
    void bulk("event_email", { ids: ready.map((g) => g.id) }, (r) => `${(r as { queued: number }).queued} email(s) en cours d’envoi.`);
  }
  const here = guests.filter((g) => g.checkedInAt).length;

  return (
    <section className="inbox event-inbox">
      <div className="admin-heading">
        <div>
          <h2>Pomegranate Day</h2>
          <p>Dimanche 1er novembre, 15 h – 19 h. Chaque demande attend votre réponse : confirmez, mettez en attente ou refusez, puis envoyez l’email correspondant.</p>
        </div>
        <div className="event-heading-actions">
          <a className="shop-button secondary" href="/en/pomegranate-day" target="_blank" rel="noreferrer">
            Voir la page <ArrowUpRight size={16} />
          </a>
          <button type="button" className="shop-button secondary" disabled={!visible.length} onClick={() => download(`pomegranate-day-${filter}.csv`, csv(visible))}>
            <Download size={16} /> Exporter (CSV)
          </button>
          <button type="button" className="shop-button secondary" disabled={!visible.length} onClick={() => window.print()}>
            <Printer size={16} /> Imprimer
          </button>
        </div>
      </div>

      <dl className="inbox-summary">
        <div data-tone={count("new") ? "alert" : undefined}>
          <dt>À traiter</dt>
          <dd>{count("new")}</dd>
          <small>sur {guests.length} demande{guests.length > 1 ? "s" : ""}</small>
        </div>
        <div>
          <dt>Confirmés</dt>
          <dd>{confirmed}<span className="event-of"> / {settings.capacity}</span></dd>
          <small>{Math.max(0, settings.capacity - confirmed)} place{settings.capacity - confirmed > 1 ? "s" : ""} libre{settings.capacity - confirmed > 1 ? "s" : ""}</small>
        </div>
        <div>
          <dt>Attente · Refusés</dt>
          <dd className="inbox-summary-split"><span>{count("waitlist")} <em>en attente</em></span><span>{count("declined")} <em>refusé{count("declined") > 1 ? "s" : ""}</em></span></dd>
          <small>{guests.filter((g) => g.been === "no").length} première(s) visite(s)</small>
        </div>
        <div>
          <dt>Le jour J</dt>
          <dd>{here}<span className="event-of"> / {confirmed}</span></dd>
          <small>présents parmi les confirmés</small>
        </div>
      </dl>

      <Settings settings={settings} confirmed={confirmed} run={run} />
      {!emailReady && (
        <p className="shop-notice">L’envoi d’emails aux invités n’est pas activé (service Resend). Les demandes sont bien enregistrées : répondez depuis votre messagerie en cliquant sur l’adresse de chaque invité.</p>
      )}

      <div className="event-toolbar">
        <label className="event-search">
          <Search size={16} aria-hidden="true" />
          <input className="field" type="search" placeholder="Rechercher un nom, un email, une ville…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Rechercher" />
        </label>
        <button type="button" className={`shop-button${dayMode ? "" : " secondary"}`} aria-pressed={dayMode} onClick={() => setDayMode((v) => !v)}>
          <UserCheck size={16} /> {dayMode ? "Quitter le mode accueil" : "Mode accueil (le jour J)"}
        </button>
      </div>
      {!dayMode && (
        <div className="inbox-toolbar">
          <div className="pantry-filters" role="group" aria-label="Filtrer">
            {(Object.keys(filters) as Filter[]).map((key) => (
              <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>
                {filters[key].label}
                <span className="inbox-count">{guests.filter(filters[key].test).length}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {dayMode && <p className="pantry-small">Mode accueil : les invités confirmés par ordre alphabétique. Touchez « Marquer présent » à leur arrivée.</p>}

      {!dayMode && visible.length > 0 && (
        <div className="event-bulk" data-active={chosen.length > 0 || undefined}>
          <label>
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={(e) => setSelected((s) => {
                const next = new Set(s);
                visible.forEach((g) => (e.target.checked ? next.add(g.id) : next.delete(g.id)));
                return next;
              })}
            />
            {chosen.length ? `${chosen.length} sélectionné${chosen.length > 1 ? "s" : ""}` : "Tout sélectionner"}
          </label>
          {chosen.length > 0 && (
            <div className="event-bulk-actions">
              <button type="button" className="shop-button" disabled={busy} onClick={() => bulkStatus("confirmed")}>Confirmer</button>
              <button type="button" className="shop-button secondary" disabled={busy} onClick={() => bulkStatus("waitlist")}>Liste d’attente</button>
              <button type="button" className="shop-button secondary" disabled={busy} onClick={() => bulkStatus("declined")}>Refuser</button>
              <button type="button" className="shop-button secondary" disabled={busy || !emailReady} onClick={bulkEmail}><Mail size={15} /> Envoyer les emails</button>
              <button type="button" className="pantry-text-link" onClick={() => setSelected(new Set())}>Effacer</button>
            </div>
          )}
        </div>
      )}
      {notice && <p className="admin-feedback" role="status"><Check size={17} />{notice}</p>}
      {error && <p role="alert" className="shop-error">{error}</p>}

      <div className="inbox-list">
        {visible.map((g) => (
          <GuestCard
            key={g.id}
            guest={g}
            selected={selected.has(g.id)}
            onSelect={(v) => setSelected((s) => { const n = new Set(s); if (v) n.add(g.id); else n.delete(g.id); return n; })}
            run={run}
            emailReady={emailReady}
            dayMode={dayMode}
          />
        ))}
        {!visible.length && (
          <p className="shop-notice">{guests.length ? "Aucune demande dans cette vue." : "Aucune demande pour le moment. Partagez le lien farmelbaya.com/en/pomegranate-day dans la communauté WhatsApp."}</p>
        )}
      </div>

      <div className="inbox-print event-print">
        <h2>Pomegranate Day · {dayMode ? "Liste d’accueil" : filters[filter].label} · {visible.length}</h2>
        <table>
          <thead><tr><th>Nom</th><th>Email</th><th>Vient de</th><th>Déjà venu</th><th>Statut</th><th>Note</th><th>Présent</th></tr></thead>
          <tbody>
            {visible.map((g) => (
              <tr key={g.id}><td>{g.name}</td><td>{g.email}</td><td>{g.from}</td><td>{g.been === "yes" ? "Oui" : "Non"}</td><td>{statusNames[g.status]}</td><td>{g.ownerNote || ""}</td><td><span className="inbox-print-tick" /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
