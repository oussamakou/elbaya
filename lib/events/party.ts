// Who a guest brings to Pomegranate Day. Client-safe (no server imports): shared by the form, the API and the dashboard.
export type PartyType = 'alone' | 'family' | 'friend';
export type FamilyRelation = 'partner' | 'child' | 'parent' | 'sibling' | 'relative';
export type Relation = FamilyRelation | 'friend';
export type Companion = {name: string; relation: Relation};
export type Party = {type: PartyType; people: Companion[]};

export const MAX_FAMILY = 4;
export const MAX_FRIENDS = 1;
export const FAMILY_RELATIONS: FamilyRelation[] = ['partner', 'child', 'parent', 'sibling', 'relative'];
export const relationEn: Record<Relation, string> = {
  partner: 'Partner',
  child: 'Child',
  parent: 'Parent',
  sibling: 'Brother / sister',
  relative: 'Other family',
  friend: 'Friend',
};
export const relationFr: Record<Relation, string> = {
  partner: 'conjoint·e',
  child: 'enfant',
  parent: 'parent',
  sibling: 'frère / sœur',
  relative: 'famille',
  friend: 'ami·e',
};

// People in a request: the guest plus everyone they bring.
export const partySize = (party?: Party) => 1 + (party?.people.length || 0);

export function partyLineFr(party?: Party) {
  if (!party || party.type === 'alone' || !party.people.length) return 'Vient seul·e';
  const who = party.people.map((p) => `${p.name} (${relationFr[p.relation]})`).join(', ');
  return `${party.type === 'family' ? 'En famille' : 'Avec un·e ami·e'} · ${partySize(party)} personnes : ${who}`;
}
