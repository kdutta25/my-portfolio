import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkillsSection } from "./SkillsSection";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("SkillsSection", () => {
  it("renders professional skillset and AI models subsection", () => {
    renderWithProviders(<SkillsSection />);
    expect(
      screen.getByRole("region", { name: /SKILLSET/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /MODELS/i }),
    ).toBeInTheDocument();
  });
});
