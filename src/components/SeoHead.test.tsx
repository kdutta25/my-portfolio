import { waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SeoHead } from "./SeoHead";
import { renderWithProviders } from "../test/renderWithProviders";

describe("SeoHead", () => {
  it("sets document title from translations", async () => {
    renderWithProviders(<SeoHead />);
    await waitFor(() => {
      expect(document.title).toMatch(/Kaus Dutta/i);
    });
  });
});
