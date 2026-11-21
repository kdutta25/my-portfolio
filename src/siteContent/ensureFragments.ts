import { currentLanguage, i18n, mergeTranslationFragment } from "../i18n";
import { DEFAULT_LANGUAGE, type LanguageCode } from "../i18n/languages";
import { getContentApiBase } from "./contentApiBase";
import { SECTION_FRAGMENT_IDS, SHELL_FRAGMENT_IDS } from "./fragmentIds";

type FragmentResponse = { fragment: string; data: unknown };

/** Keys are `${lng}:${fragment}`. */
const loaded = new Set<string>();
const inflight = new Map<string, Promise<void>>();

const slot = (lng: LanguageCode, key: string) => `${lng}:${key}`;

async function fetchFragment(lng: LanguageCode, key: string): Promise<unknown> {
  const base = getContentApiBase();
  const res = await fetch(
    `${base}/v1/fragments/${lng}/${encodeURIComponent(key)}`,
  );
  if (!res.ok) {
    let detail = "";
    try {
      const errBody: unknown = await res.json();
      if (errBody && typeof errBody === "object" && "error" in errBody) {
        detail = ` — ${String((errBody as { error?: unknown }).error)}`;
        if ("hint" in errBody && typeof (errBody as { hint?: unknown }).hint === "string") {
          detail += ` (${(errBody as { hint: string }).hint})`;
        }
      }
    } catch {
      /* non-JSON error body */
    }
    throw new Error(`Fragment ${lng}/${key} failed: ${res.status}${detail}`);
  }
  const body = (await res.json()) as FragmentResponse;
  return body.data;
}

async function ensureOneFragment(lng: LanguageCode, key: string): Promise<void> {
  const id = slot(lng, key);
  if (loaded.has(id)) return;
  const pending = inflight.get(id);
  if (pending) {
    await pending;
    return;
  }

  const p = (async () => {
    await mergeTranslationFragment(lng, key, await fetchFragment(lng, key));
    loaded.add(id);
  })();

  inflight.set(id, p);
  try {
    await p;
  } finally {
    inflight.delete(id);
  }
}

/** English is always loaded as the fallback; the shown language is loaded alongside it. */
function activeLanguages(): LanguageCode[] {
  return [...new Set([DEFAULT_LANGUAGE, currentLanguage()])];
}

export async function ensureFragmentsLoaded(
  keys: readonly string[],
  languages: readonly LanguageCode[] = activeLanguages(),
): Promise<void> {
  const distinct = [...new Set(keys)];
  await Promise.all(
    languages.flatMap((lng) => distinct.map((k) => ensureOneFragment(lng, k))),
  );
}

/** True when every key has finished merging into i18n (used to skip scroll observers). */
export function areAllFragmentsLoaded(keys: readonly string[]): boolean {
  const languages = activeLanguages();
  return keys.every((k) => languages.every((lng) => loaded.has(slot(lng, k))));
}

/** Loads every fragment for `lng` before switching, so the page never shows raw keys. */
export async function switchLanguage(lng: LanguageCode): Promise<void> {
  await ensureFragmentsLoaded(
    [...SHELL_FRAGMENT_IDS, ...SECTION_FRAGMENT_IDS],
    [...new Set([DEFAULT_LANGUAGE, lng])],
  );
  await i18n.changeLanguage(lng);
}

/** After bulk-loading locales (tests / Cypress), skip redundant fragment GETs. */
export function markFragmentsLoaded(
  keys: Iterable<string>,
  languages: Iterable<LanguageCode>,
): void {
  const langs = [...languages];
  for (const k of keys) for (const lng of langs) loaded.add(slot(lng, k));
}
