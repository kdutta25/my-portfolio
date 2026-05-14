/** Base URL of my-portfolio-api (origin only), e.g. `http://localhost:3001`. */
export function getContentApiBase(): string {
  const explicit = import.meta.env.VITE_CONTENT_API_BASE_URL;
  if (explicit && typeof explicit === "string" && explicit.trim()) {
    return explicit.replace(/\/$/, "");
  }
  const legacy = import.meta.env.VITE_SITE_CONTENT_URL;
  if (legacy && typeof legacy === "string" && legacy.trim()) {
    try {
      return new URL(legacy).origin;
    } catch {
      /* fall through */
    }
  }
  throw new Error(
    "Set VITE_CONTENT_API_BASE_URL (recommended) or VITE_SITE_CONTENT_URL so the app can reach the content API.",
  );
}
