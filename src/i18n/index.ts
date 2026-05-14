import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const STORAGE_KEY = "portfolio-lang";

const reactOpts = {
  useSuspense: false as const,
  bindI18nStore: "added removed" as const,
};

export async function initI18n(
  en: Record<string, unknown>,
  fr: Record<string, unknown>,
): Promise<void> {
  if (i18n.isInitialized) {
    await i18n.addResourceBundle("en", "translation", en, true, true);
    await i18n.addResourceBundle("fr", "translation", fr, true, true);
    return;
  }

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fr: { translation: fr },
      },
      fallbackLng: "en",
      supportedLngs: ["en", "fr"],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: STORAGE_KEY,
      },
      react: reactOpts,
    });
}

/** Empty translation bundles; merge fragments as the user scrolls. */
export async function initI18nShell(): Promise<void> {
  await initI18n({}, {});
}

export async function mergeTranslationFragment(
  fragmentKey: string,
  enData: unknown,
  frData: unknown,
): Promise<void> {
  if (!i18n.isInitialized) {
    throw new Error("i18n must be initialized before mergeTranslationFragment");
  }
  await i18n.addResourceBundle(
    "en",
    "translation",
    { [fragmentKey]: enData } as Record<string, unknown>,
    true,
    true,
  );
  await i18n.addResourceBundle(
    "fr",
    "translation",
    { [fragmentKey]: frData } as Record<string, unknown>,
    true,
    true,
  );
}

export { i18n };
