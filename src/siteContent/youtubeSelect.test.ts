import { describe, expect, it } from "vitest";
import { parseIsoDuration, parseWatchMinutes, selectTop } from "../../scripts/youtube-select.mjs";

describe("parseWatchMinutes", () => {
  it("reads estimatedMinutesWatched from an Analytics report", () => {
    const report = {
      kind: "youtubeAnalytics#resultTable",
      columnHeaders: [{ name: "estimatedMinutesWatched", columnType: "METRIC", dataType: "INTEGER" }],
      rows: [[74412]],
    };
    expect(parseWatchMinutes(report)).toBe(74412);
  });

  it("finds the column when other metrics come first", () => {
    const report = {
      columnHeaders: [{ name: "views" }, { name: "estimatedMinutesWatched" }],
      rows: [[36600, 1234.6]],
    };
    expect(parseWatchMinutes(report)).toBe(1235);
  });

  it("returns null when the column or value is missing", () => {
    expect(parseWatchMinutes(undefined)).toBeNull();
    expect(parseWatchMinutes({ columnHeaders: [{ name: "views" }], rows: [[1]] })).toBeNull();
    expect(parseWatchMinutes({ columnHeaders: [{ name: "estimatedMinutesWatched" }], rows: [] })).toBeNull();
  });
});

describe("parseIsoDuration", () => {
  it("parses hours, minutes and seconds", () => {
    expect(parseIsoDuration("PT1H2M3S")).toBe(3723);
    expect(parseIsoDuration("PT58S")).toBe(58);
    expect(parseIsoDuration("P1DT1S")).toBe(86401);
  });

  it("returns 0 for missing or invalid input", () => {
    expect(parseIsoDuration(undefined)).toBe(0);
    expect(parseIsoDuration("garbage")).toBe(0);
  });
});

describe("selectTop", () => {
  const items = [
    { id: "a", views: 10, isShort: false },
    { id: "b", views: 500, isShort: true },
    { id: "c", views: 90, isShort: false },
    { id: "d", views: 70, isShort: true },
    { id: "e", views: 300, isShort: false },
  ];

  it("splits videos from Shorts and sorts each by views", () => {
    const { topVideos, topShorts } = selectTop(items);
    expect(topVideos.map((v) => v.id)).toEqual(["e", "c", "a"]);
    expect(topShorts.map((v) => v.id)).toEqual(["b", "d"]);
  });

  it("respects the limits", () => {
    const { topVideos, topShorts } = selectTop(items, { videos: 1, shorts: 1 });
    expect(topVideos.map((v) => v.id)).toEqual(["e"]);
    expect(topShorts.map((v) => v.id)).toEqual(["b"]);
  });

  it("does not mutate the input", () => {
    const copy = items.map((i) => i.id);
    selectTop(items);
    expect(items.map((i) => i.id)).toEqual(copy);
  });
});
