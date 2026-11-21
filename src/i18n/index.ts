import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  resolveLanguage,
  type LanguageCode,
} from "./languages";

const STORAGE_KEY = "portfolio-lang";

const reactOpts = {
  useSuspense: false as const,
  bindI18nStore: "added removed" as const,
};

export type LocaleBundles = Partial<Record<LanguageCode, Record<string, unknown>>>;

export async function initI18n(bundles: LocaleBundles): Promise<void> {
  if (i18n.isInitialized) {
    for (const [lng, data] of Object.entries(bundles)) {
      if (data) await i18n.addResourceBundle(lng, "translation", data, true, true);
    }
    return;
  }

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: Object.fromEntries(
        Object.entries(bundles).map(([lng, data]) => [lng, { translation: data ?? {} }]),
      ),
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: [...LANGUAGE_CODES],
      nonExplicitSupportedLngs: true,
      load: "languageOnly",
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: STORAGE_KEY,
      },
      react: reactOpts,
    });
}

/** Empty translation bundles; fragments are merged in as they load. */
export async function initI18nShell(): Promise<void> {
  await initI18n({});
}

/** The supported language currently shown, e.g. `hi` for a browser set to `hi-IN`. */
export function currentLanguage(): LanguageCode {
  return resolveLanguage(i18n.resolvedLanguage ?? i18n.language);
}

export async function mergeTranslationFragment(
  lng: LanguageCode,
  fragmentKey: string,
  data: unknown,
): Promise<void> {
  if (!i18n.isInitialized) {
    throw new Error("i18n must be initialized before mergeTranslationFragment");
  }
  await i18n.addResourceBundle(
    lng,
    "translation",
    { [fragmentKey]: data } as Record<string, unknown>,
    true,
    true,
  );
}

export { i18n };
