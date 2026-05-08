import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AboutSection } from "./AboutSection";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("AboutSection", () => {
  it("renders about region", () => {
    renderWithProviders(<AboutSection />);
    expect(
      screen.getByRole("heading", { name: /about[\s\n]*me/i }),
    ).toBeInTheDocument();
  });
});
