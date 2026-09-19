"use client";
import { useRef, useState, type FormEvent } from "react";
import { localized, type Product } from "@/lib/shop/types";
import { errorMessage } from "./copy";

export default function ReservationForm({
  products,
  locale,
  productId,
  onProductChange,
}: {
  products: Product[];
  locale: "fr" | "en";
  productId?: string;
  onProductChange?: (id:string) => void;
}) {
  const fr = locale === "fr";
  const [selected, setSelected] = useState(productId || products[0]?.id || "");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [reference, setReference] = useState("");
  const key = useRef("");
  const product = products.find((p) => p.id === selected) || products[0];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    key.current ||= crypto.randomUUID();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/shop/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          quantity: Number(values.quantity),
          requestKey: key.current,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(errorMessage(result.error, locale));
      setReference(result.id);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : errorMessage("unavailable", locale),
      );
    } finally {
      setBusy(false);
    }
  }
  if (reference)
    return (
      <div className="reservation-success" role="status">
        <p className="shop-eyebrow">{reference}</p>
        <h2>
          {fr ? "Votre demande est bien reçue." : "Your request is received."}
        </h2>
        <p>
          {fr
            ? "Mehdi vous contactera par téléphone pour confirmer le prix, la disponibilité et la livraison. Votre précommande sera confirmée après cet échange."
            : "Mehdi will call to confirm the price, availability and delivery. Your pre-order becomes confirmed after that conversation."}
        </p>
      </div>
    );
  if (!product)
    return (
      <p>
        {fr
          ? "Les produits seront bientôt disponibles."
          : "Products are coming soon."}
      </p>
    );
  return (
    <form
      className="reservation-form"
      onSubmit={submit}
      onChange={() => {
        key.current = "";
      }}
    >
      <fieldset disabled={busy}>
        <legend className="sr-only">
          {fr ? "Votre précommande" : "Your pre-order"}
        </legend>
        <label>
          {fr ? "Produit" : "Product"}
          <select
            className="field"
            name="productId"
            value={product.id}
            onChange={(e) => {setSelected(e.target.value); onProductChange?.(e.target.value);}}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {localized(p.name, locale)}
              </option>
            ))}
          </select>
        </label>
        <div className="reservation-row">
          <label>
            {fr ? "Format" : "Size"}
            <select className="field" name="variantId" key={product.id}>
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            {fr ? "Quantité" : "Quantity"}
            <input
              className="field"
              name="quantity"
              type="number"
              defaultValue={1}
              min={1}
              max={99}
              required
            />
          </label>
        </div>
        <div className="reservation-row">
          <label>
            {fr ? "Prénom" : "First name"}
            <input
              className="field"
              name="firstName"
              autoComplete="given-name"
              maxLength={80}
              required
            />
          </label>
          <label>
            {fr ? "Nom" : "Last name"}
            <input
              className="field"
              name="lastName"
              autoComplete="family-name"
              maxLength={80}
              required
            />
          </label>
        </div>
        <label>
          {fr ? "Téléphone tunisien" : "Tunisian phone number"}
          <input
            className="field"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+216"
            maxLength={30}
            required
          />
        </label>
        <div className="reservation-row reservation-address-region"><label>{fr ? 'Gouvernorat' : 'Governorate'}<input className="field" name="governorate" autoComplete="address-level1" placeholder={fr ? 'Ex. Béja' : 'e.g. Béja'} maxLength={80} required /></label><label>{fr ? 'Ville / localité' : 'City / locality'}<input className="field" name="city" autoComplete="address-level2" placeholder={fr ? 'Ex. Testour' : 'e.g. Testour'} maxLength={100} required /></label></div>
        <label>{fr ? 'Adresse (rue, quartier, maison)' : 'Street address (street, area, house)'}
          <textarea
            className="field"
            name="address"
            autoComplete="street-address"
            maxLength={500}
            rows={3}
            required
          />
        </label>
        <label>
          {fr ? "E-mail (facultatif)" : "Email (optional)"}
          <input
            className="field"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
          />
        </label>
        <label>
          {fr ? "Une précision ? (facultatif)" : "Anything else? (optional)"}
          <textarea className="field" name="notes" maxLength={1000} rows={2} />
        </label>
        <div hidden aria-hidden="true">
          <input name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <p className="pantry-small">
          {fr
            ? "Aucun paiement maintenant. Prix, disponibilité et frais de livraison à confirmer par téléphone. Paiement en espèces à la livraison. Vos coordonnées servent uniquement à traiter votre demande."
            : "No payment now. Price, availability and delivery fees will be confirmed by phone. Pay cash on delivery. Your contact details are used only to handle your request."}
        </p>
        {error && (
          <p className="shop-error" role="alert">
            {error}
          </p>
        )}
        <button className="shop-button" disabled={busy}>
          {busy
            ? fr
              ? "Envoi…"
              : "Sending…"
            : fr
              ? "Envoyer ma précommande"
              : "Send my pre-order request"}
        </button>
      </fieldset>
    </form>
  );
}
