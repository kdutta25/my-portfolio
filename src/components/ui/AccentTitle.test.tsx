import { describe, it, expect } from "vitest";
import { splitAccent } from "./AccentTitle";
import { startYear } from "./YearTimeline";

describe("splitAccent", () => {
  it("splits the last word off multi-line headings", () => {
    expect(splitAccent("YEARS OF\nEXPERIENCE")).toEqual({
      lead: "YEARS OF\n",
      accent: "EXPERIENCE",
    });
  });

  it("treats a single word as the accent", () => {
    expect(splitAccent("EDUCATION")).toEqual({ lead: "", accent: "EDUCATION" });
  });
});

describe("startYear", () => {
  it("reads the first year from a period", () => {
    expect(startYear("Feb 2024 — Present")).toBe("2024");
    expect(startYear("juil. 2017 — juin 2018")).toBe("2017");
    expect(startYear("Present")).toBe("");
  });
});
