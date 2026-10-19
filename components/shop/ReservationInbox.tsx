"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, MapPin, MessageCircle, Phone, Printer } from "lucide-react";
import type { ReservationRequest } from "@/lib/shop/types";
import { money } from "@/lib/shop/types";
import { selectionLabel } from "@/lib/shop/harvest";
import { displayPhone, internationalDigits, whatsappHref } from "./phone";

type Status = ReservationRequest["status"];
type Place = "farm" | "tunis";
const statuses: Record<Status, string> = {
  new: "Nouvelle",
  contacted: "Contacté",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};
const steps: Status[] = ["new", "contacted", "confirmed"];
const places: Record<Place, string> = { farm: "Ferme · Testour", tunis: "Tunis" };
const filters = {
  open: { label: "À traiter", test: (r: ReservationRequest) => r.status === "new" || r.status === "contacted" },
  confirmed: { label: "Confirmées", test: (r: ReservationRequest) => r.status === "confirmed" },
  cancelled: { label: "Annulées", test: (r: ReservationRequest) => r.status === "cancelled" },
  all: { label: "Toutes", test: () => true },
};
type Filter = keyof typeof filters;

// Fixed time zone so the server render and the browser agree on the displayed time.
const received = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Tunis" });
const pickupDay = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const formatPickup = (date?: string) => (date ? pickupDay.format(new Date(`${date}T00:00:00Z`)) : "");

function orderLine(r: ReservationRequest) {
  return r.harvest ? `${r.productName} · ${selectionLabel(r.harvest)}` : `${r.quantity} × ${r.productName} (${r.size})`;
}
function whatsappLink(r: ReservationRequest) {
  return whatsappHref(r.phone, `Bonjour ${r.firstName}, c’est Mehdi de Farm El Baya, au sujet de votre demande (${orderLine(r)}, réf. ${r.id}).`);
}
const placeOf = (r: ReservationRequest): Place | null => r.harvest?.pickup ?? null;

function Summary({ requests }: { requests: ReservationRequest[] }) {
  const active = requests.filter((r) => r.status !== "cancelled");
  const kg = (list: ReservationRequest[]) => list.reduce((sum, r) => sum + (r.harvest?.kg || 0), 0);
  const cash = (list: ReservationRequest[]) => list.reduce((sum, r) => sum + (r.harvest?.total || 0), 0);
  const confirmed = active.filter((r) => r.status === "confirmed");
  const toCall = active.filter((r) => r.status === "new").length;
  return (
    <dl className="inbox-summary">
      <div data-tone={toCall ? "alert" : undefined}>
        <dt>À rappeler</dt>
        <dd>{toCall}</dd>
        <small>{toCall === 1 ? "nouvelle demande" : "nouvelles demandes"}</small>
      </div>
      <div>
        <dt>Demandes en cours</dt>
        <dd>{active.length}</dd>
        <small>{kg(active) ? `dont ${kg(active)} kg de grenades (${kg(confirmed)} kg confirmés)` : `${confirmed.length} confirmée${confirmed.length > 1 ? "s" : ""}`}</small>
      </div>
      <div>
        <dt>Par lieu de retrait</dt>
        <dd className="inbox-summary-split">
          {(["farm", "tunis"] as const).map((p) => {
            const list = active.filter((r) => placeOf(r) === p);
            return <span key={p}>{list.length} <em>{p === "farm" ? "Testour" : "Tunis"}{kg(list) ? ` · ${kg(list)} kg` : ""}</em></span>;
          })}
        </dd>
        <small>demandes hors annulées</small>
      </div>
      <div>
        <dt>À encaisser</dt>
        <dd>{money(cash(confirmed))}</dd>
        <small>{money(cash(active))} si tout est confirmé</small>
      </div>
    </dl>
  );
}

