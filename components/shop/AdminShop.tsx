"use client";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ImagePlus,
  Leaf,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Settings,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  money,
  type Order,
  type Product,
  type ShopSettings,
} from "@/lib/shop/types";
import { errorMessage } from "./copy";
import ReservationInbox from "./ReservationInbox";
import type { ReservationRequest } from "@/lib/shop/types";

type AdminData = {
  notifications?: {configured: boolean; pending: number};
  products: Product[];
  settings: ShopSettings;
  orders: Order[];
  reservations: ReservationRequest[];
};
const statusNames = {
  new: "Nouvelle",
  confirmed: "Confirmée",
  delivering: "En livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
};
const productStatus = {
  draft: "Brouillon",
  available: "En vente",
  seasonal: "Hors saison",
  preorder: "Précommande",
};
function matchesOrderFilter(order: Order, filter: string) {
  return (
    filter === "all" ||
    (filter === "preorder"
      ? order.items.some((i) => i.fulfillment === "preorder")
      : order.status === filter)
  );
}
async function api(path: string, data?: unknown, method = "POST") {
  const response = await fetch(
    path,
    data === undefined
      ? { method, cache: "no-store" }
      : {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
  );
  const result = await response.json();
  if (!response.ok) throw new Error(errorMessage(result.error));
  return result;
}
function blankProduct(): Product {
  return {
    id: crypto.randomUUID(),
    revision: 0,
    name: { fr: "", en: "" },
    description: { fr: "", en: "" },
    category: "fruit",
    status: "draft",
    images: [],
    variants: [{ id: crypto.randomUUID(), label: "", price: 0, stock: 0 }],
  };
}
// Resize camera photos before upload so normal phone images fit the request limit.
async function preparePhoto(file: File) {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 20000000
  )
    throw new Error(
      "Choisissez une photo JPEG, PNG ou WebP de moins de 20 Mo.",
    );
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Impossible de préparer cette photo.")),
      "image/webp",
      0.85,
    ),
  );
}
function ProductEditor({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (p: Product) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Product>(structuredClone(product)),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false),
    [error, setError] = useState("");
  const changed = JSON.stringify(draft) !== JSON.stringify(product);
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (changed) event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [changed]);
  function cancel() {
    if (
      !changed ||
      window.confirm("Quitter sans enregistrer les modifications ?")
    )
      onCancel();
  }
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      if (draft.images.length + files.length > 6)
        throw new Error("Vous pouvez ajouter jusqu’à 6 photos.");
      for (const file of Array.from(files)) {
        const blob = await preparePhoto(file);
        const response = await fetch("/api/shop/admin/images", {
          method: "POST",
          headers: { "Content-Type": blob.type },
          body: blob,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(errorMessage(result.error));
        setDraft((p) => ({ ...p, images: [...p.images, result.url] }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : errorMessage("image"));
    } finally {
      setUploading(false);
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSave(draft);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="admin-editor" onSubmit={submit}>
      <button
        type="button"
        className="pantry-text-link"
        onClick={cancel}
        disabled={busy || uploading}
      >
        <ArrowLeft size={17} />
        Tous les produits
      </button>
      <div className="admin-heading">
        <div>
          <p className="shop-eyebrow">FICHE PRODUIT</p>
          <h2>{draft.name.fr || "Un nouveau produit"}</h2>
        </div>
      </div>
      <fieldset disabled={busy || uploading} className="admin-editor-fields">
        <section className="admin-form-section">
          <div>
            <h3>01. Le produit</h3>
            <p>Le nom et les mots que vos clients verront.</p>
          </div>
          <div className="admin-fields">
            <label>
              Nom du produit
              <input
                className="field"
                required
                maxLength={120}
                value={draft.name.fr}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    name: { ...draft.name, fr: e.target.value },
                  })
                }
                placeholder="Ex. Grenades de la ferme"
              />
            </label>
            <label>
              Description
              <textarea
                className="field"
                rows={4}
                required
                maxLength={2000}
                value={draft.description.fr}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    description: { ...draft.description, fr: e.target.value },
                  })
                }
                placeholder="Origine, goût, conservation, contenu du colis…"
              />
            </label>
            <div className="shop-two">
              <label>
                Catégorie
                <select
                  className="field"
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      category: e.target.value as Product["category"],
                    })
                  }
                >
                  <option value="fruit">Fruits</option>
                  <option value="oil">Huile d’olive</option>
                  <option value="honey">Miel</option>
                  <option value="other">Autres produits</option>
                </select>
              </label>
              <label>
                Visibilité
                <select
                  className="field"
                  value={draft.status}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      status: e.target.value as Product["status"],
                    })
                  }
                >
                  <option value="draft">Brouillon · masqué</option>
                  <option value="seasonal">
                    Hors saison · demandes uniquement
                  </option>
                  <option value="available">En vente</option>
                  <option value="preorder">Précommandes ouvertes</option>
                </select>
                <span className="pantry-small" aria-live="polite">
                  {draft.status === "draft"
                    ? "Masqué du catalogue et inaccessible par lien direct."
                    : draft.status === "seasonal"
                      ? "Visible, avec demande de précommande à confirmer par téléphone. Aucun achat au panier."
                      : draft.status === "preorder"
                        ? "Réservation au prix affiché, selon les places disponibles et l’ouverture de la boutique."
                        : "Achat au panier selon le stock disponible et l’ouverture de la boutique."}
                  {" "}Enregistrez pour appliquer ce choix.
                </span>
              </label>
            </div>
            {draft.status === "preorder" && (
              <div className="admin-preorder-settings">
                <h3>Réserver la prochaine récolte</h3>
                <p>
                  Les clients réservent des colis sans acompte. Indiquez une
                  période estimée ; confirmez ensuite la livraison par
                  téléphone.
                </p>
                <label>
                  Disponibilité estimée
                  <textarea
                    className="field"
                    required
                    maxLength={500}
                    rows={2}
                    placeholder="Ex. Récolte prévue en novembre, date à confirmer par téléphone."
                    value={draft.preorderNote?.fr || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        preorderNote: {
                          fr: e.target.value,
                          en: draft.preorderNote?.en || "",
                        },
                      })
                    }
                  />
                </label>
                <label>
                  Disponibilité en anglais (facultatif)
                  <textarea
                    className="field"
                    maxLength={500}
                    rows={2}
                    value={draft.preorderNote?.en || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        preorderNote: {
                          fr: draft.preorderNote?.fr || "",
                          en: e.target.value,
                        },
                      })
                    }
                  />
                </label>
                <p className="pantry-small">
                  Le panier entier sera livré quand tous ses produits seront
                  disponibles. Le prix est fixé à la réservation ; le paiement
                  se fait à la livraison.
                </p>
              </div>
            )}
            <details className="admin-translations">
              <summary>Version anglaise (facultatif)</summary>
              <label>
                Nom en anglais
                <input
                  className="field"
                  maxLength={120}
                  value={draft.name.en}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      name: { ...draft.name, en: e.target.value },
                    })
                  }
                />
              </label>
              <label>
                Description en anglais
                <textarea
                  className="field"
                  maxLength={2000}
                  rows={3}
                  value={draft.description.en}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      description: { ...draft.description, en: e.target.value },
                    })
                  }
                />
              </label>
              <p className="pantry-small">
                Le français s’affiche si la traduction est vide.
              </p>
            </details>
          </div>
        </section>
        <section className="admin-form-section">
          <div>
            <h3>02. Les photos</h3>
            <p>
              La première photo est la couverture. JPEG, PNG ou WebP ; jusqu’à 6
              photos.
            </p>
          </div>
          <div>
            <div className="admin-photo-grid">
              {draft.images.map((src, index) => (
                <div key={src} className="admin-photo">
                  <img src={src} alt={`Photo du produit ${index + 1}`} />
                  <button
                    type="button"
                    aria-label={`Retirer la photo ${index + 1}`}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        images: draft.images.filter((_, i) => i !== index),
                      })
                    }
                  >
                    <X size={16} />
                  </button>
                  {index > 0 && (
                    <button
                      type="button"
                      className="admin-cover"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          images: [
                            src,
                            ...draft.images.filter((s) => s !== src),
                          ],
                        })
                      }
                    >
                      Couverture
                    </button>
                  )}
                </div>
              ))}
            </div>
            <label className="admin-upload">
              <ImagePlus size={24} />
              <span>
                {uploading ? "Préparation des photos…" : "Ajouter des photos"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => {
                  void upload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            <p className="pantry-small">
              Les photos sont redimensionnées automatiquement. Gardez
              l’illustration en couverture ou choisissez une de vos photos.
            </p>
          </div>
        </section>
        <section className="admin-form-section">
          <div>
            <h3>03. Formats & stock</h3>
            <p>
              Une ligne par format. Le stock correspond au nombre de colis ou de
              bouteilles à vendre, pas au poids total.
            </p>
            <p className="pantry-small">
              Exemple : « 3 kg », prix 18 DT, stock 20 = vingt colis de 3 kg
              disponibles.
            </p>
          </div>
          <div>
            <div className="admin-variants">
              {draft.variants.map((v, index) => (
                <div key={v.id} className="admin-variant">
                  <label>
                    Format
                    <input
                      className="field"
                      maxLength={80}
                      required
                      value={v.label}
                      placeholder="3 kg / 1 L"
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          variants: draft.variants.map((x, i) =>
                            i === index ? { ...x, label: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    Prix (DT)
                    <input
                      className="field"
                      type="number"
                      inputMode="decimal"
                      min={
                        ["available", "preorder"].includes(draft.status)
                          ? ".001"
                          : "0"
                      }
                      max="100000"
                      step=".001"
                      required
                      value={v.price / 1000}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          variants: draft.variants.map((x, i) =>
                            i === index
                              ? {
                                  ...x,
                                  price: Math.round(
                                    Number(e.target.value) * 1000,
                                  ),
                                }
                              : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    {draft.status === "preorder"
                      ? "Colis à réserver"
                      : "Colis disponibles"}
                    <input
                      className="field"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      max="100000"
                      step="1"
                      required
                      value={
                        draft.status === "preorder"
                          ? v.preorderStock || 0
                          : v.stock
                      }
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          variants: draft.variants.map((x, i) =>
                            i === index
                              ? {
                                  ...x,
                                  [draft.status === "preorder"
                                    ? "preorderStock"
                                    : "stock"]: Number(e.target.value),
                                }
                              : x,
                          ),
                        })
                      }
                    />
                  </label>
                  {draft.variants.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Retirer le format ${v.label}`}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          variants: draft.variants.filter(
                            (_, i) => i !== index,
                          ),
                        })
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="pantry-text-link"
              disabled={draft.variants.length >= 12}
              onClick={() =>
                setDraft({
                  ...draft,
                  variants: [
                    ...draft.variants,
                    { id: crypto.randomUUID(), label: "", price: 0, stock: 0 },
                  ],
                })
              }
            >
              <Plus size={17} />
              Ajouter un format
            </button>
            <p className="pantry-small">
              {draft.status === "preorder" &&
                "Les places de précommande sont séparées du stock disponible. Une réservation retire des places ; son annulation les restitue. "}
              Un seul format suffit. Ajoutez ou retirez les formats selon vos besoins ;
              le dernier format doit être conservé. Un format lié à une commande
              en cours reste protégé jusqu’à son traitement.
            </p>
          </div>
        </section>
      </fieldset>
      {error && (
        <p className="shop-error" role="alert">
          {error}
        </p>
      )}
      <div className="admin-save">
        <span>
          {draft.status === "draft"
            ? "Ce produit sera enregistré sans être visible sur le site."
            : draft.status === "seasonal"
              ? "Visible sur le site, sans possibilité de commander."
              : draft.status === "preorder"
                ? "Les clients pourront réserver les quantités prévues, sans acompte, si la boutique est ouverte."
                : "Les formats avec du stock pourront être commandés si la boutique est ouverte."}
        </span>
        <button className="shop-button" disabled={busy || uploading}>
          {busy ? "Enregistrement…" : "Enregistrer le produit"}
          <Check size={18} />
        </button>
      </div>
    </form>
  );
}
function DeliverySettings({
  settings,
  onSave,
}: {
  settings: ShopSettings;
  onSave: (s: ShopSettings) => Promise<void>;
}) {
  const [draft, setDraft] = useState(structuredClone(settings)),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSave(draft);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="admin-settings">
      <h2>Livraison & ouverture</h2>
      <p className="pantry-description">
        Ajoutez uniquement les zones desservies par votre livreur. Le client
        voit le prix exact avant de commander.
      </p>
      <fieldset disabled={busy}>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={draft.acceptingOrders}
            onChange={(e) =>
              setDraft({ ...draft, acceptingOrders: e.target.checked })
            }
          />
          <span>
            <strong>Accepter les commandes</strong>
            <small>
              Décochez pour faire une pause. Le catalogue reste visible.
            </small>
          </span>
        </label>
        <div className="admin-zones">
          {draft.zones.map((zone, index) => (
            <div className="admin-zone" key={zone.id}>
              <label>
                Zone desservie
                <input
                  className="field"
                  required
                  maxLength={100}
                  placeholder="Ex. Grand Tunis"
                  value={zone.name}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      zones: draft.zones.map((z, i) =>
                        i === index ? { ...z, name: e.target.value } : z,
                      ),
                    })
                  }
                />
              </label>
              <label>
                Frais (DT)
                <input
                  className="field"
                  required
                  type="number"
                  min="0"
                  max="1000"
                  step=".001"
                  value={zone.fee / 1000}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      zones: draft.zones.map((z, i) =>
                        i === index
                          ? {
                              ...z,
                              fee: Math.round(Number(e.target.value) * 1000),
                            }
                          : z,
                      ),
                    })
                  }
                />
              </label>
              <button
                type="button"
                aria-label={`Retirer ${zone.name || "la zone"}`}
                onClick={() =>
                  setDraft({
                    ...draft,
                    zones: draft.zones.filter((_, i) => i !== index),
                  })
                }
              >
                <Trash2 size={19} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="pantry-text-link"
          onClick={() =>
            setDraft({
              ...draft,
              zones: [
                ...draft.zones,
                { id: crypto.randomUUID(), name: "", fee: 0 },
              ],
            })
          }
        >
          <Plus size={17} />
          Ajouter une zone de livraison
        </button>
      </fieldset>
      {error && (
        <p role="alert" className="shop-error">
          {error}
        </p>
      )}
      <button className="shop-button" disabled={busy}>
        {busy ? "Enregistrement…" : "Enregistrer les réglages"}
        <Check size={18} />
      </button>
    </form>
  );
}
function OrderRow({
  order,
  onSave,
}: {
  order: Order;
  onSave: (o: Order) => Promise<void>;
}) {
  const [status, setStatus] = useState(order.status),
    [paid, setPaid] = useState(order.paid),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function save() {
    if (
      status === "cancelled" &&
      order.status !== "cancelled" &&
      !window.confirm("Annuler cette commande et remettre les colis en stock ?")
    )
      return;
    setBusy(true);
    setError("");
    try {
      await onSave({ ...order, status, paid });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <details className="admin-order">
      <summary>
        <span>
          <strong>{order.id}</strong>
          <small>
            {new Date(order.createdAt).toLocaleString("fr-TN", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Africa/Tunis",
            })}
          </small>
        </span>
        <span>
          {order.customer.name}
          <small>{order.zone}</small>
        </span>
        <span className="admin-order-status">
          {statusNames[order.status]}
          {order.items.some((i) => i.fulfillment === "preorder") && (
            <small className="admin-preorder-badge">Précommande</small>
          )}
        </span>
        <strong>{money(order.total)}</strong>
      </summary>
      <div className="admin-order-body">
        <div>
          <h3>Livraison</h3>
          <p>
            {order.customer.name}
            <br />
            <a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a>
            <br />
            {order.customer.address}
            <br />
            {order.zone}
          </p>
          {order.customer.notes && (
            <p className="shop-notice">{order.customer.notes}</p>
          )}
        </div>
        <div>
          <h3>Le panier</h3>
          {order.items.some((i) => i.fulfillment === "preorder") && (
            <p className="shop-notice">
              Précommande · livrer le panier entier quand tout est disponible.
              Confirmer la date par téléphone.
            </p>
          )}
          {order.items.map((i) => (
            <p
              className="admin-order-line"
              key={`${i.productId}/${i.variantId}`}
            >
              <span>
                {i.name} · {i.label} × {i.quantity}
                {i.fulfillment === "preorder" && (
                  <small className="admin-preorder-note">
                    Précommande · {i.availability}
                  </small>
                )}
              </span>
              <span>{money(i.price * i.quantity)}</span>
            </p>
          ))}
          <p className="admin-order-line">
            <span>Livraison</span>
            <span>{money(order.deliveryFee)}</span>
          </p>
          <p className="admin-order-line">
            <strong>À encaisser</strong>
            <strong>{money(order.total)}</strong>
          </p>
        </div>
        <div className="admin-order-controls">
          <label>
            Statut
            <select
              className="field"
              disabled={busy || order.status === "cancelled"}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as Order["status"]);
                if (e.target.value !== "delivered") setPaid(false);
              }}
            >
              {Object.entries(statusNames).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-toggle">
            <input
              type="checkbox"
              disabled={busy || status !== "delivered"}
              checked={paid}
              onChange={(e) => setPaid(e.target.checked)}
            />
            Paiement encaissé
          </label>
          <button
            className="shop-button"
            disabled={busy || (status === order.status && paid === order.paid)}
            onClick={save}
          >
            {busy ? "Enregistrement…" : "Mettre à jour"}
          </button>
          {error && (
            <p role="alert" className="shop-error">
              {error}
            </p>
          )}
        </div>
      </div>
    </details>
  );
}
export default function AdminShop({
  configured,
  initial,
}: {
  configured: boolean;
  initial: AdminData | null;
}) {
  const [data, setData] = useState(initial),
    [tab, setTab] = useState("products"),
    [editor, setEditor] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [orderFilter, setOrderFilter] = useState("all");
  async function refresh() {
    setBusy(true);
    setError("");
    try {
      setData(await api("/api/shop/admin", undefined, "GET"));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await api("/api/shop/admin/session", { password: form.get("password") });
      setData(await api("/api/shop/admin", undefined, "GET"));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    try {
      await api("/api/shop/admin/session", undefined, "DELETE");
      setData(null);
      setEditor(null);
      setNotice("");
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function saveProduct(product: Product) {
    const result: Product = await api("/api/shop/admin", {
      action: "product",
      data: product,
    });
    setData(
      (old) =>
        old && {
          ...old,
          products: old.products.some((p) => p.id === result.id)
            ? old.products.map((p) => (p.id === result.id ? result : p))
            : [...old.products, result],
        },
    );
    setEditor(null);
    setNotice("Produit enregistré.");
  }
  async function saveSettings(settings: ShopSettings) {
    const result = await api("/api/shop/admin", {
      action: "settings",
      data: settings,
    });
    setData((old) => old && { ...old, settings: result });
    setNotice("Réglages enregistrés.");
  }
  async function saveOrder(order: Order) {
    await api("/api/shop/admin", { action: "order", data: order });
    setData(await api("/api/shop/admin", undefined, "GET"));
    setNotice("Commande mise à jour.");
  }
  if (!configured)
    return (
      <div className="admin-login shop-wrap">
        <Leaf size={28} />
        <p className="shop-eyebrow">ESPACE PROPRIÉTAIRE</p>
        <h1>Votre boutique se prépare.</h1>
        <p>
          L’accès administrateur doit être configuré avant la première
          connexion.
        </p>
        <p className="pantry-small">
          Consultez SHOP_SETUP.md pour créer le mot de passe et connecter le
          stockage.
        </p>
        <Link href="/products" className="pantry-text-link">
          Voir les produits
          <ArrowUpRight size={17} />
        </Link>
      </div>
    );
  if (!data)
    return (
      <div className="admin-login shop-wrap">
        <Leaf size={28} />
        <p className="shop-eyebrow">FARM EL BAYA · ESPACE PROPRIÉTAIRE</p>
        <h1>Bonjour, Mehdi.</h1>
        <p>
          Vos produits, vos récoltes, vos commandes.
          <br />
          Tout se passe ici.
        </p>
        <form onSubmit={login}>
          <label>
            Mot de passe
            <input
              className="field"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={256}
              required
            />
          </label>
          {error && (
            <p className="shop-error" role="alert">
              {error}
            </p>
          )}
          <button className="shop-button" disabled={busy}>
            {busy ? "Connexion…" : "Ouvrir ma boutique"}
            <ArrowUpRight size={18} />
          </button>
        </form>
        <Link href="/products" className="pantry-text-link">
          <ArrowLeft size={16} />
          Retour au catalogue
        </Link>
      </div>
    );
  const newCount = data.orders.filter((o) => o.status === "new").length;
  return (
    <div className="shop-admin shop-wrap">
      <header className="admin-header">
        <div>
          <p className="shop-eyebrow">FARM EL BAYA · ESPACE PROPRIÉTAIRE</p>
          <h1>La boutique de Mehdi.</h1>
          <p>
            {data.settings.acceptingOrders
              ? "La boutique accepte les commandes."
              : "Achats directs en pause · demandes de précommande ouvertes."}
          </p>
        </div>
        <div className="admin-header-actions">
          <Link href="/products" className="pantry-text-link">
            Voir la boutique
            <ArrowUpRight size={17} />
          </Link>
          <button
            className="admin-icon-button"
            onClick={logout}
            disabled={busy}
            aria-label="Se déconnecter"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>
      {data.notifications && (!data.notifications.configured || data.notifications.pending > 0) && (
        <p className="shop-notice" role="status">
          {!data.notifications.configured
            ? 'Alertes email non activées. Consultez les commandes et précommandes ici en attendant la connexion du service email.'
            : `${data.notifications.pending} alerte(s) email en attente. L’envoi sera retenté lors d’une actualisation du tableau de bord ou d’une nouvelle commande. Les demandes restent enregistrées ici.`}
        </p>
      )}
      <nav className="admin-tabs" aria-label="Administration">
        {[
          ["products", "Produits", Package],
          [
            "reservations",
            `Précommandes (${data.reservations.filter((r) => r.status === "new").length})`,
            Leaf,
          ],
          [
            "orders",
            `Commandes${newCount ? ` (${newCount})` : ""}`,
            ShoppingBag,
          ],
          ["settings", "Livraison & ouverture", Settings],
        ].map(([value, label, Icon]) => {
          const I = Icon as typeof Package;
          return (
            <button
              key={String(value)}
              aria-current={tab === value ? "page" : undefined}
              onClick={() => {
                if (
                  editor &&
                  !window.confirm("Quitter la fiche sans enregistrer ?")
                )
                  return;
                setTab(String(value));
                setEditor(null);
                setNotice("");
              }}
            >
              <I size={18} />
              {String(label)}
            </button>
          );
        })}
        <button
          className="admin-refresh"
          disabled={busy || !!editor}
          onClick={refresh}
          aria-label="Actualiser"
        >
          <RefreshCw size={17} />
        </button>
      </nav>
      {notice && (
        <p className="admin-feedback" role="status">
          <Check size={17} />
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="shop-error">
          {error}
        </p>
      )}
      {tab === "products" &&
        (editor ? (
          <ProductEditor
            key={editor.id}
            product={editor}
            onSave={saveProduct}
            onCancel={() => setEditor(null)}
          />
        ) : (
          <>
            <div className="admin-heading">
              <div>
                <h2>Vos produits</h2>
                <p>Une fiche, quelques photos, et le bon format.</p>
              </div>
              <button
                className="shop-button"
                onClick={() => setEditor(blankProduct())}
              >
                <Plus size={18} />
                Ajouter un produit
              </button>
            </div>
            <div className="admin-product-list">
              {data.products.map((p) => (
                <button
                  className="admin-product-row"
                  key={p.id}
                  onClick={() => {
                    setEditor(p);
                    setNotice("");
                  }}
                >
                  {p.images[0] ? (
                    <img src={p.images[0]} alt="" />
                  ) : (
                    <div className="admin-photo-placeholder">
                      <Leaf />
                    </div>
                  )}
                  <span>
                    <strong>{p.name.fr}</strong>
                    <small>{p.variants.map((v) => v.label).join(" · ")}</small>
                  </span>
                  <span>{productStatus[p.status]}</span>
                  <span>
                    {p.variants.reduce(
                      (n, v) =>
                        n +
                        (p.status === "preorder"
                          ? v.preorderStock || 0
                          : v.stock),
                      0,
                    )}{" "}
                    {p.status === "preorder" ? "à réserver" : "colis"}
                  </span>
                  <span className="admin-edit-label">
                    Modifier
                    <ArrowUpRight size={17} />
                  </span>
                </button>
              ))}
            </div>
            {!data.products.length && (
              <p className="shop-notice">
                Ajoutez votre premier produit pour préparer la boutique.
              </p>
            )}
            <p className="pantry-small">
              Les brouillons sont masqués. Les produits hors saison restent
              visibles sans pouvoir être commandés.
            </p>
          </>
        ))}
      {tab === "reservations" && (
        <ReservationInbox
          requests={data.reservations}
          onSave={async (request) => {
            await api("/api/shop/admin", {
              action: "reservation",
              data: request,
            });
            setData(await api("/api/shop/admin", undefined, "GET"));
          }}
        />
      )}
      {tab === "settings" && (
        <DeliverySettings
          key={data.settings.revision}
          settings={data.settings}
          onSave={saveSettings}
        />
      )}
      {tab === "orders" && (
        <>
          <div className="admin-heading">
            <div>
              <h2>Vos commandes</h2>
              <p>
                Les 500 dernières commandes. Confirmez par téléphone, puis
                préparez la livraison.
              </p>
            </div>
            <button
              className="shop-button secondary"
              onClick={() => {
                const rows = Array.from(
                  document.querySelectorAll<HTMLDetailsElement>(".admin-order"),
                );
                const open = rows.map((row) => row.open);
                rows.forEach((row) => {
                  row.open = true;
                });
                window.print();
                rows.forEach((row, index) => {
                  row.open = open[index];
                });
              }}
            >
              Imprimer la liste
            </button>
          </div>
          <div className="pantry-filters">
            {[
              ["all", "Toutes"],
              ["preorder", "Précommandes"],
              ...Object.entries(statusNames),
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={orderFilter === value}
                onClick={() => setOrderFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          {data.orders
            .filter((o) => matchesOrderFilter(o, orderFilter))
            .map((o) => (
              <OrderRow
                key={`${o.id}/${o.revision}`}
                order={o}
                onSave={saveOrder}
              />
            ))}
          {!data.orders.some((o) => matchesOrderFilter(o, orderFilter)) && (
            <div className="pantry-empty">
              <ShoppingBag size={32} strokeWidth={1} />
              <h3>Tout est calme pour le moment.</h3>
              <p>
                Les commandes apparaîtront ici dès qu’un client aura validé son
                panier.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
