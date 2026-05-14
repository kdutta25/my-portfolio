import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import {
  ensureFragmentsLoaded,
  ensureKnowledgeLoaded,
} from "./siteContent/ensureFragments";
import { SECTION_FRAGMENT_IDS, SHELL_FRAGMENT_IDS } from "./siteContent/fragmentIds";
import { initI18nShell } from "./i18n";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

let boot: Promise<void> | null = null;
function bootstrapApp(): Promise<void> {
  if (!boot) {
    boot = (async () => {
      await initI18nShell();
      await ensureFragmentsLoaded(SHELL_FRAGMENT_IDS);
      await ensureFragmentsLoaded(SECTION_FRAGMENT_IDS);
      void ensureKnowledgeLoaded().catch((err: unknown) => {
        console.warn(
          "[bootstrap] resume/LinkedIn knowledge failed — chat answers may be limited until reload.",
          err,
        );
      });
    })();
  }
  return boot;
}

void bootstrapApp()
  .then(() => {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  })
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    rootEl.innerHTML = `<pre style="padding:1rem;font-family:system-ui">Failed to load site shell.\n\n${message}\n\nSet VITE_CONTENT_API_BASE_URL (e.g. http://localhost:3001) or VITE_SITE_CONTENT_URL, run my-portfolio-api, and retry.</pre>`;
    console.error(err);
  });
