// All amounts are millimes. Every product is sold by request with pickup, paid at pickup:
// a request is a single pickup appointment, not ready-stock allocation.
export const FARM_MAP = 'https://www.google.com/maps/search/?api=1&query=Farm%20Elbaya%20Testour';
// Pomegranates are priced by weight with cheaper tiers; every other product sells its sizes as fixed-price packs.
export type PricingMode = 'weight' | 'packs';
export const pricingMode = (product: {id: string}): PricingMode => (product.id === 'pomegranates' ? 'weight' : 'packs');
// The request snapshot, stored under `harvest` on a request (named when only pomegranates used it).
// weight: kg; packs: quantity × label. total is what the customer pays; subtotal and discount exist only with a promo code.
// preorder and availability record a Précommande request and the estimate shown at the time.
export type HarvestSelection = {kg?: number; quantity?: number; label?: string; unitPrice: number; total: number; pickup: 'farm' | 'tunis'; subtotal?: number; discount?: number; promoCode?: string; preorder?: boolean; availability?: string};
// A promo code as the browser and the request need it: the rule, never usage counts.
export type PromoRule = {code: string; kind: 'percent' | 'amount'; value: number};
// Percent discounts round down to 100 millimes so totals stay readable (e.g. 72,500 DT, not 72,450 DT).
export function promoDiscount(subtotal: number, rule: PromoRule) {
  const raw = rule.kind === 'percent' ? Math.floor((subtotal * rule.value) / 100 / 100) * 100 : rule.value;
  return Math.max(0, Math.min(raw, subtotal));
}
// Request settings for any product. The per-kg prices apply only to weight pricing.
export type HarvestOffer = {enabled:boolean; baseUnitPrice:number; bulkUnitPrice:number; largeUnitPrice?:number; pickupFarm:boolean; pickupTunis:boolean; showStories?:boolean};
export const DEFAULT_HARVEST_OFFER:HarvestOffer = {enabled:true,baseUnitPrice:5000,bulkUnitPrice:4500,largeUnitPrice:4000,pickupFarm:true,pickupTunis:true};
// Pack products without saved settings start paused: nothing is requestable until prices are set and requests opened.
export const DEFAULT_PACK_OFFER:HarvestOffer = {enabled:false,baseUnitPrice:0,bulkUnitPrice:0,largeUnitPrice:0,pickupFarm:true,pickupTunis:true,showStories:false};
export function harvestOffer(product:{id:string; harvestOffer?:HarvestOffer}):HarvestOffer & {largeUnitPrice:number} {
  const offer=product.harvestOffer || (pricingMode(product)==='weight' ? DEFAULT_HARVEST_OFFER : DEFAULT_PACK_OFFER);
  return {...offer,largeUnitPrice:offer.largeUnitPrice ?? Math.min(4000,offer.bulkUnitPrice)};
}
// What a visitor can do with a product. Masqué (draft), Commande (available now),
// Précommande (upcoming harvest, reserve now) or Épuisé (waitlist only).
export type SaleState = 'hidden' | 'order' | 'preorder' | 'soldout';
export function saleState(product:{id:string; status:string; harvestOffer?:HarvestOffer}):SaleState {
  if (product.status === 'draft') return 'hidden';
  if (product.status === 'available') return 'order';
  if (product.status === 'preorder') return 'preorder';
  if (product.status === 'soldout') return 'soldout';
  // 'seasonal' predates per-product states: it took requests only while the request switch was on.
  return harvestOffer(product).enabled ? 'order' : 'soldout';
}
export const requestable = (product:{id:string; status:string; harvestOffer?:HarvestOffer}) => {
  const state = saleState(product);
  return state === 'order' || state === 'preorder';
};
export function harvestQuote(kg: number, offer:HarvestOffer = DEFAULT_HARVEST_OFFER) {
  if (!Number.isSafeInteger(kg) || kg < 5 || kg > 500 || kg % 5 !== 0) throw new Error('invalid_weight');
  const unitPrice = kg >= 20 ? (offer.largeUnitPrice ?? Math.min(4000,offer.bulkUnitPrice)) : kg >= 10 ? offer.bulkUnitPrice : offer.baseUnitPrice;
  return {kg, unitPrice, total: kg * unitPrice};
}
export function packQuote(variant: {label: string; price: number}, quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('invalid_quantity');
  return {quantity, label: variant.label, unitPrice: variant.price, total: variant.price * quantity};
}
// "20 kg" or "2 × 1 L": how a request reads in the inbox, emails and print list.
export function selectionLabel(selection: HarvestSelection) {
  return selection.kg !== undefined ? `${selection.kg} kg` : `${selection.quantity} × ${selection.label}`;
}
export function pickupLabel(pickup: 'farm' | 'tunis', fr = true) {
  return pickup === 'farm' ? (fr ? 'Retrait à la ferme · Testour' : 'Farm pickup · Testour') : (fr ? 'Retrait à Tunis · adresse à confirmer par téléphone' : 'Tunis pickup · address confirmed by phone');
}
