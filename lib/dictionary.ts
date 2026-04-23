import 'server-only';

const dictionaries = {
  es: () => import('../dictionaries/es.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  fr: () => import('../dictionaries/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const validLocale = (locale === 'en' || locale === 'fr') ? locale : 'es';
  return dictionaries[validLocale]?.() ?? dictionaries.es();
};
