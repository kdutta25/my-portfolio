import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";
import { renderWithProviders } from "./test/renderWithProviders";

describe("App", () => {
  it("renders primary landmarks", () => {
    renderWithProviders(<App />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
