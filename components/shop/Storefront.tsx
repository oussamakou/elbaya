"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ShoppingBag,
  Truck,
  Banknote,
  Sprout,
  Trash2,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import {
  localized,
  money,
  type Product,
  type ShopSettings,
  type CartItem,
} from "@/lib/shop/types";
import { copy, errorMessage } from "./copy";
import ProductPanel, { ProductCard } from "./ProductPanel";
import { capacity, fulfillment, orderable } from "@/lib/shop/types";

type Data = { products: Product[]; settings: ShopSettings };
const cartKey = "elbaya-basket-v1";
export default function Storefront({
  initial,
  locale,
  productId,
}: {
  productId?: string;
  initial: Data;
  locale: "fr" | "en";
}) {
  const t = copy[locale];
  const [data, setData] = useState(initial),
    [cart, setCart] = useState<CartItem[]>([]),
    [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("all"),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  const [zoneId, setZoneId] = useState(""),
    [busy, setBusy] = useState(false),
    [success, setSuccess] = useState<{
      id: string;
      total: number;
      preorder?: boolean;
    } | null>(null);
  const requestKey = useRef("");
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(cartKey) || "[]");
      if (Array.isArray(saved))
        setCart(
          saved
            .filter(
              (v) =>
                v &&
                typeof v.productId === "string" &&
                typeof v.variantId === "string" &&
                Number.isInteger(v.quantity) &&
                v.quantity > 0 &&
                v.quantity <= 99,
            )
            .slice(0, 30),
        );
    } catch {
      /* A blocked browser store does not prevent checkout. */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(cartKey, JSON.stringify(cart));
      } catch {
        /* Storage is optional. */
      }
    }
  }, [cart, loaded]);
  const lines = cart.map((item) => {
    const product = data.products.find((p) => p.id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    return { item, product, variant };
  });
  const invalid = lines.some(
    ({ item, product, variant }) =>
      !product ||
      !orderable(product) ||
      fulfillment(product) !== (item.fulfillment || "ready") ||
      !variant ||
      capacity(product, variant) < item.quantity,
  );
  const subtotal = lines.reduce(
    (sum, line) => sum + (line.variant?.price || 0) * line.item.quantity,
    0,
  );
  const zone = data.settings.zones.find((z) => z.id === zoneId);
  const total = subtotal + (zone?.fee || 0);
  const hasPreorder = cart.some((i) => i.fulfillment === "preorder");
  const selectedProduct = data.products.find((p) => p.id === productId);
  const count = cart.reduce((n, i) => n + i.quantity, 0);
  function changeCart(next: CartItem[]) {
    setCart(next);
    requestKey.current = "";
    setError("");
  }
  function add(product: Product, variantId: string, quantity: number) {
    const v = product.variants.find((v) => v.id === variantId)!;
    const existing = cart.find(
      (i) => i.productId === product.id && i.variantId === variantId,
    );
    if (
      (existing?.quantity || 0) + quantity >
      Math.min(capacity(product, v), 99)
    ) {
      setNotice(errorMessage("stock", locale));
      return;
    }
    if (
      existing &&
      ((existing.fulfillment || "ready") !== fulfillment(product) ||
        (product.status === "preorder" &&
          existing.availability !== product.preorderNote?.fr))
    ) {
      setNotice(errorMessage("fulfillment_changed", locale));
      return;
    }
    changeCart(
      existing
        ? cart.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + quantity } : i,
          )
        : [
            ...cart,
            {
              productId: product.id,
              variantId,
              quantity,
              fulfillment: fulfillment(product),
              availability:
                product.status === "preorder"
                  ? product.preorderNote?.fr
                  : undefined,
            },
          ],
    );
    setSuccess(null);
    setNotice(`${localized(product.name, locale)} · ${t.added}`);
  }
  async function refresh() {
    try {
      const response = await fetch("/api/shop/catalogue", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error();
      setData(await response.json());
      requestKey.current = "";
      setError("");
    } catch {
      setError(errorMessage("unavailable", locale));
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    requestKey.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/shop/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestKey: requestKey.current,
          items: cart,
          zoneId,
          expectedTotal: total,
          website: form.get("website"),
          customer: {
            name: form.get("name"),
            phone: form.get("phone"),
            address: form.get("address"),
            notes: form.get("notes"),
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(errorMessage(result.error, locale));
        return;
      }
      setSuccess(result);
      setCart([]);
      requestKey.current = "";
      await refresh();
      document
        .getElementById("pantry-basket")
        ?.scrollIntoView({ behavior: "smooth" });
    } catch {
      setError(errorMessage("unavailable", locale));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="pantry">
      {productId ? (
        <section className="shop-wrap pantry-detail">
          <div className="pantry-detail-nav">
            <Link href="/products" className="pantry-text-link">
              ← {t.back}
            </Link>
            <a href="#pantry-basket" className="pantry-basket-link">
              <ShoppingBag size={20} />
              {t.basket}
              <span>{count}</span>
            </a>
          </div>
          {selectedProduct ? (
            <ProductPanel
              product={selectedProduct}
              locale={locale}
              enabled={data.settings.acceptingOrders}
              busy={busy}
              add={add}
            />
          ) : (
            <p className="shop-notice">{t.sold}</p>
          )}
          <div role="status" className="pantry-live">
            {notice}
            {notice && (
              <a href="#pantry-basket" className="pantry-text-link">
                {t.basket} →
              </a>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="pantry-hero shop-wrap">
            <div className="pantry-hero-copy">
              <p className="shop-eyebrow">{t.eyebrow}</p>
              <h1>{t.title}</h1>
              <p className="pantry-lead">{t.intro}</p>
              <div className="pantry-hero-actions">
              <Link href="/products/reserve" className="shop-button">
                {locale === "fr"
                  ? "Précommander la récolte"
                  : "Pre-order the harvest"}{" "}
                <ArrowRight size={18} />
              </Link>
              <a href="#collection" className="pantry-text-link">
                {t.browse}
                <ArrowDown size={18} />
              </a>
              </div>
              <span className="pantry-origin">
                TESTOUR, TUNISIE · FARM EL BAYA
              </span>
            </div>
            <figure className="pantry-hero-photo">
              <Image
                src="/assets/images/picking_tree_fruits.webp"
                alt={
                  locale === "fr"
                    ? "La récolte des fruits dans les arbres d’El Baya"
                    : "Picking fruit from the trees at El Baya"
                }
                fill
                sizes="(min-width: 900px) 48vw, 100vw"
                preload
                className="object-cover"
              />
              <figcaption>
                {locale === "fr"
                  ? "Les mains dans les arbres. Les pieds sur terre."
                  : "Hands in the trees. Feet on the ground."}
              </figcaption>
            </figure>
          </section>
          <div className="pantry-promises shop-wrap">
            <span>
              <Sprout size={19} />
              {t.directTitle}
            </span>
            <span>
              <Truck size={19} />
              {t.deliveryTitle}
            </span>
            <span>
              <Banknote size={19} />
              {t.cashTitle}
            </span>
          </div>
          <section id="collection" className="shop-wrap pantry-collection">
            <div className="pantry-section-heading">
              <div>
                <p className="shop-eyebrow">{t.collection}</p>
                <h2>{t.harvest}</h2>
              </div>
              <a href="#pantry-basket" className="pantry-basket-link">
                <ShoppingBag size={20} />
                {t.basket}
                <span>{count}</span>
              </a>
            </div>
            {!data.settings.acceptingOrders && (
              <p className="shop-notice">
                {locale === "fr"
                  ? "Les prix se préparent. Vous pouvez déjà envoyer une demande de précommande."
                  : "Prices are being prepared. You can already send a pre-order request."}{" "}
                <Link href="/products/reserve" className="pantry-text-link">
                  {locale === "fr" ? "Faire ma demande →" : "Send a request →"}
                </Link>
              </p>
            )}
            {new Set(data.products.map((p) => p.category)).size > 1 && (
              <div className="pantry-filters" aria-label={t.collection}>
                {(["all", "fruit", "oil", "honey", "other"] as const)
                  .filter(
                    (c) =>
                      c === "all" ||
                      data.products.some((p) => p.category === c),
                  )
                  .map((c) => (
                    <button
                      key={c}
                      aria-pressed={filter === c}
                      onClick={() => setFilter(c)}
                    >
                      {c === "all" ? t.all : t[c]}
                    </button>
                  ))}
              </div>
            )}
            <div role="status" className="pantry-live">
              {notice}
            </div>
            <div className="pantry-grid">
              {data.products
                .filter((p) => filter === "all" || p.category === filter)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                  />
                ))}
            </div>
            {!data.products.length && <p className="shop-notice">{t.paused}</p>}
          </section>
        </>
      )}
      <section id="pantry-basket" className="pantry-checkout shop-wrap">
        <div>
          <p className="shop-eyebrow">
            {locale === "fr"
              ? "UN PEU D’EL BAYA CHEZ VOUS"
              : "A LITTLE EL BAYA AT HOME"}
          </p>
          <h2>{t.basket}</h2>
          <p className="pantry-description">{t.deliveryHelp}</p>
          <WhatsAppLink
            locale={locale}
            message={
              locale === "fr"
                ? "Bonjour, j’ai une question sur les produits de la ferme."
                : "Hello, I have a question about the farm products."
            }
            className="pantry-text-link"
          >
            {t.contact}
            <ArrowRight size={17} />
          </WhatsAppLink>
        </div>
        <div className="pantry-basket-panel">
          {success ? (
            <div className="pantry-success" role="status">
              <Check size={32} />
              <h3>
                {success.preorder ? t.preorderConfirmation : t.confirmation}
              </h3>
              <p>
                {success.id} · {money(success.total, locale)}
              </p>
              <p>
                {success.preorder ? t.preorderConfirmHelp : t.confirmationHelp}
              </p>
              <a className="pantry-text-link" href="#collection">
                {t.continue}
                <ArrowRight size={17} />
              </a>
            </div>
          ) : !cart.length ? (
            <div className="pantry-empty">
              <ShoppingBag size={36} strokeWidth={1} />
              <h3>{t.empty}</h3>
              <p>{t.emptyHelp}</p>
            </div>
          ) : (
            <>
              <div className="pantry-basket-items">
                {lines.map(({ item, product, variant }) => (
                  <div
                    className="pantry-basket-item"
                    key={`${item.productId}/${item.variantId}`}
                  >
                    <div>
                      <strong>
                        {product
                          ? localized(product.name, locale)
                          : locale === "fr"
                            ? "Produit indisponible"
                            : "Unavailable product"}
                      </strong>
                      <span>
                        {variant?.label || "—"} · ×{item.quantity}
                        {item.fulfillment === "preorder" && (
                          <> · {t.preorder}</>
                        )}
                      </span>
                      {(!variant ||
                        !product ||
                        capacity(product, variant) < item.quantity ||
                        !orderable(product) ||
                        fulfillment(product) !==
                          (item.fulfillment || "ready")) && (
                        <span className="shop-error">{t.sold}</span>
                      )}
                    </div>
                    <span>
                      {money((variant?.price || 0) * item.quantity, locale)}
                    </span>
                    <button
                      disabled={busy}
                      title={t.remove}
                      aria-label={`${t.remove} ${product ? localized(product.name, locale) : ""}`}
                      onClick={() => changeCart(cart.filter((i) => i !== item))}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {hasPreorder && (
                <div className="pantry-reservation">
                  <strong>{t.preorderTitle}</strong>
                  <p>{t.mixedHelp}</p>
                  {lines
                    .filter((l) => l.item.fulfillment === "preorder")
                    .map(
                      (l) =>
                        l.product?.preorderNote && (
                          <p key={l.item.productId + l.item.variantId}>
                            {localized(l.product.name, locale)}:{" "}
                            {localized(l.product.preorderNote, locale)}
                          </p>
                        ),
                    )}
                </div>
              )}
              <p className="pantry-small">{t.savedBasket}</p>
              <form
                onSubmit={submit}
                onChange={() => {
                  requestKey.current = "";
                }}
              >
                <fieldset disabled={busy} className="pantry-checkout-fields">
                  <legend>{t.checkout}</legend>
                  <div className="shop-two">
                    <label>
                      {t.name}
                      <input
                        className="field"
                        name="name"
                        autoComplete="name"
                        maxLength={100}
                        required
                      />
                    </label>
                    <label>
                      {t.phone}
                      <input
                        className="field"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+216"
                        maxLength={30}
                        required
                      />
                    </label>
                  </div>
                  <label>
                    {t.zone}
                    <select
                      className="field"
                      required
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                    >
                      <option value="">{t.choose}</option>
                      {data.settings.zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} · {money(z.fee, locale)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {t.address}
                    <textarea
                      className="field"
                      name="address"
                      autoComplete="street-address"
                      maxLength={500}
                      rows={2}
                      required
                    />
                  </label>
                  <label>
                    {t.notes}
                    <textarea
                      className="field"
                      name="notes"
                      maxLength={1000}
                      rows={2}
                    />
                  </label>
                  <div className="shop-honey" aria-hidden="true">
                    <label>
                      Website
                      <input name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                </fieldset>
                <div className="pantry-totals">
                  <p>
                    <span>{t.subtotal}</span>
                    <span>{money(subtotal, locale)}</span>
                  </p>
                  <p>
                    <span>{t.delivery}</span>
                    <span>{zone ? money(zone.fee, locale) : "—"}</span>
                  </p>
                  <p className="pantry-total">
                    <strong>{t.total}</strong>
                    <strong>{zone ? money(total, locale) : "—"}</strong>
                  </p>
                </div>
                {!data.settings.acceptingOrders && (
                  <p className="shop-error">{errorMessage("closed", locale)}</p>
                )}
                {invalid && (
                  <p className="shop-error">{errorMessage("stock", locale)}</p>
                )}
                {error && (
                  <p role="alert" className="shop-error">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  className="pantry-text-link"
                  disabled={busy}
                  onClick={refresh}
                >
                  {t.refresh}
                </button>
                <button
                  className="shop-button pantry-submit"
                  disabled={
                    busy || invalid || !zone || !data.settings.acceptingOrders
                  }
                >
                  {busy ? t.sending : hasPreorder ? t.preorderSubmit : t.submit}
                  <ArrowRight size={18} />
                </button>
                <p className="pantry-small">{t.privacy}</p>
              </form>
            </>
          )}
        </div>
      </section>
      <section className="pantry-story shop-wrap">
        <div className="pantry-story-photo">
          <Image
            src="/assets/images/figs_and_olive_oil.webp"
            alt={
              locale === "fr"
                ? "Une figue fraîche partagée à la table de la ferme"
                : "A fresh fig shared at the farm table"
            }
            fill
            sizes="(min-width: 900px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="shop-eyebrow">FARM EL BAYA · TESTOUR</p>
          <h2>{t.story}</h2>
          <p className="pantry-description">{t.storyText}</p>
          <Link href="/farm" className="pantry-text-link">
            {t.farm}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <div className="shop-wrap pantry-explainer">
        {[
          [Truck, t.deliveryTitle, t.deliveryHelp],
          [Banknote, t.cashTitle, t.cashHelp],
          [Sprout, t.directTitle, t.directHelp],
        ].map(([Icon, title, description], index) => {
          const I = Icon as typeof Truck;
          return (
            <div key={index}>
              <I size={23} strokeWidth={1.5} />
              <h3>{String(title)}</h3>
              <p>{String(description)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