function RequestCard({ request, onSave }: { request: ReservationRequest; onSave: (r: ReservationRequest) => Promise<void> }) {
  const [note, setNote] = useState(request.ownerNote || ""),
    [date, setDate] = useState(request.pickupDate || ""),
    [busy, setBusy] = useState(false),
    [saved, setSaved] = useState(false),
    [error, setError] = useState("");
  // A refreshed request (new revision) replaces the local draft.
  useEffect(() => {
    setNote(request.ownerNote || "");
    setDate(request.pickupDate || "");
  }, [request.revision, request.ownerNote, request.pickupDate]);
  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 3000);
    return () => window.clearTimeout(timer);
  }, [saved]);
  const dirty = note !== (request.ownerNote || "") || date !== (request.pickupDate || "");
  async function save(status: Status) {
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      await onSave({ ...request, status, ownerNote: note, pickupDate: date });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }
  function cancel() {
    if (window.confirm(`Annuler la demande de ${request.firstName} ${request.lastName} (${orderLine(request)}) ?\n\nVous pourrez la rétablir ensuite.`))
      void save("cancelled");
  }
  const place = placeOf(request);
  return (
    <article className="inbox-card" data-status={request.status}>
      <div className="inbox-card-main">
        <p className="inbox-card-meta">
          <span className="inbox-status">{statuses[request.status]}</span>
          <span>{request.id} · reçue le {received.format(new Date(request.createdAt))}</span>
        </p>
        <h3>{request.firstName} {request.lastName}</h3>
        {request.harvest ? (
          <>
            <p className="inbox-order">
              <strong>{request.productName} · {selectionLabel(request.harvest)}</strong>
              <span>{money(request.harvest.total)}</span>
              {place && (
                <span className="inbox-place" data-place={place}>
                  <MapPin size={14} />
                  {places[place]}
                </span>
              )}
            </p>
            <p className="inbox-order-detail">
              {request.harvest.preorder && <span className="inbox-preorder">Précommande{request.harvest.availability ? ` · ${request.harvest.availability}` : ""}</span>}
              {money(request.harvest.unitPrice)} {request.harvest.kg !== undefined ? "/ kg" : "l’unité"} · paiement au retrait
              {request.harvest.promoCode ? ` · code ${request.harvest.promoCode} (−${money(request.harvest.discount || 0)})` : ""}
            </p>
          </>
        ) : (
          <>
            <p className="inbox-order">
              <strong>{request.quantity} × {request.productName}</strong>
              <span>{request.size}</span>
            </p>
            <p className="inbox-order-detail" style={{ whiteSpace: "pre-wrap" }}>{request.address}</p>
          </>
        )}
        {request.notes && <blockquote className="inbox-customer-note">« {request.notes} »</blockquote>}
        <p className="inbox-phone">{displayPhone(request.phone)}</p>
        <div className="inbox-contact">
          <a className="shop-button" href={`tel:+${internationalDigits(request.phone)}`}>
            <Phone size={17} />
            Appeler
          </a>
          <a className="shop-button secondary" href={whatsappLink(request)} target="_blank" rel="noreferrer">
            <MessageCircle size={17} />
            WhatsApp
          </a>
          {request.email && (
            <a className="pantry-text-link" href={`mailto:${request.email}`}>
              {request.email}
            </a>
          )}
        </div>
      </div>
      <div className="inbox-card-side">
        {request.status === "cancelled" ? (
          <button type="button" className="shop-button secondary" disabled={busy} onClick={() => save("new")}>
            Rétablir la demande
          </button>
        ) : (
          <div className="inbox-steps" role="group" aria-label="Suivi de la demande">
            {steps.map((step) => (
              <button key={step} type="button" aria-pressed={request.status === step} disabled={busy} onClick={() => request.status !== step && save(step)}>
                {request.status === step && <Check size={14} />}
                {statuses[step]}
              </button>
            ))}
          </div>
        )}
        <details className="inbox-followup" open={Boolean(request.pickupDate || request.ownerNote || request.status === "confirmed")}>
          <summary>
            Retrait et note
            {request.pickupDate && <span>{formatPickup(request.pickupDate)}</span>}
          </summary>
          <label>
            Date de retrait
            <input className="field" type="date" value={date} disabled={busy} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            Note privée
            <textarea className="field" rows={2} maxLength={1000} value={note} disabled={busy} placeholder="Ex. rappeler après 18 h" onChange={(e) => setNote(e.target.value)} />
          </label>
        </details>
        <div className="inbox-card-actions">
          {dirty && (
            <button type="button" className="shop-button secondary" disabled={busy} onClick={() => save(request.status)}>
              Enregistrer
            </button>
          )}
          {saved && !dirty && !busy && (
            <span className="inbox-saved" role="status">
              <Check size={15} />
              Enregistré
            </span>
          )}
          {request.status !== "cancelled" && (
            <button type="button" className="inbox-cancel" disabled={busy} onClick={cancel}>
              Annuler la demande
            </button>
          )}
        </div>
        {error && <p role="alert" className="shop-error">{error}</p>}
      </div>
    </article>
  );
}

