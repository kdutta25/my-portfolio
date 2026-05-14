/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * API base: origin only, or origin + path prefix **without** a trailing `/v1`
   * (that segment is appended automatically). Must NOT be the portfolio static site
   * (e.g. not https://www.kaustubhdutta.com unless you reverse-proxy `/v1` there).
   */
  readonly VITE_CONTENT_API_BASE_URL?: string;
  /** Legacy: any URL on the API origin (e.g. `http://localhost:3001/v1/site-content`) — origin is used as the API base. */
  readonly VITE_SITE_CONTENT_URL?: string;
  /** Dev only: when the API base would be bare `www`/`kaustubhdutta.com`, use this instead of `http://localhost:3001`. */
  readonly VITE_DEV_DEFAULT_CONTENT_API_BASE?: string;
  /** Dev only: set `"true"` to allow bare portfolio origin as API base (no localhost fallback). */
  readonly VITE_DEV_ALLOW_BARE_PORTFOLIO_ORIGIN_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
