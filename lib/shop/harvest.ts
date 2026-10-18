// All amounts are millimes. One selection is a single pickup request, not ready-stock allocation.
export const FARM_MAP = 'https://www.google.com/maps/search/?api=1&query=Farm%20Elbaya%20Testour';
export type HarvestSelection = {kg: number; unitPrice: number; total: number; pickup: 'farm' | 'tunis'};
export type HarvestOffer = {enabled:boolean; baseUnitPrice:number; bulkUnitPrice:number; largeUnitPrice?:number; pickupFarm:boolean; pickupTunis:boolean; showStories?:boolean};
export const DEFAULT_HARVEST_OFFER:HarvestOffer = {enabled:true,baseUnitPrice:5000,bulkUnitPrice:4500,largeUnitPrice:4000,pickupFarm:true,pickupTunis:true};
export function harvestOffer(product:{harvestOffer?:HarvestOffer}):HarvestOffer & {largeUnitPrice:number} {
  const offer=product.harvestOffer || DEFAULT_HARVEST_OFFER;
  return {...offer,largeUnitPrice:offer.largeUnitPrice ?? Math.min(4000,offer.bulkUnitPrice)};
}
export function harvestQuote(kg: number, offer:HarvestOffer = DEFAULT_HARVEST_OFFER) {
  if (!Number.isSafeInteger(kg) || kg < 5 || kg > 500 || kg % 5 !== 0) throw new Error('invalid_weight');
  const unitPrice = kg >= 20 ? (offer.largeUnitPrice ?? Math.min(4000,offer.bulkUnitPrice)) : kg >= 10 ? offer.bulkUnitPrice : offer.baseUnitPrice;
  return {kg, unitPrice, total: kg * unitPrice};
}
export function pickupLabel(pickup: 'farm' | 'tunis', fr = true) {
  return pickup === 'farm' ? (fr ? 'Retrait à la ferme · Testour' : 'Farm pickup · Testour') : (fr ? 'Retrait à Tunis · adresse à confirmer par téléphone' : 'Tunis pickup · address confirmed by phone');
}
