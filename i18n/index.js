import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import fr from './locales/fr.json';
import en from './locales/en.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import zh from './locales/zh.json';

const languageTag = Localization.getLocales()[0]?.languageTag || 'en';
const languageCode = languageTag.split('-')[0];
const supportedLanguages = ['fr', 'en', 'es', 'ar', 'zh'];
const detectedLang = supportedLanguages.includes(languageCode) ? languageCode : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      es: { translation: es },
      ar: { translation: ar },
      zh: { translation: zh },
    },
    lng: detectedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
  });

export default i18n;
