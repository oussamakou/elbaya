export type AddonCategory = 'meals' | 'experiences' | 'outing';

export type Addon = {
  id: string;
  category: AddonCategory;
  title: string;
  description: string;
  price: string;
  experienceLabel?: string;
};

type SupportedLocale = 'en' | 'fr';

const catalogs: Record<SupportedLocale, Addon[]> = {
  en: [
    {id: 'breakfast', category: 'meals', title: 'Farm breakfast', description: 'A hearty traditional breakfast. Add it if breakfast is not already included in your rate.', price: '20 DT / €6 per guest, per night'},
    {id: 'lunch', category: 'meals', title: 'Home-cooked lunch', description: 'Local ingredients; request in advance.', price: '40 DT / €12 per guest, per night'},
    {id: 'dinner', category: 'meals', title: 'Dinner with the family', description: 'A traditional dinner prepared at the farm; request in advance.', price: '40 DT / €12 per guest, per night'},
    {id: 'kids-meal', category: 'meals', title: 'Kids meal (5–12)', description: 'A half portion for children aged 5 to 12.', price: '20 DT / €6 per child, per night'},
    {id: 'training', category: 'experiences', title: 'Movement session with Mahdi', description: 'A personalized movement and wellness session with Mahdi.', price: '90 DT / €26 per guest, per stay', experienceLabel: 'Arrange ahead'},
    {id: 'beekeeping', category: 'experiences', title: 'Beekeeping visit', description: 'A guided hive visit from March to July. Protective suits provided; discover bees and honey production.', price: '70 DT / €21 per guest, per stay', experienceLabel: 'March to July'},
    {id: 'olive-harvest', category: 'experiences', title: 'Olive harvest', description: 'Join the family harvest from December to February. Olive oil is available separately.', price: '90 DT / €26 per guest, per stay', experienceLabel: 'December to February'},
    {id: 'cooking', category: 'experiences', title: 'Cooking with the family', description: 'Prepare bread and local dishes around the open-air kitchen; the shared meal is included.', price: '90 DT / €26 per guest, per stay', experienceLabel: 'Arrange ahead'},
    {id: 'tour', category: 'outing', title: 'Private Testour and Dougga tour', description: 'Explore the Andalusian town and Roman city with a local guide.', price: '250 DT / €74 per stay (whole booking)', experienceLabel: 'Private outing'}
  ],
  fr: [
    {id: 'breakfast', category: 'meals', title: 'Petit-déjeuner de la ferme', description: 'Un petit-déjeuner traditionnel copieux, à ajouter s’il n’est pas déjà compris dans votre tarif.', price: '20 DT / 6 € par personne et par nuit'},
    {id: 'lunch', category: 'meals', title: 'Déjeuner maison', description: 'Produits locaux ; à demander à l’avance.', price: '40 DT / 12 € par personne et par nuit'},
    {id: 'dinner', category: 'meals', title: 'Dîner avec la famille', description: 'Un dîner traditionnel préparé à la ferme ; à demander à l’avance.', price: '40 DT / 12 € par personne et par nuit'},
    {id: 'kids-meal', category: 'meals', title: 'Repas enfant (5–12)', description: 'Une demi-portion pour les enfants de 5 à 12 ans.', price: '20 DT / 6 € par enfant et par nuit'},
    {id: 'training', category: 'experiences', title: 'Séance de mouvement avec Mahdi', description: 'Une séance personnalisée de mouvement et de bien-être avec Mahdi.', price: '90 DT / 26 € par personne et par séjour', experienceLabel: 'À organiser'},
    {id: 'beekeeping', category: 'experiences', title: 'Visite des ruches', description: 'Visite guidée des ruches de mars à juillet. Tenues fournies ; découvrez les abeilles et la production du miel.', price: '70 DT / 21 € par personne et par séjour', experienceLabel: 'Mars à juillet'},
    {id: 'olive-harvest', category: 'experiences', title: 'Récolte des olives', description: 'Participez à la récolte familiale de décembre à février. L’huile d’olive est disponible séparément.', price: '90 DT / 26 € par personne et par séjour', experienceLabel: 'Décembre à février'},
    {id: 'cooking', category: 'experiences', title: 'Cuisine en famille', description: 'Préparez le pain et des plats locaux autour de la cuisine extérieure ; le repas partagé est inclus.', price: '90 DT / 26 € par personne et par séjour', experienceLabel: 'À organiser'},
    {id: 'tour', category: 'outing', title: 'Visite privée de Testour et Dougga', description: 'Découvrez la ville andalouse et la cité romaine avec un guide local.', price: '250 DT / 74 € par séjour (toute la réservation)', experienceLabel: 'Sortie privée'}
  ]
};

export function getAddons(locale: string) {
  return catalogs[locale === 'fr' ? 'fr' : 'en'];
}

export function getBookableExperiences(locale: string) {
  return getAddons(locale).filter((addon) => addon.category !== 'meals');
}
