import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AnimeReveal } from "./AnimeReveal";
import { GlowCard } from "./GlowCard";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("AnimeReveal", () => {
  it("renders children", () => {
    renderWithProviders(
      <AnimeReveal>
        <GlowCard data-animate>revealed</GlowCard>
      </AnimeReveal>,
    );
    expect(screen.getByText("revealed")).toBeInTheDocument();
  });
});
