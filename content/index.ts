import enHome from './en/home.json';
import frHome from './fr/home.json';
import enStay from './en/stay.json';
import frStay from './fr/stay.json';
import enFarm from './en/farm.json';
import frFarm from './fr/farm.json';
import enExperiences from './en/experiences.json';
import frExperiences from './fr/experiences.json';
import enForge from './en/forge.json';
import frForge from './fr/forge.json';
import enBook from './en/book.json';
import frBook from './fr/book.json';

export type Locale = 'en' | 'fr';
export type PageKey = 'home' | 'stay' | 'farm' | 'experiences' | 'forge' | 'book';

const content = {
  en: {home: enHome, stay: enStay, farm: enFarm, experiences: enExperiences, forge: enForge, book: enBook},
  fr: {home: frHome, stay: frStay, farm: frFarm, experiences: frExperiences, forge: frForge, book: frBook}
};

export function getContent<T extends PageKey>(locale: string, page: T) {
  const safeLocale = locale === 'fr' ? 'fr' : 'en';
  return content[safeLocale][page];
}

export const photos = [
  'breakfast.webp',
  'room-interior.webp',
  'trail_in_thefarm.webp',
  'startgazing_nightsky.webp',
  'room_exterior_vibe.webp',
  'pullups_dips_bars_in_thefarm.webp',
  'mouvement_research.png',
  'handstand_practice.png',
  'kids_training.png',
  'outside_kitchen_fireplace.webp',
  'open_air_kitchen.webp',
  'livestock.webp',
  'beekeeping_activity.webp',
  'baby_goat_looking_at_camera.webp',
  'rooftop_nightsky.webp'
];

export function img(name: string) {
  return `/assets/images/${name}`;
}
