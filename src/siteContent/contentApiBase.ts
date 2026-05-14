/** Hosts that serve only the static SPA (no `/v1/fragments` on bare origin). */
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
 * In dev, shell exports or `.env.local` often override `.env.development` and point
 * at production. Same for legacy `VITE_SITE_CONTENT_URL` → origin of the static site.
 * Fall back to the local API unless explicitly opted out.
 */
function devFallbackIfBareStaticPortfolio(base: string): string {
  if (!import.meta.env.DEV || !isBareStaticPortfolioBase(base)) return base;
  if (import.meta.env.VITE_DEV_ALLOW_BARE_PORTFOLIO_ORIGIN_API === "true") return base;
  const fallback =
    typeof import.meta.env.VITE_DEV_DEFAULT_CONTENT_API_BASE === "string" &&
    import.meta.env.VITE_DEV_DEFAULT_CONTENT_API_BASE.trim()
      ? normalizeContentApiBase(import.meta.env.VITE_DEV_DEFAULT_CONTENT_API_BASE)
      : "http://localhost:3001";
  // eslint-disable-next-line no-console -- intentional dev-only misconfiguration hint
  console.warn(
    `[portfolio] Content API base was "${base}" (static site origin, no /v1 here). ` +
      `Using dev fallback "${fallback}". Fix: unset shell VITE_CONTENT_API_BASE_URL / VITE_SITE_CONTENT_URL, ` +
      `or rely on .env.development. Optional: VITE_DEV_DEFAULT_CONTENT_API_BASE, or VITE_DEV_ALLOW_BARE_PORTFOLIO_ORIGIN_API=true to keep production.`,
  );
  return fallback;
}

/**
 * Normalize user-provided API base. The app always appends `/v1/...`, so the base
 * must be the service origin/path *before* `/v1` (not the portfolio static site).
 */
function normalizeContentApiBase(raw: string): string {
  let s = raw.trim().replace(/\/+$/, "");
  // Common mistake: `https://api.example.com/v1` — strip trailing `/v1` once.
  s = s.replace(/\/v1\/?$/i, "").replace(/\/+$/, "");
  return s;
}

/**
 * In production, block the common mistake of setting the API base to the SPA origin
 * (e.g. https://www.kaustubhdutta.com) with no path — that host has no /v1/fragments routes.
 * Same-origin + path prefix (e.g. …/api) is allowed when nginx proxies /api to the API.
 */
function assertApiBaseIsNotBareStaticOrigin(base: string): void {
  if (typeof window === "undefined" || !import.meta.env.PROD) return;
  /** Set at build time when API lives on the same host as the SPA (e.g. reverse-proxy `/v1` to Node). */
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
      "The portfolio is static HTML/JS — it does not serve GET /v1/fragments. " +
      "Set VITE_CONTENT_API_BASE_URL to your my-portfolio-api deployment (e.g. https://api.example.com or https://www.example.com/api if you reverse-proxy /api to the API), then rebuild and redeploy.",
  );
}

/** Base URL of my-portfolio-api (origin, or origin + non-/v1 path prefix), e.g. `http://localhost:3001`. */
export function getContentApiBase(): string {
  const explicit = import.meta.env.VITE_CONTENT_API_BASE_URL;
  if (explicit && typeof explicit === "string" && explicit.trim()) {
    const base = devFallbackIfBareStaticPortfolio(normalizeContentApiBase(explicit));
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
      const base = devFallbackIfBareStaticPortfolio(normalizeContentApiBase(origin));
      assertApiBaseIsNotBareStaticOrigin(base);
      return base;
    }
  }
  throw new Error(
    "Set VITE_CONTENT_API_BASE_URL (recommended) or VITE_SITE_CONTENT_URL so the app can reach the content API.",
  );
}
