import { setKnowledgeFromSiteContent } from "../chat/matchKnowledge";
import { initI18n } from "../i18n";
import { isSiteContentPayload, type SiteContentPayload } from "../types/siteContent";
import { markFragmentsLoaded, markKnowledgeLoaded } from "./ensureFragments";

export async function applySiteContent(payload: SiteContentPayload): Promise<void> {
  await initI18n(payload.locales.en, payload.locales.fr);
  setKnowledgeFromSiteContent(payload.resumeCorpus, payload.linkedinSnapshot);
  markFragmentsLoaded(Object.keys(payload.locales.en));
  markKnowledgeLoaded();
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
