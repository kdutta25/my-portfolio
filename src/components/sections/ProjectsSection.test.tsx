import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProjectsSection } from "./ProjectsSection";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("ProjectsSection", () => {
  it("shows Hyperledger project", () => {
    renderWithProviders(<ProjectsSection />);
    expect(
      screen.getByRole("heading", {
        name: /Hyperledger vehicle ownership/i,
      }),
    ).toBeInTheDocument();
  });
});
