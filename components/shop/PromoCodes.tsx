"use client";
import { useState, type FormEvent } from "react";
import { Plus, Tag } from "lucide-react";
import { money, type PromoCode } from "@/lib/shop/types";

type Draft = Omit<PromoCode, "uses" | "createdAt">;
const endDay = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const tunisToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Tunis" }).format(new Date());

function state(promo: PromoCode) {
  if (!promo.active) return "Désactivé";
  if (promo.endsOn && promo.endsOn < tunisToday()) return "Expiré";
  if (promo.maxUses !== null && promo.uses >= promo.maxUses) return "Épuisé";
  return "Actif";
}
const label = (p: Pick<PromoCode, "kind" | "value">) => (p.kind === "percent" ? `−${p.value} %` : `−${money(p.value)}`);

// Codes for harvest requests: the customer enters one before sending; the discount is stored with the request.
export default function PromoCodes({ promos, onSave }: { promos: PromoCode[]; onSave: (promo: Draft) => Promise<void> }) {
  const [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [kind, setKind] = useState<"percent" | "amount">("percent");
  async function save(key: string, promo: Draft) {
    setBusy(key);
    setError("");
    try {
      await onSave(promo);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      return false;
    } finally {
      setBusy("");
    }
  }
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const f = new FormData(form);
    const code = String(f.get("code") || "").trim().toUpperCase();
    if (promos.some((p) => p.code === code) && !window.confirm(`Le code ${code} existe déjà. Le remplacer par ces nouvelles conditions ?`)) return;
    const value = Number(String(f.get("value") || "0").replace(",", "."));
    const ok = await save("new", {
      code,
      kind,
      // Amounts are typed in DT and stored in millimes.
      value: kind === "percent" ? Math.round(value) : Math.round(value * 1000),
      maxUses: f.get("maxUses") ? Number(f.get("maxUses")) : null,
      endsOn: String(f.get("endsOn") || "") || null,
      active: true,
    });
    if (ok) form.reset();
  }
  return (
    <section className="admin-panel">
      <div className="admin-heading">
        <div>
          <h2>Codes promo</h2>
          <p>Pour toutes les demandes de la boutique (Commande et Précommande). Le client saisit le code avant d’envoyer ; la remise est calculée et enregistrée avec la demande.</p>
        </div>
      </div>
      <form className="promo-form" onSubmit={create}>
        <label>
          Code
          <input className="field" name="code" required minLength={3} maxLength={20} pattern="[A-Za-z0-9\-]{3,20}" placeholder="Ex. AMIS10" autoCapitalize="characters" />
        </label>
        <label>
          Remise
          <span className="promo-value">
            <input className="field" name="value" required inputMode="decimal" type="number" min={kind === "percent" ? 1 : 0.1} max={kind === "percent" ? 90 : 1000} step={kind === "percent" ? 1 : 0.1} placeholder={kind === "percent" ? "10" : "5"} />
            <select className="field" value={kind} onChange={(e) => setKind(e.target.value as "percent" | "amount")} aria-label="Type de remise">
              <option value="percent">%</option>
              <option value="amount">DT</option>
            </select>
          </span>
        </label>
        <label>
          Limite d’utilisations
          <input className="field" name="maxUses" type="number" min={1} max={100000} placeholder="Illimité" />
        </label>
        <label>
          Dernier jour (facultatif)
          <input className="field" name="endsOn" type="date" />
        </label>
        <button className="shop-button" disabled={busy === "new"}>
          <Plus size={17} />
          Créer le code
        </button>
      </form>
      {error && <p role="alert" className="shop-error">{error}</p>}
      {promos.length ? (
        <ul className="promo-list">
          {promos.map((promo) => {
            const status = state(promo);
            return (
              <li key={promo.code} data-state={status}>
                <Tag size={17} />
                <strong>{promo.code}</strong>
                <span>{label(promo)}</span>
                <span>
                  {promo.uses} utilisation{promo.uses > 1 ? "s" : ""}
                  {promo.maxUses !== null ? ` / ${promo.maxUses}` : ""}
                </span>
                <span>{promo.endsOn ? `jusqu’au ${endDay.format(new Date(`${promo.endsOn}T00:00:00Z`))}` : "sans date de fin"}</span>
                <span className="promo-state">{status}</span>
                <button
                  type="button"
                  className="pantry-text-link"
                  disabled={busy === promo.code}
                  onClick={() => save(promo.code, { code: promo.code, kind: promo.kind, value: promo.value, maxUses: promo.maxUses, endsOn: promo.endsOn, active: !promo.active })}
                >
                  {promo.active ? "Désactiver" : "Réactiver"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="shop-notice">Aucun code pour le moment. Exemple : AMIS10 pour −10 % sur une demande, limité à 20 utilisations.</p>
      )}
    </section>
  );
}
