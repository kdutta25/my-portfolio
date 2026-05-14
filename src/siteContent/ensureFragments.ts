import { setKnowledgeFromSiteContent } from "../chat/matchKnowledge";
import { mergeTranslationFragment } from "../i18n";
import type { LinkedinSnapshot, ResumeCorpus } from "../types/siteContent";
import { getContentApiBase } from "./contentApiBase";

type FragmentResponse = { fragment: string; data: unknown };

const loaded = new Set<string>();
const inflight = new Map<string, Promise<void>>();

async function fetchFragment(lng: "en" | "fr", key: string): Promise<unknown> {
  const base = getContentApiBase();
  const res = await fetch(
    `${base}/v1/fragments/${lng}/${encodeURIComponent(key)}`,
  );
  if (!res.ok) {
    throw new Error(`Fragment ${lng}/${key} failed: ${res.status}`);
  }
  const body = (await res.json()) as FragmentResponse;
  return body.data;
}

async function ensureOneFragment(key: string): Promise<void> {
  if (loaded.has(key)) return;
  const pending = inflight.get(key);
  if (pending) {
    await pending;
    return;
  }

  const p = (async () => {
    const [enData, frData] = await Promise.all([
      fetchFragment("en", key),
      fetchFragment("fr", key),
    ]);
    await mergeTranslationFragment(key, enData, frData);
    loaded.add(key);
  })();

  inflight.set(key, p);
  try {
    await p;
  } finally {
    inflight.delete(key);
  }
}

export async function ensureFragmentsLoaded(keys: readonly string[]): Promise<void> {
  const distinct = [...new Set(keys)];
  await Promise.all(distinct.map((k) => ensureOneFragment(k)));
}

/** True when every key has finished merging into i18n (used to skip scroll observers). */
export function areAllFragmentsLoaded(keys: readonly string[]): boolean {
  return keys.every((k) => loaded.has(k));
}

let knowledgeInflight: Promise<void> | null = null;
let knowledgeReady = false;

export async function ensureKnowledgeLoaded(): Promise<void> {
  if (knowledgeReady) return;
  if (knowledgeInflight) {
    await knowledgeInflight;
    return;
  }

  knowledgeInflight = (async () => {
    const base = getContentApiBase();
    const [resumeRes, linkedinRes] = await Promise.all([
      fetch(`${base}/v1/knowledge/resume`),
      fetch(`${base}/v1/knowledge/linkedin`),
    ]);
    if (!resumeRes.ok || !linkedinRes.ok) {
      throw new Error(
        `Knowledge fetch failed: ${resumeRes.status} / ${linkedinRes.status}`,
      );
    }
    const resume = (await resumeRes.json()) as ResumeCorpus;
    const linkedin = (await linkedinRes.json()) as LinkedinSnapshot;
    setKnowledgeFromSiteContent(resume, linkedin);
    knowledgeReady = true;
  })();

  try {
    await knowledgeInflight;
  } finally {
    knowledgeInflight = null;
  }
}

/** After bulk-loading locales (tests / Cypress), skip redundant fragment GETs. */
export function markFragmentsLoaded(keys: Iterable<string>): void {
  for (const k of keys) loaded.add(k);
}

export function markKnowledgeLoaded(): void {
  knowledgeReady = true;
}
