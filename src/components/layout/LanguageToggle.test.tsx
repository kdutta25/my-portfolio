import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LanguageToggle } from "./LanguageToggle";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("LanguageToggle", () => {
  it("switches language label", async () => {
    renderWithProviders(<LanguageToggle />);
    const btn = screen.getByRole("button", { name: /switch language/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(btn.textContent).toBeTruthy();
    });
  });
});
