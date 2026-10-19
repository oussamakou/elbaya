import type {Product, ShopSettings} from './types';
import {DEFAULT_HARVEST_OFFER, DEFAULT_PACK_OFFER, pricingMode, type HarvestOffer} from './harvest';
export class ShopError extends Error {
  constructor(
    public code: string,
    public status = 400,
  ) {
    super(code);
  }
}
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new ShopError('invalid');
  return value as Record<string, unknown>;
}
export function text(value: unknown, max: number, required = true): string {
  if (
    typeof value !== 'string' ||
    value.length > max ||
    (required && !value.trim())
  )
    throw new ShopError('invalid');
  return value.trim();
}
export function integer(value: unknown, min = 0, max = 100000000): number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < min ||
    value > max
  )
    throw new ShopError('invalid');
  return value;
}
export function id(value: unknown) {
  const result = text(value, 80);
  if (!/^[a-zA-Z0-9_-]+$/.test(result)) throw new ShopError('invalid');
  return result;
}
function translation(value: unknown, required = true) {
  const o = object(value);
  return {fr: text(o.fr, 2000, required), en: text(o.en, 2000, false)};
}
export function productInput(value: unknown): Product {
  const o = object(value);
  // Request settings for every product. The status alone opens or closes requests
  // (Commande/Précommande open; Masqué/Épuisé closed); 'enabled' mirrors it for older records.
  const weight = pricingMode({id: String(o.id)}) === 'weight';
  let harvestOffer:HarvestOffer;
  {
    const h=o.harvestOffer===undefined?(weight?DEFAULT_HARVEST_OFFER:DEFAULT_PACK_OFFER):object(o.harvestOffer);
    if(typeof h.enabled!=='boolean'||typeof h.pickupFarm!=='boolean'||typeof h.pickupTunis!=='boolean')throw new ShopError('invalid');
    harvestOffer=weight
      ? {enabled:h.enabled,baseUnitPrice:integer(h.baseUnitPrice,1,1000000),bulkUnitPrice:integer(h.bulkUnitPrice,1,1000000),pickupFarm:h.pickupFarm,pickupTunis:h.pickupTunis}
      : {enabled:h.enabled,baseUnitPrice:0,bulkUnitPrice:0,largeUnitPrice:0,pickupFarm:h.pickupFarm,pickupTunis:h.pickupTunis};
    if(weight)harvestOffer.largeUnitPrice=integer(h.largeUnitPrice ?? Math.min(4000,harvestOffer.bulkUnitPrice),1,1000000);
    if(h.showStories!==undefined){if(typeof h.showStories!=='boolean')throw new ShopError('invalid');harvestOffer.showStories=h.showStories;}
    if(o.status!=='seasonal')harvestOffer.enabled=o.status==='available'||o.status==='preorder';
    if((weight&&(harvestOffer.largeUnitPrice!>harvestOffer.bulkUnitPrice || harvestOffer.bulkUnitPrice>harvestOffer.baseUnitPrice)) || (harvestOffer.enabled&&!harvestOffer.pickupFarm&&!harvestOffer.pickupTunis))throw new ShopError('invalid');
  }
  if (
    !['draft', 'available', 'seasonal', 'preorder', 'soldout'].includes(
      String(o.status),
    ) ||
    !['fruit', 'oil', 'honey', 'other'].includes(String(o.category))
  )
    throw new ShopError('invalid');
  if (
    !Array.isArray(o.variants) ||
    !o.variants.length ||
    o.variants.length > 12 ||
    !Array.isArray(o.images) ||
    o.images.length > 6
  )
    throw new ShopError('invalid');
  const variants = o.variants.map((v) => {
    const row = object(v);
    return {
      id: id(row.id),
      label: text(row.label, 80),
      price: integer(row.price),
      stock: integer(row.stock, 0, 100000),
      preorderStock: integer(row.preorderStock ?? 0, 0, 100000),
    };
  });
  if (new Set(variants.map((v) => v.id)).size !== variants.length)
    throw new ShopError('invalid');
  // A pack product taking requests needs at least one priced size; unpriced sizes are not offered.
  if (!weight && harvestOffer.enabled && !variants.some((v) => v.price > 0))
    throw new ShopError('price_required');
  // Précommande may carry an estimated availability ("Récolte prévue mi-novembre"); optional.
  const preorderNote = o.preorderNote
    ? translation(o.preorderNote, false)
    : {fr: '', en: ''};
  const images = o.images.map((image) => {
    const s = text(image, 200);
    if (
      !/^\/api\/shop\/images\/[a-f0-9-]+$/.test(s) &&
      ![
        '/assets/shop/pomegranate.svg',
        '/assets/shop/olive.svg',
        '/assets/shop/honey.svg',
      ].includes(s)
    )
      throw new ShopError('invalid');
    return s;
  });
  return {
    id: id(o.id),
    revision: integer(o.revision),
    name: translation(o.name),
    description: translation(o.description),
    category: o.category as Product['category'],
    status: o.status as Product['status'],
    variants,
    images,
    preorderNote,
    harvestOffer,
  };
}
export function settingsInput(value: unknown): ShopSettings {
  const o = object(value);
  if (
    typeof o.acceptingOrders !== 'boolean' ||
    !Array.isArray(o.zones) ||
    o.zones.length > 50
  )
    throw new ShopError('invalid');
  const zones = o.zones.map((z) => {
    const row = object(z);
    return {
      id: id(row.id),
      name: text(row.name, 100),
      fee: integer(row.fee, 0, 1000000),
    };
  });
  if (
    new Set(zones.map((z) => z.id)).size !== zones.length ||
    (o.acceptingOrders && !zones.length)
  )
    throw new ShopError('zones_required');
  return {
    revision: integer(o.revision),
    acceptingOrders: o.acceptingOrders,
    zones,
  };
}
