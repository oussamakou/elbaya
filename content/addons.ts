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
    {id: 'breakfast', category: 'meals', title: 'Farm breakfast', description: 'Prepared fresh each morning from the farm and nearby producers.', price: '20 DT / €6 per guest, per day'},
    {id: 'lunch', category: 'meals', title: 'Home-cooked lunch', description: 'Local ingredients; request in advance.', price: '40 DT / €12 per guest'},
    {id: 'dinner', category: 'meals', title: 'Dinner with the family', description: 'A traditional dinner prepared at the farm; request in advance.', price: '40 DT / €12 per guest'},
    {id: 'kids-meal', category: 'meals', title: 'Kids meal', description: 'A half portion for children aged 5 to 12.', price: '20 DT / €6 per child'},
    {id: 'training', category: 'experiences', title: 'Training session with Mahdi', description: 'A 90-minute assessment, training session, and practical plan to take home.', price: '70 DT / €21 per guest', experienceLabel: 'Arrange ahead'},
    {id: 'beekeeping', category: 'experiences', title: 'Beekeeping visit', description: 'Suit up for a guided hive visit and learn how the bees live and how the honey is made.', price: '40 DT / €12 per guest', experienceLabel: 'Arrange ahead'},
    {id: 'olive-harvest', category: 'experiences', title: 'Olive harvest', description: 'Join the family harvest from October to December. Olive oil is available separately.', price: '50 DT / €15 per guest', experienceLabel: 'October to December'},
    {id: 'cooking', category: 'experiences', title: 'Cooking with the family', description: 'Prepare bread and local dishes around the open-air kitchen; the shared meal is included.', price: '70 DT / €21 per guest', experienceLabel: 'Arrange ahead'},
    {id: 'tour', category: 'outing', title: 'Private Testour and Dougga tour', description: 'Explore the Andalusian town and Roman city with a local guide.', price: '€74 per booking through Lodgify', experienceLabel: 'Private outing'}
  ],
  fr: [
    {id: 'breakfast', category: 'meals', title: 'Petit-déjeuner de la ferme', description: 'Préparé chaque matin avec les produits de la ferme et des producteurs voisins.', price: '20 DT / 6 € par personne et par jour'},
    {id: 'lunch', category: 'meals', title: 'Déjeuner maison', description: 'Produits locaux ; à demander à l’avance.', price: '40 DT / 12 € par personne'},
    {id: 'dinner', category: 'meals', title: 'Dîner avec la famille', description: 'Un dîner traditionnel préparé à la ferme ; à demander à l’avance.', price: '40 DT / 12 € par personne'},
    {id: 'kids-meal', category: 'meals', title: 'Repas enfant', description: 'Une demi-portion pour les enfants de 5 à 12 ans.', price: '20 DT / 6 € par enfant'},
    {id: 'training', category: 'experiences', title: 'Séance avec Mahdi', description: 'Un bilan, une séance de 90 minutes et un plan pratique à emporter.', price: '70 DT / 21 € par personne', experienceLabel: 'À organiser'},
    {id: 'beekeeping', category: 'experiences', title: 'Visite des ruches', description: 'Enfilez la tenue pour une visite guidée et découvrez la vie des abeilles et la fabrication du miel.', price: '40 DT / 12 € par personne', experienceLabel: 'À organiser'},
    {id: 'olive-harvest', category: 'experiences', title: 'Récolte des olives', description: 'Participez à la récolte familiale d’octobre à décembre. L’huile d’olive est disponible séparément.', price: '50 DT / 15 € par personne', experienceLabel: 'Octobre à décembre'},
    {id: 'cooking', category: 'experiences', title: 'Cuisine en famille', description: 'Préparez le pain et des plats locaux autour de la cuisine extérieure ; le repas partagé est inclus.', price: '70 DT / 21 € par personne', experienceLabel: 'À organiser'},
    {id: 'tour', category: 'outing', title: 'Visite privée de Testour et Dougga', description: 'Découvrez la ville andalouse et la cité romaine avec un guide local.', price: '74 € par réservation via Lodgify', experienceLabel: 'Sortie privée'}
  ]
};

export function getAddons(locale: string) {
  return catalogs[locale === 'fr' ? 'fr' : 'en'];
}

export function getBookableExperiences(locale: string) {
  return getAddons(locale).filter((addon) => addon.category !== 'meals');
}
