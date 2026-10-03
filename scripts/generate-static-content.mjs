/**
 * Snapshot my-portfolio-api `data/` into `public/v1/` so GitHub Pages can serve
 * the same URLs the SPA fetches (`/v1/fragments/:lng/:key`, `/v1/knowledge/*`).
 *
 * Env:
 *   CONTENT_DATA_DIR — API data directory (default: ../my-portfolio-api/data)
 *   CONTENT_OUT_DIR  — output root (default: public/v1)
 *
 * Flags:
 *   --optional — exit 0 if CONTENT_DATA_DIR is missing (used by predev/prestart)
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/** Must stay aligned with my-portfolio-api FRAGMENTS and src/siteContent/fragmentIds.ts */
const FRAGMENTS = [
  "site",
  "nav",
  "hero",
  "about",
  "skills",
  "aiModels",
  "support",
  "githubActivity",
  "experience",
  "education",
  "projects",
  "volunteering",
  "publications",
  "chatbot",
  "footer",
];

const optional = process.argv.includes("--optional");
const dataDir = resolve(process.env.CONTENT_DATA_DIR || join(ROOT, "../my-portfolio-api/data"));
const outDir = resolve(process.env.CONTENT_OUT_DIR || join(ROOT, "public/v1"));

if (!existsSync(dataDir)) {
  const msg = `Content data directory not found: ${dataDir}`;
  if (optional) {
    console.warn(`[generate-static-content] ${msg} — skipping (optional).`);
    process.exit(0);
  }
  console.error(`[generate-static-content] ${msg}`);
  console.error("Set CONTENT_DATA_DIR or clone my-portfolio-api next to this repo.");
  process.exit(1);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value)}\n`);
}

const locales = {
  en: readJson(join(dataDir, "locales", "en.json")),
  fr: readJson(join(dataDir, "locales", "fr.json")),
};

const issues = [];
for (const lng of ["en", "fr"]) {
  for (const key of FRAGMENTS) {
    if (!Object.prototype.hasOwnProperty.call(locales[lng], key)) {
      issues.push(`${lng}.json: missing top-level key "${key}"`);
    }
  }
}
if (issues.length) {
  console.error("[generate-static-content] Locale / fragment mismatch:\n  - " + issues.join("\n  - "));
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });

for (const lng of ["en", "fr"]) {
  for (const key of FRAGMENTS) {
    writeJson(join(outDir, "fragments", lng, key), {
      fragment: key,
      data: locales[lng][key],
    });
  }
}

writeJson(join(outDir, "knowledge", "resume"), readJson(join(dataDir, "resume-corpus.json")));
writeJson(join(outDir, "knowledge", "linkedin"), readJson(join(dataDir, "linkedin-snapshot.json")));

console.log(`[generate-static-content] Wrote ${FRAGMENTS.length * 2} fragments + knowledge → ${outDir}`);
