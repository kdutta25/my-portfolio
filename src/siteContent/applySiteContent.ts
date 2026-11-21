import { initI18n } from "../i18n";
import { isLanguageCode } from "../i18n/languages";
import { isSiteContentPayload, type SiteContentPayload } from "../types/siteContent";
import { markFragmentsLoaded } from "./ensureFragments";

export async function applySiteContent(payload: SiteContentPayload): Promise<void> {
  await initI18n(payload.locales);
  markFragmentsLoaded(
    Object.keys(payload.locales.en),
    Object.keys(payload.locales).filter(isLanguageCode),
  );
}

export async function loadSiteContentFromUrl(url: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Site content request failed: ${res.status} ${res.statusText}`);
  }
  const body: unknown = await res.json();
  if (!isSiteContentPayload(body)) {
    throw new Error("Site content response did not match the expected shape.");
  }
  await applySiteContent(body);
}
