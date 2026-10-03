import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  joinContentApiBaseWithViteBase,
  preferStaticPortfolioPageOrigin,
} from "./contentApiBase";

describe("joinContentApiBaseWithViteBase", () => {
  it("leaves origin-only bases unchanged when Vite base is /", () => {
    expect(joinContentApiBaseWithViteBase("https://www.kaustubhdutta.com", "/")).toBe(
      "https://www.kaustubhdutta.com",
    );
  });

  it("appends project Pages subpath onto a bare origin", () => {
    expect(
      joinContentApiBaseWithViteBase("https://kdutta25.github.io", "/my-portfolio/"),
    ).toBe("https://kdutta25.github.io/my-portfolio");
  });

  it("does not append Vite base when the API URL already has a path prefix", () => {
    expect(
      joinContentApiBaseWithViteBase("https://www.kaustubhdutta.com/api", "/my-portfolio/"),
    ).toBe("https://www.kaustubhdutta.com/api");
  });
});

describe("preferStaticPortfolioPageOrigin", () => {
  it("forces same-origin /v1 on the public portfolio host even if env points elsewhere", () => {
    expect(
      preferStaticPortfolioPageOrigin(
        "https://old-api.example.com",
        "https://www.kaustubhdutta.com/",
        "/",
      ),
    ).toBe("https://www.kaustubhdutta.com");
  });

  it("leaves the env base unchanged on other hosts", () => {
    expect(
      preferStaticPortfolioPageOrigin(
        "https://old-api.example.com",
        "https://kdutta25.github.io/",
        "/",
      ),
    ).toBe("https://old-api.example.com");
  });
});

describe("getContentApiBase", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("in dev, replaces bare www static origin with local Vite origin", async () => {
    vi.stubEnv("VITE_CONTENT_API_BASE_URL", "https://www.kaustubhdutta.com");
    const { getContentApiBase } = await import("./contentApiBase");
    expect(getContentApiBase()).toBe("http://localhost:4044");
  });

  it("in dev, replaces bare apex static origin with local Vite origin", async () => {
    vi.stubEnv("VITE_CONTENT_API_BASE_URL", "https://kaustubhdutta.com");
    const { getContentApiBase } = await import("./contentApiBase");
    expect(getContentApiBase()).toBe("http://localhost:4044");
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
