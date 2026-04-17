import 'server-only';

const dictionaries = {
  es: () => import('../dictionaries/es.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  fr: () => import('../dictionaries/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'es' | 'en' | 'fr') => {
  return dictionaries[locale]?.() ?? dictionaries.es();
};
