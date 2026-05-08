import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SiteFooter } from "./SiteFooter";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("SiteFooter", () => {
  it("renders built-with line", () => {
    renderWithProviders(<SiteFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText(/React/i)).toBeInTheDocument();
  });
});
