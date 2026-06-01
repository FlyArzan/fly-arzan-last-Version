import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import all translation files
import translationENUK from "./locales/en-GB/translation.json";
import translationENUSA from "./locales/en-USA/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationID from "./locales/id/translation.json";
import translationMS from "./locales/ms/translation.json";
import translationES from "./locales/es/translation.json";
import translationIT from "./locales/it/translation.json";
import translationNL from "./locales/nl/translation.json";

import translationPL from "./locales/pl/translation.json";
import translationPTPT from "./locales/pt-PT/translation.json";

import translationSV from "./locales/sv/translation.json";
import translationAR from "./locales/ar/translation.json";
import translationKO from "./locales/ko-KR/translation.json";
import translationZH from "./locales/zh-CN/translation.json";
import translationJP from "./locales/ja-JP/translation.json";
import translationHI from "./locales/hi/translation.json";

import translationTH from "./locales/th/translation.json";
import translationFA from "./locales/fa/translation.json";
import translationVI from "./locales/vi/translation.json";
import translationUR from "./locales/ur/translation.json";
import translationTR from "./locales/tr/translation.json";
import translationEL from "./locales/el/translation.json";
import translationru from "./locales/ru/translation.json";
import translationDE from "./locales/de/translation.json";

const selectLocalLang = JSON.parse(localStorage.getItem("selectLang"));

// Create a resources object with all languages
const resources = {
  "en-GB": {
    translation: translationENUK,
  },
  "en-US": {
    translation: translationENUSA,
  },
  fr: {
    translation: translationFR,
  },
  id: {
    translation: translationID,
  },
  ms: {
    translation: translationMS,
  },
  es: {
    translation: translationES,
  },

  it: {
    translation: translationIT,
  },

  nl: {
    translation: translationNL,
  },

  pl: {
    translation: translationPL,
  },
  tr: {
    translation: translationTR,
  },
  vi: {
    translation: translationVI,
  },
  th: {
    translation: translationTH,
  },
  fa: {
    translation: translationFA,
  },
  ur: {
    translation: translationUR,
  },
  el: {
    translation: translationEL,
  },
  ru: {
    translation: translationru,
  },
  de: {
    translation: translationDE,
  },
  sv: {
    translation: translationSV,
  },
  ar: {
    translation: translationAR,
  },
  hi: {
    translation: translationHI,
  },

  "pt-PT": {
    translation: translationPTPT,
  },
  "ko-KR": {
    translation: translationKO,
  },
  "zh-CN": {
    translation: translationZH,
  },
  "zh-TW": {
    translation: translationZH,
  },
  "ja-JP": {
    translation: translationJP,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: selectLocalLang?.code || "en-US", // Default language
  fallbackLng: selectLocalLang?.code || "en-US",

  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
});

export default i18n;
