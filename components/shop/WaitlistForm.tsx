"use client";
import { useRef, useState, type FormEvent } from "react";
import { Bell, Check } from "lucide-react";
import { errorMessage } from "./copy";

// "Notify me" for a product that cannot be ordered right now. Real signups feed the
// public "N people are waiting" count and the owner's waitlist.
export default function WaitlistForm({
  productId,
  productName,
  locale,
  waiting = 0,
  title,
}: {
  productId: string;
  productName: string;
  locale: "fr" | "en";
  waiting?: number;
  title?: string;
}) {
  const fr = locale === "fr";
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState<{ name: string; already: boolean } | null>(null);
  const key = useRef("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const f = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError("");
    key.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/shop/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, consent: f.consent === "on", productId, requestKey: key.current }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(errorMessage(result.error, locale));
      setDone({ name: String(f.firstName), already: Boolean(result.already) });
    } catch (e) {
      setError(e instanceof Error ? e.message : errorMessage("unavailable", locale));
    } finally {
      setBusy(false);
    }
  }
  if (done)
    return (
      <div className="waitlist-form waitlist-done" role="status">
        <Check size={22} />
        <p>
          <strong>{fr ? `C’est noté, ${done.name}.` : `You’re on the list, ${done.name}.`}</strong>
          {done.already
            ? fr ? " Vous étiez déjà inscrit(e) : vous serez parmi les premiers prévenus." : " You were already signed up: you’ll be among the first to hear."
            : fr ? " Vous serez parmi les premiers prévenus de son retour, sur WhatsApp ou par téléphone." : " You’ll be among the first to hear when it’s back, by WhatsApp or phone."}
        </p>
      </div>
    );
  return (
    <form className="waitlist-form" aria-label={`${fr ? "Liste d’attente" : "Waitlist"} · ${productName}`} onSubmit={submit} onChange={() => { key.current = ""; }}>
      <fieldset disabled={busy}>
        <legend>
          <Bell size={18} />
          {title || (fr ? "Prévenez-moi dès le retour" : "Tell me when it’s back")}
        </legend>
        {waiting >= 3 && (
          <p className="waitlist-proof">
            {fr ? `${waiting} personnes attendent déjà son retour.` : `${waiting} people are already waiting for it.`}
          </p>
        )}
        <div className="waitlist-fields">
          <label>
            {fr ? "Prénom" : "First name"}
            <input className="field" name="firstName" autoComplete="given-name" maxLength={80} required />
          </label>
          <label>
            {fr ? "Téléphone (WhatsApp)" : "Phone (WhatsApp)"}
            <input className="field" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+216" maxLength={30} required />
          </label>
        </div>
        <label>
          {fr ? "Email (facultatif)" : "Email (optional)"}
          <input className="field" name="email" type="email" autoComplete="email" maxLength={254} />
        </label>
        <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
        <label className="waitlist-consent">
          <input type="checkbox" name="consent" required />
          <span>
            {fr
              ? "J’accepte que Farm El Baya me contacte au sujet du retour de ce produit. Rien d’autre, et je peux me désinscrire à tout moment."
              : "I agree that Farm El Baya may contact me about this product’s return. Nothing else, and I can opt out anytime."}
          </span>
        </label>
        {error && <p role="alert" className="shop-error">{error}</p>}
        <button className="shop-button" type="submit">
          {busy ? (fr ? "Envoi…" : "Sending…") : fr ? "Me prévenir en premier" : "Notify me first"}
        </button>
      </fieldset>
    </form>
  );
}
