import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SiteHeader } from "./SiteHeader";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("SiteHeader", () => {
  it("renders brand and navigation landmark", () => {
    renderWithProviders(<SiteHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getAllByText(/Kaustubh Dutta/i).length).toBeGreaterThan(0);
  });
});
