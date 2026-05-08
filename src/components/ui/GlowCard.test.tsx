import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GlowCard } from "./GlowCard";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("GlowCard", () => {
  it("renders children", () => {
    renderWithProviders(<GlowCard>hello card</GlowCard>);
    expect(screen.getByText("hello card")).toBeInTheDocument();
  });
});
