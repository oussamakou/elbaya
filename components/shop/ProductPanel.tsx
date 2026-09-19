"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  Clock3,
  Minus,
  Plus,
  Sprout,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  capacity,
  localized,
  money,
  orderable,
  type Product,
} from "@/lib/shop/types";
import { copy } from "./copy";

function productStatus(product: Product, locale: "fr" | "en") {
  const t = copy[locale];
  if (product.status === "preorder") return t.preorder;
  if (product.status === "seasonal") return t.seasonal;
  return product.variants.some((v) => v.stock > 0) ? t.available : t.sold;
}
export function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: "fr" | "en";
}) {
  const t = copy[locale];
  const prices = product.variants.map((v) => v.price).filter((p) => p > 0);
  const href = `/products/${product.id}`;
  return (
    <article className="pantry-product pantry-card">
      <Link
        href={href}
        className="pantry-product-photo"
        aria-label={`${t.details} · ${localized(product.name, locale)}`}
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={localized(product.name, locale)}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 700px) 45vw, 100vw"
            unoptimized={product.images[0].startsWith("/api/")}
            className="object-cover"
          />
        ) : (
          <Sprout size={56} strokeWidth={1} />
        )}
        <span className="pantry-status">{productStatus(product, locale)}</span>
      </Link>
      <div className="pantry-product-heading">
        <h3>
          <Link href={href}>{localized(product.name, locale)}</Link>
        </h3>
      </div>
      <p className="pantry-card-formats">
        {product.variants.map((v) => v.label).join(" · ")}
        <span>
          {prices.length
            ? `${locale === "fr" ? "Dès" : "From"} ${money(Math.min(...prices), locale)}`
            : t.priceSoon}
        </span>
      </p>
      <p className="pantry-description">
        {localized(product.description, locale)}
      </p>
      <Link href={href} className="pantry-text-link">
        {t.details}
        <ArrowRight size={17} />
      </Link>
    </article>
  );
}
export default function ProductPanel({
  product,
  locale,
  enabled,
  busy,
  add,
}: {
  product: Product;
  locale: "fr" | "en";
  enabled: boolean;
  busy: boolean;
  add: (p: Product, variantId: string, count: number) => void;
}) {
  const t = copy[locale];
  const [selected, setSelected] = useState(
    product.variants.find((v) => capacity(product, v) > 0)?.id ||
      product.variants[0]?.id,
  );
  const [photo, setPhoto] = useState(0),
    [quantity, setQuantity] = useState(1);
  const variant =
    product.variants.find((v) => v.id === selected) || product.variants[0];
  const available = variant ? capacity(product, variant) : 0;
  const sellable =
    enabled && orderable(product) && available > 0 && variant.price > 0;
  const preorder = product.status === "preorder";
  const src = product.images[photo] || product.images[0];
  return (
    <article className="pantry-product-detail">
      <div className="pantry-detail-gallery">
        <div className="pantry-product-photo">
          {src ? (
            <Image
              src={src}
              alt={localized(product.name, locale)}
              fill
              sizes="(min-width: 900px) 48vw, 100vw"
              preload
              unoptimized={src.startsWith("/api/")}
              className="object-cover"
            />
          ) : (
            <Sprout size={64} strokeWidth={1} />
          )}
          <span className="pantry-status">
            {productStatus(product, locale)}
          </span>
        </div>
        {product.images.length > 1 && (
          <div className="pantry-thumbnails">
            {product.images.map((image, i) => (
              <button
                key={image}
                aria-label={`Photo ${i + 1}`}
                aria-pressed={i === photo}
                onClick={() => setPhoto(i)}
              >
                <Image
                  src={image}
                  width={64}
                  height={64}
                  alt=""
                  unoptimized={image.startsWith("/api/")}
                />
              </button>
            ))}
          </div>
        )}
        <p className="pantry-small">FARM EL BAYA · TESTOUR, TUNISIE</p>
      </div>
      <div className="pantry-detail-content">
        <p className="shop-eyebrow">
          {t.collection} / {t[product.category]}
        </p>
        <h1>{localized(product.name, locale)}</h1>
        <p className="pantry-detail-price">
          {variant?.price ? money(variant.price, locale) : t.priceSoon}
          <span>{variant?.label}</span>
        </p>
        <p className="pantry-description">
          {localized(product.description, locale)}
        </p>
        {preorder && (
          <div className="pantry-reservation">
            <div>
              <Clock3 size={18} />
              <strong>{t.preorderTitle}</strong>
            </div>
            <p>
              {product.preorderNote
                ? localized(product.preorderNote, locale)
                : ""}
            </p>
            <p>{t.preorderHelp}</p>
          </div>
        )}
        <fieldset className="pantry-formats">
          <legend>{t.format}</legend>
          {product.variants.map((v) => (
            <button
              key={v.id}
              aria-pressed={variant?.id === v.id}
              onClick={() => {
                setSelected(v.id);
                setQuantity(1);
              }}
            >
              {v.label}
            </button>
          ))}
        </fieldset>
        {orderable(product) && (
          <p className="pantry-stock">
            {available} {preorder ? t.reserveStock : t.stock}
          </p>
        )}
        <div className="pantry-add-row">
          {sellable && (
            <div className="pantry-stepper">
              <button
                disabled={busy || quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label={`${t.quantity} −`}
              >
                <Minus size={16} />
              </button>
              <output aria-label={t.quantity}>{quantity}</output>
              <button
                disabled={busy || quantity >= Math.min(available, 99)}
                onClick={() =>
                  setQuantity((q) => Math.min(available, 99, q + 1))
                }
                aria-label={`${t.quantity} +`}
              >
                <Plus size={16} />
              </button>
            </div>
          )}
          {sellable ? (
            <button
              className="shop-button"
              disabled={busy || !sellable}
              onClick={() => add(product, variant.id, quantity)}
            >
              {sellable
                ? preorder
                  ? t.reserve
                  : t.add
                : product.status === "seasonal"
                  ? t.later
                  : !enabled
                    ? locale === "fr"
                      ? "Commandes en pause"
                      : "Orders paused"
                    : t.sold}
              {sellable && <Plus size={18} />}
            </button>
          ) : (
            <Link
              href={`/products/reserve?product=${product.id}`}
              className="shop-button"
            >
              {locale === "fr"
                ? "Demander une précommande"
                : "Request a pre-order"}
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
        {product.status === "seasonal" && (
          <p className="pantry-small">
            {locale === "fr"
              ? "Mehdi vous appelle pour confirmer le prix et la prochaine disponibilité."
              : "Mehdi will call to confirm the price and next availability."}
          </p>
        )}
        <div className="pantry-detail-payment">
          <Banknote size={20} />
          <p>
            {t.cashTitle}
            <span>{t.cashHelp}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