function PrintList({ requests, title, includeCancelled }: { requests: ReservationRequest[]; title: string; includeCancelled: boolean }) {
  // A pickup sheet lists what is still to hand over, soonest date first.
  const list = requests
    .filter((r) => includeCancelled || r.status !== "cancelled")
    .sort((a, b) => (a.pickupDate || "9999").localeCompare(b.pickupDate || "9999"));
  const groups: [string, ReservationRequest[]][] = [
    ["Retrait à la ferme · Testour", list.filter((r) => placeOf(r) === "farm")],
    ["Retrait à Tunis", list.filter((r) => placeOf(r) === "tunis")],
    ["Autres produits", list.filter((r) => !placeOf(r))],
  ];
  return (
    <div className="inbox-print">
      <h2>Liste de retrait · {title}</h2>
      {groups
        .filter(([, list]) => list.length)
        .map(([label, list]) => (
          <section key={label}>
            <h3>{label}</h3>
            <table>
              <colgroup><col style={{ width: "11%" }} /><col style={{ width: "17%" }} /><col style={{ width: "15%" }} /><col style={{ width: "12%" }} /><col style={{ width: "11%" }} /><col style={{ width: "10%" }} /><col /><col style={{ width: "6%" }} /></colgroup>
              <thead>
                <tr><th>Retrait</th><th>Client</th><th>Téléphone</th><th>Demande</th><th>Total</th><th>Suivi</th><th>Note</th><th>Remis</th></tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{formatPickup(r.pickupDate) || "—"}</td>
                    <td>{r.firstName} {r.lastName}</td>
                    <td>{displayPhone(r.phone)}</td>
                    <td>{r.harvest ? `${r.productName} · ${selectionLabel(r.harvest)}${r.harvest.preorder ? " (préco.)" : ""}` : `${r.quantity} × ${r.productName} · ${r.size}`}</td>
                    <td>{r.harvest ? money(r.harvest.total) : "—"}</td>
                    <td>{statuses[r.status]}</td>
                    <td>{r.ownerNote || ""}</td>
                    <td><span className="inbox-print-tick" /></td>
                  </tr>
                ))}
              </tbody>
              {list.some((r) => r.harvest) && (
                <tfoot>
                  <tr>
                    <td colSpan={3}>{list.length} demande{list.length > 1 ? "s" : ""}</td>
                    <td>{list.some((r) => r.harvest?.kg) ? `${list.reduce((sum, r) => sum + (r.harvest?.kg || 0), 0)} kg de grenades` : ""}</td>
                    <td>{money(list.reduce((sum, r) => sum + (r.harvest?.total || 0), 0))}</td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              )}
            </table>
          </section>
        ))}
    </div>
  );
}

export default function ReservationInbox({
  requests,
  onSave,
}: {
  requests: ReservationRequest[];
  onSave: (request: ReservationRequest) => Promise<void>;
}) {
  const [filter, setFilter] = useState<Filter>(() => (requests.some(filters.open.test) ? "open" : "all")),
    [place, setPlace] = useState<Place | "any">("any");
  const hasHarvest = requests.some((r) => r.harvest);
  // The list is fixed when a view is chosen (or a request arrives), so a card that changes
  // status stays in place with its feedback instead of jumping or vanishing mid-task.
  const viewIds = useMemo(() => {
    const list = requests.filter(filters[filter].test).filter((r) => place === "any" || placeOf(r) === place);
    // Confirmed requests are a pickup schedule: soonest date first, undated last.
    // Open requests put the ones nobody has called yet first; otherwise newest first, as stored.
    if (filter === "confirmed") list.sort((a, b) => (a.pickupDate || "9999").localeCompare(b.pickupDate || "9999"));
    else if (filter === "open") list.sort((a, b) => Number(b.status === "new") - Number(a.status === "new"));
    return list.map((r) => r.id);
  }, [filter, place, requests.length]);
  const byId = new Map(requests.map((r) => [r.id, r]));
  const visible = viewIds.map((id) => byId.get(id)).filter((r): r is ReservationRequest => Boolean(r));
  const title = `${filters[filter].label}${place === "any" ? "" : ` · ${places[place]}`}`;
  return (
    <section className="inbox">
      <div className="admin-heading">
        <div>
          <h2>Demandes de récolte</h2>
          <p>Appelez ou écrivez au client, fixez le retrait, puis passez la demande en « Confirmée ».</p>
        </div>
        <button type="button" className="shop-button secondary" disabled={!visible.length} onClick={() => window.print()}>
          <Printer size={17} />
          Imprimer la liste
        </button>
      </div>
      {hasHarvest && <Summary requests={requests} />}
      <div className="inbox-toolbar">
        <div className="pantry-filters" role="group" aria-label="Filtrer par suivi">
          {(Object.keys(filters) as Filter[]).map((key) => (
            <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {filters[key].label}
              <span className="inbox-count">{requests.filter(filters[key].test).length}</span>
            </button>
          ))}
        </div>
        {hasHarvest && (
          <div className="pantry-filters" role="group" aria-label="Filtrer par lieu de retrait">
            {(["any", "farm", "tunis"] as const).map((key) => (
              <button key={key} type="button" aria-pressed={place === key} onClick={() => setPlace(key)}>
                {key === "any" ? "Tous les lieux" : places[key]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="inbox-list">
        {visible.map((request) => (
          <RequestCard key={request.id} request={request} onSave={onSave} />
        ))}
        {!visible.length && (
          <p className="shop-notice">
            {requests.length ? "Aucune demande dans cette vue." : "Aucune demande pour le moment. Les nouvelles demandes de récolte arriveront ici."}
          </p>
        )}
      </div>
      <p className="pantry-small">
        Ces demandes ne bloquent pas de stock et ne créent pas de commande payée. « Confirmée » note votre accord avec le client ; la date et la note privée ne sont visibles que par vous.
      </p>
      <PrintList requests={visible} title={title} includeCancelled={filter === "cancelled"} />
    </section>
  );
}
