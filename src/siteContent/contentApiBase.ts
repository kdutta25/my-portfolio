/** Hosts that serve the static SPA (and baked `/v1` JSON on GitHub Pages). */
const STATIC_PORTFOLIO_HOSTS = new Set(["www.kaustubhdutta.com", "kaustubhdutta.com"]);

function isBareStaticPortfolioBase(base: string): boolean {
  let u: URL;
  try {
    u = new URL(base);
  } catch {
    return false;
  }
  if (!STATIC_PORTFOLIO_HOSTS.has(u.hostname)) return false;
  const path = (u.pathname || "").replace(/\/+$/, "");
  return path === "" || path === "/";
}

/**
 * When the API base is origin-only, append Vite `BASE_URL` so GitHub Project Pages
 * (`/my-portfolio/`) fetches `/my-portfolio/v1/...`. Custom domain at site root uses `/`.
 * If the base already has a path prefix (e.g. `/api`), leave it unchanged.
 */
export function joinContentApiBaseWithViteBase(apiBase: string, viteBase: string): string {
  const vitePath = (viteBase || "/").replace(/\/+$/, "");
  if (!vitePath) return apiBase;
  let u: URL;
  try {
    u = new URL(apiBase);
  } catch {
    return apiBase;
  }
  const path = (u.pathname || "").replace(/\/+$/, "");
  if (path !== "" && path !== "/") return apiBase;
  return `${u.origin}${vitePath}`;
}

/**
 * In dev, shell exports or `.env.local` often override `.env.development` and point
 * at production. Same for legacy `VITE_SITE_CONTENT_URL` → origin of the static site.
 * Fall back to the local Vite origin (baked `public/v1`) unless explicitly opted out.
 */
function devFallbackIfBareStaticPortfolio(base: string): string {
  if (!import.meta.env.DEV || !isBareStaticPortfolioBase(base)) return base;
  if (import.meta.env.VITE_DEV_ALLOW_BARE_PORTFOLIO_ORIGIN_API === "true") return base;
  const fallback =
    typeof import.meta.env.VITE_DEV_DEFAULT_CONTENT_API_BASE === "string" &&
    import.meta.env.VITE_DEV_DEFAULT_CONTENT_API_BASE.trim()
      ? normalizeContentApiBase(import.meta.env.VITE_DEV_DEFAULT_CONTENT_API_BASE)
      : "http://localhost:4044";
  // eslint-disable-next-line no-console -- intentional dev-only misconfiguration hint
  console.warn(
    `[portfolio] Content API base was "${base}" (production origin). ` +
      `Using dev fallback "${fallback}" (Vite serves generated public/v1). Fix: unset shell VITE_CONTENT_API_BASE_URL / VITE_SITE_CONTENT_URL, ` +
      `or rely on .env.development. Optional: VITE_DEV_DEFAULT_CONTENT_API_BASE, or VITE_DEV_ALLOW_BARE_PORTFOLIO_ORIGIN_API=true to keep production.`,
  );
  return fallback;
}

/**
 * Normalize user-provided API base. The app always appends `/v1/...`, so the base
 * must be the service origin/path *before* `/v1` (not a URL that already includes `/v1`).
 */
function normalizeContentApiBase(raw: string): string {
  let s = raw.trim().replace(/\/+$/, "");
  // Common mistake: `https://api.example.com/v1` — strip trailing `/v1` once.
  s = s.replace(/\/v1\/?$/i, "").replace(/\/+$/, "");
  return s;
}

/**
 * In production, block setting the API base to this page’s origin with no path
 * unless same-origin static `/v1` (or a reverse proxy) is opted in.
 */
function assertApiBaseIsNotBareStaticOrigin(base: string): void {
  if (typeof window === "undefined" || !import.meta.env.PROD) return;
  /** Set at build time when `/v1` is served from the same origin as the SPA (GitHub Pages snapshot or proxy). */
  if (import.meta.env.VITE_ALLOW_SAME_ORIGIN_CONTENT_API === "true") return;
  let u: URL;
  try {
    u = new URL(base);
  } catch {
    return;
  }
  if (u.origin !== window.location.origin) return;
  const path = (u.pathname || "").replace(/\/+$/, "");
  if (path !== "" && path !== "/") return;
  throw new Error(
    "VITE_CONTENT_API_BASE_URL is set to this website’s origin only (same as the page you opened). " +
      "Set VITE_ALLOW_SAME_ORIGIN_CONTENT_API=true when GitHub Pages serves generated /v1 JSON, " +
      "or point VITE_CONTENT_API_BASE_URL at a dedicated API origin, then rebuild and redeploy.",
  );
}

/** Base URL before `/v1/...` (origin, Vite BASE_URL on project Pages, or a path prefix). */
export function getContentApiBase(): string {
  const explicit = import.meta.env.VITE_CONTENT_API_BASE_URL;
  if (explicit && typeof explicit === "string" && explicit.trim()) {
    const base = joinContentApiBaseWithViteBase(
      devFallbackIfBareStaticPortfolio(normalizeContentApiBase(explicit)),
      import.meta.env.BASE_URL,
    );
    assertApiBaseIsNotBareStaticOrigin(base);
    return base;
  }
  const legacy = import.meta.env.VITE_SITE_CONTENT_URL;
  if (legacy && typeof legacy === "string" && legacy.trim()) {
    let origin: string;
    try {
      origin = new URL(legacy.trim()).origin;
    } catch {
      origin = "";
    }
    if (origin) {
      const base = joinContentApiBaseWithViteBase(
        devFallbackIfBareStaticPortfolio(normalizeContentApiBase(origin)),
        import.meta.env.BASE_URL,
      );
      assertApiBaseIsNotBareStaticOrigin(base);
      return base;
    }
  }
  throw new Error(
    "Set VITE_CONTENT_API_BASE_URL (recommended) or VITE_SITE_CONTENT_URL so the app can reach site content (`/v1`).",
  );
}
