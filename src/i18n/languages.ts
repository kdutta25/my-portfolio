/** Languages offered in the header menu. Every code needs a `data/locales/{code}.json` in my-portfolio-api. */
export const LANGUAGES = [
  { code: "en", label: "English", locale: "en-CA" },
  { code: "fr", label: "Français", locale: "fr-CA" },
  { code: "hi", label: "हिन्दी", locale: "hi-IN" },
  { code: "bn", label: "বাংলা", locale: "bn-IN-u-nu-latn" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: LanguageCode = "en";
export const LANGUAGE_CODES: readonly LanguageCode[] = LANGUAGES.map((l) => l.code);

export function isLanguageCode(x: unknown): x is LanguageCode {
  return typeof x === "string" && (LANGUAGE_CODES as readonly string[]).includes(x);
}

/** Maps an i18next language tag (`hi-IN`, `fr`, `de`) to a supported code, falling back to English. */
export function resolveLanguage(tag: string | undefined): LanguageCode {
  const base = tag?.split("-")[0]?.toLowerCase();
  return isLanguageCode(base) ? base : DEFAULT_LANGUAGE;
}

export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
