// All amounts are millimes. One selection is a single pickup request, not ready-stock allocation.
export const FARM_MAP = 'https://www.google.com/maps/search/?api=1&query=Farm%20Elbaya%20Testour';
export type HarvestSelection = {kg: number; unitPrice: number; total: number; pickup: 'farm' | 'tunis'};
export function harvestQuote(kg: number) {
  if (!Number.isSafeInteger(kg) || kg < 5 || kg > 500 || kg % 5 !== 0) throw new Error('invalid_weight');
  const unitPrice = kg >= 10 ? 4500 : 5000;
  return {kg, unitPrice, total: kg * unitPrice};
}
export function pickupLabel(pickup: 'farm' | 'tunis', fr = true) {
  return pickup === 'farm' ? (fr ? 'Retrait à la ferme · Testour' : 'Farm pickup · Testour') : (fr ? 'Retrait à Tunis · adresse à confirmer par téléphone' : 'Tunis pickup · address confirmed by phone');
}
