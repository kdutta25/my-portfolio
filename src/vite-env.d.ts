/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Preferred: API origin only, e.g. `http://localhost:3001` */
  readonly VITE_CONTENT_API_BASE_URL?: string;
  /** Legacy: any URL on the API origin (e.g. `http://localhost:3001/v1/site-content`) — origin is used as the API base. */
  readonly VITE_SITE_CONTENT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
