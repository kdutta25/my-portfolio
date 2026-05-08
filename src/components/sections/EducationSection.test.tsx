import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EducationSection } from "./EducationSection";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("EducationSection", () => {
  it("lists University of Ottawa", () => {
    renderWithProviders(<EducationSection />);
    expect(screen.getByText(/University of Ottawa/i)).toBeInTheDocument();
  });
});
