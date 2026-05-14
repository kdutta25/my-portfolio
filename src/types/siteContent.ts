export type ResumeCorpus = {
  resumeText: string;
};

export type LinkedinSnapshot = {
  headline: string;
  location: string;
  summary: string;
  linksNote: string;
};

export type SiteContentPayload = {
  resumeCorpus: ResumeCorpus;
  linkedinSnapshot: LinkedinSnapshot;
  locales: {
    en: Record<string, unknown>;
    fr: Record<string, unknown>;
  };
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

export function isSiteContentPayload(x: unknown): x is SiteContentPayload {
  if (!isRecord(x)) return false;
  const rc = x.resumeCorpus;
  const li = x.linkedinSnapshot;
  const loc = x.locales;
  if (!isRecord(rc) || typeof rc.resumeText !== "string") return false;
  if (
    !isRecord(li) ||
    typeof li.headline !== "string" ||
    typeof li.location !== "string" ||
    typeof li.summary !== "string" ||
    typeof li.linksNote !== "string"
  ) {
    return false;
  }
  if (!isRecord(loc)) return false;
  if (!isRecord(loc.en) || !isRecord(loc.fr)) return false;
  return true;
}
