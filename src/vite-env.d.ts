/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Content base: origin only, or origin + path prefix **without** a trailing `/v1`
   * (that segment is appended automatically). On GitHub Pages this is the SPA origin;
   * generated `public/v1` is served as static files.
   */
  readonly VITE_CONTENT_API_BASE_URL?: string;
  /** Legacy: any URL on the content origin (e.g. `http://localhost:4044/v1/site-content`) — origin is used as the API base. */
  readonly VITE_SITE_CONTENT_URL?: string;
  /** Dev only: when the API base would be bare `www`/`kaustubhdutta.com`, use this instead of `http://localhost:4044`. */
  readonly VITE_DEV_DEFAULT_CONTENT_API_BASE?: string;
  /** Dev only: set `"true"` to allow bare portfolio origin as API base (no localhost fallback). */
  readonly VITE_DEV_ALLOW_BARE_PORTFOLIO_ORIGIN_API?: string;
  /**
   * Production: set `"true"` when `VITE_CONTENT_API_BASE_URL` is the same origin as the SPA with no extra
   * API path (GitHub Pages serving generated `/v1`). Omit if content is on another host.
   */
  readonly VITE_ALLOW_SAME_ORIGIN_CONTENT_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
