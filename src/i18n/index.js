import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import zhHant from './locales/zh-Hant/translation.json';
import zhHans from './locales/zh-Hans/translation.json';
import es from './locales/es/translation.json';
import fr from './locales/fr/translation.json';
import ja from './locales/ja/translation.json';
import ko from './locales/ko/translation.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh-Hant', label: '繁體中文' },
  { code: 'zh-Hans', label: '简体中文' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'zh-Hant': { translation: zhHant },
      'zh-Hans': { translation: zhHans },
      es: { translation: es },
      fr: { translation: fr },
      ja: { translation: ja },
      ko: { translation: ko },
    },
    // matches the pre-i18next default (loadIsEnglish fell back to Chinese)
    fallbackLng: 'zh-Hant',
    supportedLngs: SUPPORTED_LANGUAGES.map(({ code }) => code),
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'luzhanqi:language',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
