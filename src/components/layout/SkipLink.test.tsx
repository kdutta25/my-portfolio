import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkipLink } from "./SkipLink";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("SkipLink", () => {
  it("renders accessible skip link", () => {
    renderWithProviders(<SkipLink href="#main" label="Skip" />);
    const link = screen.getByRole("link", { name: "Skip" });
    expect(link).toHaveAttribute("href", "#main");
  });
});
