import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// languages whose board tiles use vertical/rotated text, matching the
// original Chinese board's calligraphy-style presentation
const VERTICAL_SCRIPT_LANGUAGES = ['zh-Hant', 'zh-Hans', 'ja'];
export const isVerticalScript = (lang) => VERTICAL_SCRIPT_LANGUAGES.includes(lang);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh-Hant', label: '繁體中文' },
  { code: 'zh-Hans', label: '简体中文' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

// auto-discovers every locales/<lang>/<namespace>.json file so adding a new
// namespace is just "drop the JSON file in each language folder" - no import
// list to maintain here
const localeModules = import.meta.glob('./locales/*/*.json', { eager: true });
const resources = {};
for (const path in localeModules) {
  const [, lang, namespace] = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
  resources[lang] = resources[lang] || {};
  resources[lang][namespace] = localeModules[path].default;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: Object.keys(resources.en ?? {}),
    defaultNS: 'translation',
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
