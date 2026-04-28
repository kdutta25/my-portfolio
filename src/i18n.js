import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.js";
import fr from "./locales/fr.js";
import hi from "./locales/hi.js";
import bn from "./locales/bn.js";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      hi: { translation: hi },
      bn: { translation: bn },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "hi", "bn"],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "portfolio-i18n-lang",
    },
  });

export default i18n;
