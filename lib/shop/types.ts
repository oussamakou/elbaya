export type LocaleText = { fr: string; en: string };
export type ReservationRequest = {
  governorate?: string;
  city?: string;
  streetAddress?: string;
  id: string;
  revision: number;
  createdAt: string;
  status: "new" | "contacted" | "confirmed" | "cancelled";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  productId: string;
  productName: string;
  variantId: string;
  size: string;
  quantity: number;
  notes: string;
};
export type Variant = {
  id: string;
  label: string;
  price: number;
  stock: number;
  preorderStock?: number;
};
export type Fulfillment = "ready" | "preorder";
export type Product = {
  id: string;
  revision: number;
  name: LocaleText;
  description: LocaleText;
  category: "fruit" | "oil" | "honey" | "other";
  status: "draft" | "available" | "seasonal" | "preorder";
  preorderNote?: LocaleText;
  images: string[];
  variants: Variant[];
};
export type Zone = { id: string; name: string; fee: number };
export type ShopSettings = {
  revision: number;
  acceptingOrders: boolean;
  zones: Zone[];
};
export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  fulfillment?: Fulfillment;
  availability?: string;
};
export type OrderStatus =
  "new" | "confirmed" | "delivering" | "delivered" | "cancelled";
export type Order = {
  id: string;
  createdAt: string;
  revision: number;
  status: OrderStatus;
  paid: boolean;
  customer: { name: string; phone: string; address: string; notes: string };
  zone: string;
  deliveryFee: number;
  total: number;
  items: {
    productId: string;
    variantId: string;
    name: string;
    label: string;
    price: number;
    quantity: number;
    fulfillment?: Fulfillment;
    availability?: string;
  }[];
};
export function capacity(product: Product, variant: Variant) {
  return product.status === "preorder"
    ? variant.preorderStock || 0
    : variant.stock;
}
export function fulfillment(product: Product): Fulfillment {
  return product.status === "preorder" ? "preorder" : "ready";
}
export function orderable(product: Product) {
  return product.status === "available" || product.status === "preorder";
}
// Prices are integer millimes (1 TND = 1,000 millimes), including in storage.
export function money(amount: number, locale = "fr") {
  return `${new Intl.NumberFormat(locale === "fr" ? "fr-TN" : "en", { minimumFractionDigits: amount % 1000 ? 3 : 0, maximumFractionDigits: 3 }).format(amount / 1000)} DT`;
}
export function localized(text: LocaleText, locale: string) {
  return text[locale === "fr" ? "fr" : "en"] || text.fr || text.en;
}
