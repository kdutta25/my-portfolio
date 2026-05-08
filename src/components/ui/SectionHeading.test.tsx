import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SectionHeading } from "./SectionHeading";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("SectionHeading", () => {
  it("exposes heading id for aria-labelledby", () => {
    renderWithProviders(
      <SectionHeading
        headingId="x-heading"
        eyebrow="Eyebrow"
        title="Title text"
      />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName(
      "Title text",
    );
    expect(document.getElementById("x-heading")).toBeTruthy();
  });
});
