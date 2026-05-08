import { describe, it, expect } from "vitest";
import { findKnowledgeAnswer } from "./matchKnowledge";

describe("matchKnowledge", () => {
  it("returns Nokia-related excerpt for relevant query", () => {
    const out = findKnowledgeAnswer(
      "What do you do at Nokia with Module Federation?",
    );
    expect(out).toBeTruthy();
    expect(out!.toLowerCase()).toMatch(/nokia|module federation|nsp/i);
  });

  it("handles LinkedIn-only intent", () => {
    const out = findKnowledgeAnswer("linkedin");
    expect(out).toBeTruthy();
    expect(out!.toLowerCase()).toMatch(/nokia|ottawa|react/i);
  });

  it("returns education hint for GPA query", () => {
    const out = findKnowledgeAnswer("What was your master's GPA at Ottawa?");
    expect(out).toBeTruthy();
    expect(out!.toLowerCase()).toMatch(/gpa|9\.0|ottawa|master/i);
  });
});
