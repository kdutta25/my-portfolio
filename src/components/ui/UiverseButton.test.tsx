import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UiverseButton } from "./UiverseButton";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("UiverseButton", () => {
  it("handles click", () => {
    const onClick = vi.fn();
    renderWithProviders(<UiverseButton onClick={onClick}>go</UiverseButton>);
    fireEvent.click(screen.getByRole("button", { name: "go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
