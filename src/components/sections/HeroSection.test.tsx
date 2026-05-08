import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroSection } from "./HeroSection";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("HeroSection", () => {
  it("renders hero title and actions", () => {
    renderWithProviders(<HeroSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      /Kaustubh Dutta/i,
    );
    expect(screen.getByRole("button", { name: /View work/i })).toBeInTheDocument();
  });
});
