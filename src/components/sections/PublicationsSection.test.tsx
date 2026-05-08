import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PublicationsSection } from "./PublicationsSection";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("PublicationsSection", () => {
  it("lists blockchain publication", () => {
    renderWithProviders(<PublicationsSection />);
    expect(screen.getAllByText(/Blockchain/i).length).toBeGreaterThan(0);
  });
});
