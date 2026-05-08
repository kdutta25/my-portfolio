import resumeData from "../data/resume-corpus.json";
import linkedinData from "../data/linkedin-snapshot.json";

type LabeledChunk = { text: string; label: string };

const STOP = new Set(
  [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "as",
    "is",
    "was",
    "are",
    "be",
    "been",
    "with",
    "your",
    "you",
    "what",
    "how",
    "when",
    "where",
    "why",
    "did",
    "does",
    "do",
    "my",
    "me",
    "i",
    "we",
    "can",
    "could",
    "would",
    "tell",
    "from",
    "this",
    "that",
    "it",
    "its",
    "has",
    "have",
    "any",
    "some",
    "using",
    "use",
    "get",
  ].map((w) => w),
);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+.%\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/** Split résumé text into medium chunks (PDF uses § bullets). */
function chunkResume(full: string): string[] {
  const parts = full
    .split(/§/)
    .map((x) => x.trim())
    .filter((x) => x.length > 6);
  const out: string[] = [];
  let cur = "";
  for (const p of parts) {
    const next = cur ? `${cur}\n• ${p}` : p;
    if (next.length > 550 && cur) {
      out.push(cur);
      cur = p;
    } else {
      cur = next;
    }
  }
  if (cur) out.push(cur);
  if (!out.length) return [full.slice(0, 2200)];
  return out;
}

function buildChunks(): LabeledChunk[] {
  const snap = [
    `${linkedinData.headline} · ${linkedinData.location}`,
    linkedinData.summary,
    linkedinData.linksNote,
  ].join("\n\n");
  const resumeChunks = chunkResume(resumeData.resumeText);
  return [
    { text: snap, label: "Profile snapshot (aligned with public LinkedIn)" },
    ...resumeChunks.map((text) => ({ text, label: "Résumé (PDF on this site)" })),
  ];
}

const CHUNKS = buildChunks();

function scoreChunk(query: string, chunk: string): number {
  const qt = tokenize(query);
  if (!qt.length) return 0;
  const lowChunk = chunk.toLowerCase();
  const ct = new Set(tokenize(chunk));
  let hits = 0;
  for (const t of qt) {
    if (ct.has(t)) hits += 1.2;
    else if (lowChunk.includes(t)) hits += 0.55;
  }
  const qPhrase = query.trim().toLowerCase();
  if (qPhrase.length >= 6 && lowChunk.includes(qPhrase)) hits += 3;
  return hits / (1 + Math.log(10 + chunk.length / 80));
}

function trimText(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

/**
 * Best-effort answer from embedded LinkedIn snapshot + résumé text.
 * LinkedIn cannot be scraped live in the browser (CORS / auth wall).
 */
export function findKnowledgeAnswer(query: string): string | null {
  const trimmed = query.trim();
  if (trimmed.length < 2) return null;

  /** Single-keyword LinkedIn intent — always show profile snapshot (live site requires login). */
  if (/^linkedin\b/i.test(trimmed) && trimmed.length < 40) {
    const c = CHUNKS[0];
    return `${trimText(c.text, 1150)}\n\n— ${c.label}`;
  }

  let best: { score: number; chunk: LabeledChunk } | null = null;
  for (const chunk of CHUNKS) {
    const s = scoreChunk(trimmed, chunk.text);
    if (!best || s > best.score) best = { score: s, chunk };
  }
  if (!best || best.score < 0.35) return null;

  const body = trimText(best.chunk.text, 1150);
  return `${body}\n\n— ${best.chunk.label}`;
}
