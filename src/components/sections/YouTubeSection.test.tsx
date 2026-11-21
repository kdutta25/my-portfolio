import { screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { YouTubeSection } from "./YouTubeSection";
import { renderWithProviders } from "../../test/renderWithProviders";
import type { YouTubeChannelStats } from "../../types/content";

vi.mock("../../siteContent/contentApiBase", () => ({
  getContentApiBase: () => "http://content.test",
}));

const stats: YouTubeChannelStats = {
  fetchedAt: "2026-11-18T09:00:00.000Z",
  channel: {
    title: "KausDiaries",
    url: "https://www.youtube.com/@KausDiaries",
    avatar: "",
    subscribers: 1250,
    views: 98400,
    videoCount: 42,
  },
  topVideos: [
    { id: "vid1", title: "Long video one", thumbnail: "", views: 5300, publishedAt: "", isShort: false },
  ],
  topShorts: [
    { id: "sh1", title: "Short one", thumbnail: "", views: 12000, publishedAt: "", isShort: true },
  ],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("YouTubeSection", () => {
  it("renders channel stats, top videos and top Shorts", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => stats });
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<YouTubeSection />);

    const statList = await screen.findByText("Subscribers");
    expect(within(statList.closest("dl")!).getByText("1.3K")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("http://content.test/v1/youtube/channel.json");

    expect(screen.getByRole("link", { name: /Long video one/ })).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=vid1",
    );
    expect(screen.getByRole("link", { name: /Short one/ })).toHaveAttribute(
      "href",
      "https://www.youtube.com/shorts/sh1",
    );
    expect(screen.getByText("12K views")).toBeInTheDocument();
  });

  it("shows a watch time tile in hours when stats include watch minutes", async () => {
    const withWatch = { ...stats, channel: { ...stats.channel, watchMinutes: 74_400 } };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => withWatch }));

    renderWithProviders(<YouTubeSection />);

    await screen.findByText("Subscribers");
    const tile = screen.getByText("Watch time").closest("div")!;
    expect(within(tile).getByRole("definition")).toHaveTextContent("1.2K hrs");
    expect(within(tile).getByText("hrs")).toBeInTheDocument();
    expect(tile.closest("dl")!.children).toHaveLength(4);
  });

  it("leaves out the watch time tile when stats have no watch minutes", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => stats }));

    renderWithProviders(<YouTubeSection />);

    const subscribers = await screen.findByText("Subscribers");
    expect(screen.queryByText("Watch time")).not.toBeInTheDocument();
    expect(subscribers.closest("dl")!.children).toHaveLength(3);
  });

  it("keeps the heading and subscribe link when stats are unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));

    renderWithProviders(<YouTubeSection />);

    expect(screen.getByRole("heading", { level: 2, name: /CHANNEL/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Subscribe/ })).toHaveAttribute(
      "href",
      "https://www.youtube.com/@KausDiaries",
    );
    await Promise.resolve();
    expect(screen.queryByText("Subscribers")).not.toBeInTheDocument();
  });

  it("shows the saved banner when stats are unavailable", () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));

    renderWithProviders(<YouTubeSection />);

    const banner = screen.getByRole("img", { name: "KausDiaries channel banner" });
    expect(banner.getAttribute("src")).toMatch(/images\/youtube\/banner-1060\.jpg$/);
    expect(banner.closest("a")).toHaveAttribute("href", "https://www.youtube.com/@KausDiaries");
  });

  it("builds the banner from the live URL when stats include it", async () => {
    const base = "https://yt3.googleusercontent.com/abc";
    const withBanner = { ...stats, channel: { ...stats.channel, banner: base } };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => withBanner }));

    renderWithProviders(<YouTubeSection />);

    await screen.findByText("Subscribers");
    const banner = screen.getByRole("img", { name: "KausDiaries channel banner" });
    const desktopSet = banner.getAttribute("srcset") ?? "";
    expect(desktopSet).toContain(`${base}=w2560-fcrop64=1%2C00005a57ffffa5a8`);
    expect(desktopSet.split(", ")).toHaveLength(3);
    const mobile = banner.parentElement?.querySelector("source");
    expect(mobile?.getAttribute("srcset")).toContain(`${base}=w640-fcrop64=1%2C32b75a57cd48a5a8`);
    expect(desktopSet).not.toMatch(/fcrop64=1,/);
  });
});
