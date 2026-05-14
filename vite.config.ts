import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub Project Pages (`username.github.io/repo/`) needs a subpath, e.g. `/my-portfolio/`. Custom domain at root: leave unset or `/`. */
function viteBase(): string {
  const raw = process.env.VITE_BASE_PATH?.trim();
  if (!raw || raw === "/") return "/";
  const b = raw.startsWith("/") ? raw : `/${raw}`;
  return b.endsWith("/") ? b : `${b}/`;
}

export default defineConfig({
  base: viteBase(),
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
});
