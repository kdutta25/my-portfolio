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
});
