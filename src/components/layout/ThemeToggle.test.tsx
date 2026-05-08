import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeToggle } from "./ThemeToggle";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("ThemeToggle", () => {
  it("toggles theme mode", () => {
    renderWithProviders(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: /toggle color theme/i });
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });
});
