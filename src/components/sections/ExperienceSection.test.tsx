import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ExperienceSection } from "./ExperienceSection";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("ExperienceSection", () => {
  it("lists Nokia experience", () => {
    renderWithProviders(<ExperienceSection />);
    expect(screen.getAllByText(/Nokia/i).length).toBeGreaterThan(0);
  });
});
