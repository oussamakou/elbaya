"use client";
import { useState } from "react";
import type { ReservationRequest } from "@/lib/shop/types";
const statuses = {
  new: "Nouvelle",
  contacted: "Contacté",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};
function RequestCard({
  request,
  onSave,
}: {
  request: ReservationRequest;
  onSave: (request: ReservationRequest) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <article className="reservation-inbox-card">
      <div>
        <p className="shop-eyebrow">
          {request.id} ·{" "}
          {new Date(request.createdAt).toLocaleDateString("fr-TN")}
        </p>
        <h3>
          {request.firstName} {request.lastName}
        </h3>
        <p>
          {request.quantity} × {request.productName} · {request.size}
        </p>
        <a className="pantry-text-link" href={`tel:${request.phone}`}>
          {request.phone}
        </a>
        <p style={{ whiteSpace: "pre-wrap" }}>{request.address}</p>
        {request.email && (
          <a href={`mailto:${request.email}`}>{request.email}</a>
        )}
        {request.notes && <p>{request.notes}</p>}
      </div>
      <label>
        Suivi
        <select
          className="field"
          disabled={busy}
          value={request.status}
          onChange={async (e) => {
            setBusy(true);
            setError("");
            try {
              await onSave({
                ...request,
                status: e.target.value as ReservationRequest["status"],
              });
            } catch (e) {
              setError(e instanceof Error ? e.message : "Erreur");
            } finally {
              setBusy(false);
            }
          }}
        >
          {Object.entries(statuses).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {error && <span role="alert">{error}</span>}
      </label>
    </article>
  );
}
export default function ReservationInbox({
  requests,
  onSave,
}: {
  requests: ReservationRequest[];
  onSave: (request: ReservationRequest) => Promise<void>;
}) {
  return (
    <section>
      <h2>Demandes de précommande</h2>
      <p className="pantry-lead">
        Appelez le client pour convenir du prix, de la disponibilité et de la
        livraison, puis mettez à jour le suivi.
      </p>
      <p className="pantry-small">
        Ces demandes ne réservent pas automatiquement le stock et ne créent pas
        de commande payante. Le statut « Confirmée » consigne votre accord avec
        le client.
      </p>
      {requests.length ? (
        requests.map((request) => (
          <RequestCard
            key={`${request.id}-${request.revision}`}
            request={request}
            onSave={onSave}
          />
        ))
      ) : (
        <p className="shop-notice">Aucune demande pour le moment.</p>
      )}
    </section>
  );
}
