import { screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VolunteeringSection } from "./VolunteeringSection";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("VolunteeringSection", () => {
  it("shows volunteering heading", () => {
    renderWithProviders(<VolunteeringSection />);
    const region = screen.getByRole("region", { name: /Volunteering/i });
    expect(
      within(region).getByRole("heading", { name: /Volunteering/i }),
    ).toBeInTheDocument();
  });
});
