import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub Project Pages (`username.github.io/repo/`) needs a subpath, e.g. `/my-portfolio/`. Custom domain at root: leave unset or `/`. */
function viteBase(): string {
  const raw = process.env.VITE_BASE_PATH?.trim();
  if (!raw || raw === "/") return "/";
  const b = raw.startsWith("/") ? raw : `/${raw}`;
  return b.endsWith("/") ? b : `${b}/`;
}

/** Mirrors `contentApiBase.ts` normalization for build-time checks only. */
function normalizeContentApiBaseLikeApp(raw: string): string {
  let s = raw.trim().replace(/\/+$/, "");
  s = s.replace(/\/v1\/?$/i, "").replace(/\/+$/, "");
  return s;
}

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

function resolvedContentApiBaseForBuild(
  env: Record<string, string | undefined>,
): string {
  const explicit = env.VITE_CONTENT_API_BASE_URL?.trim();
  if (explicit) return normalizeContentApiBaseLikeApp(explicit);
  const legacy = env.VITE_SITE_CONTENT_URL?.trim();
  if (!legacy) return "";
  try {
    return normalizeContentApiBaseLikeApp(new URL(legacy).origin);
  } catch {
    return "";
  }
}

export default defineConfig(({ mode }) => {
  const merged = { ...loadEnv(mode, process.cwd(), ""), ...process.env } as Record<
    string,
    string | undefined
  >;
  const resolvedBase = resolvedContentApiBaseForBuild(merged);
  const explicitAllow = merged.VITE_ALLOW_SAME_ORIGIN_CONTENT_API?.trim();

  const define: Record<string, string> = {};
  if (
    mode === "production" &&
    resolvedBase &&
    isBareStaticPortfolioBase(resolvedBase) &&
    explicitAllow !== "false"
  ) {
    define["import.meta.env.VITE_ALLOW_SAME_ORIGIN_CONTENT_API"] = JSON.stringify("true");
    console.info(
      "[vite] Production build: bare portfolio host as API base — baking VITE_ALLOW_SAME_ORIGIN_CONTENT_API=true (set VITE_ALLOW_SAME_ORIGIN_CONTENT_API=false to opt out). /v1 must still be served by my-portfolio-api (e.g. reverse proxy).",
    );
  }

  return {
    base: viteBase(),
    define,
    plugins: [react()],
    server: {
      port: 4044,
      strictPort: true,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      include: ["src/**/*.test.{ts,tsx}"],
    },
  };
});
