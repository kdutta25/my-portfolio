import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getContentApiBase", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("in dev, replaces bare www static origin with localhost API", async () => {
    vi.stubEnv("VITE_CONTENT_API_BASE_URL", "https://www.kaustubhdutta.com");
    const { getContentApiBase } = await import("./contentApiBase");
    expect(getContentApiBase()).toBe("http://localhost:3001");
  });

  it("in dev, replaces bare apex static origin with localhost API", async () => {
    vi.stubEnv("VITE_CONTENT_API_BASE_URL", "https://kaustubhdutta.com");
    const { getContentApiBase } = await import("./contentApiBase");
    expect(getContentApiBase()).toBe("http://localhost:3001");
  });

  it("in dev, does not replace same host when a path prefix is present", async () => {
    vi.stubEnv("VITE_CONTENT_API_BASE_URL", "https://www.kaustubhdutta.com/api");
    const { getContentApiBase } = await import("./contentApiBase");
    expect(getContentApiBase()).toBe("https://www.kaustubhdutta.com/api");
  });

  it("in dev, respects VITE_DEV_DEFAULT_CONTENT_API_BASE", async () => {
    vi.stubEnv("VITE_CONTENT_API_BASE_URL", "https://www.kaustubhdutta.com");
    vi.stubEnv("VITE_DEV_DEFAULT_CONTENT_API_BASE", "http://127.0.0.1:3002");
    const { getContentApiBase } = await import("./contentApiBase");
    expect(getContentApiBase()).toBe("http://127.0.0.1:3002");
  });
});
