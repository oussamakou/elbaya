"use client";
import { useState } from "react";
import { Bell, Check, Copy, Download, MessageCircle } from "lucide-react";
import type { Product, WaitlistEntry } from "@/lib/shop/types";
import { displayPhone, internationalDigits, whatsappHref } from "./phone";

// Public address customers open from the WhatsApp message (same origin as the owner email links).
const SHOP_URL = "https://www.farmelbaya.com";
const received = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Africa/Tunis" });

function csv(entries: WaitlistEntry[]) {
  const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = entries.map((e) =>
    [e.productName, e.firstName, `+${internationalDigits(e.phone)}`, e.email, e.createdAt.slice(0, 10), e.notifiedAt ? "oui" : "non"].map(cell).join(","),
  );
  return ["Produit,Prénom,Téléphone,Email,Inscrit le,Prévenu"].concat(rows).join("\n");
}

// Back-in-stock list: who asked to hear first, grouped by product.
export default function WaitlistPanel({
  entries,
  products,
  onChange,
}: {
  entries: WaitlistEntry[];
  products: Product[];
  onChange: (action: "waitlist" | "waitlist_remove", payload: unknown) => Promise<void>;
}) {
  const [busy, setBusy] = useState(""),
    [copied, setCopied] = useState(""),
    [error, setError] = useState("");
  const groups = products
    .map((product) => ({ product, list: entries.filter((e) => e.productId === product.id) }))
    .filter((g) => g.list.length);
  async function run(key: string, action: "waitlist" | "waitlist_remove", payload: unknown) {
    setBusy(key);
    setError("");
    try {
      await onChange(action, payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy("");
    }
  }
  function download() {
    const blob = new Blob([`﻿${csv(entries)}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `liste-attente-el-baya-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  return (
    <section className="admin-panel" id="liste-attente">
      <div className="admin-heading">
        <div>
          <h2>Liste d’attente</h2>
          <p>Ils veulent être prévenus en premier. Au retour du produit, écrivez-leur sur WhatsApp, puis cochez « Prévenu ».</p>
        </div>
        {entries.length > 0 && (
          <button type="button" className="shop-button secondary" onClick={download}>
            <Download size={17} />
            Exporter (CSV)
          </button>
        )}
      </div>
      {error && <p role="alert" className="shop-error">{error}</p>}
      {!groups.length && (
        <p className="shop-notice">
          Personne en liste d’attente pour le moment. Passez un produit en « Épuisé » : sa page proposera « Prévenez-moi ».
        </p>
      )}
      {groups.map(({ product, list }) => {
        const waiting = list.filter((e) => !e.notifiedAt);
        const url = `${SHOP_URL}/fr/products/${product.id}`;
        return (
          <div key={product.id} className="waitlist-group">
            <div className="waitlist-group-head">
              <h3>
                {product.name.fr}
                <span>{waiting.length} en attente{list.length > waiting.length ? ` · ${list.length - waiting.length} prévenu${list.length - waiting.length > 1 ? "s" : ""}` : ""}</span>
              </h3>
              {waiting.length > 0 && (
                <button
                  type="button"
                  className="pantry-text-link"
                  onClick={async () => {
                    await navigator.clipboard.writeText(waiting.map((e) => `+${internationalDigits(e.phone)}`).join("\n"));
                    setCopied(product.id);
                    window.setTimeout(() => setCopied(""), 2500);
                  }}
                >
                  {copied === product.id ? <Check size={15} /> : <Copy size={15} />}
                  {copied === product.id ? "Numéros copiés" : "Copier les numéros"}
                </button>
              )}
            </div>
            <ul className="waitlist-list">
              {list.map((entry) => (
                <li key={entry.id} data-notified={entry.notifiedAt ? "" : undefined}>
                  <div>
                    <strong>{entry.firstName}</strong>
                    <span>{displayPhone(entry.phone)}</span>
                    <small>
                      inscrit le {received.format(new Date(entry.createdAt))}
                      {entry.email ? ` · ${entry.email}` : ""}
                    </small>
                  </div>
                  <div className="waitlist-actions">
                    <a
                      className="shop-button secondary"
                      href={whatsappHref(entry.phone, `Bonjour ${entry.firstName}, bonne nouvelle : c’est de retour à El Baya (${product.name.fr}). Vous êtes parmi les premiers prévenus. ${url}`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                    <button
                      type="button"
                      className="waitlist-toggle"
                      aria-pressed={Boolean(entry.notifiedAt)}
                      disabled={busy === entry.id}
                      onClick={() => run(entry.id, "waitlist", { id: entry.id, notified: !entry.notifiedAt })}
                    >
                      {entry.notifiedAt ? <Check size={15} /> : <Bell size={15} />}
                      {entry.notifiedAt ? "Prévenu" : "Marquer prévenu"}
                    </button>
                    <button
                      type="button"
                      className="inbox-cancel"
                      disabled={busy === entry.id}
                      onClick={() => {
                        if (window.confirm(`Retirer ${entry.firstName} (${displayPhone(entry.phone)}) de la liste d’attente ?`))
                          void run(entry.id, "waitlist_remove", { id: entry.id });
                      }}
                    >
                      Retirer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
