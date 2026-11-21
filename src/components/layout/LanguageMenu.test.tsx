import { screen, fireEvent, waitFor } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import { afterEach, describe, it, expect } from "vitest";
import { i18n } from "../../i18n";
import { SeoHead } from "../SeoHead";
import { LanguageMenu } from "./LanguageMenu";
import { renderWithProviders } from "../../test/renderWithProviders";

function AboutLabel() {
  const { t } = useTranslation();
  return <span data-testid="about-label">{t("nav.about")}</span>;
}

function renderMenu() {
  return renderWithProviders(
    <>
      <SeoHead />
      <LanguageMenu />
      <AboutLabel />
    </>,
  );
}

describe("LanguageMenu", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("lists the four languages in their own scripts", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: /switch language/i }));
    const options = screen.getAllByRole("option").map((o) => o.textContent);
    expect(options).toEqual(["English✓", "Français", "हिन्दी", "বাংলা"]);
  });

  it("switches the page to Hindi and updates <html lang>", async () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: /switch language/i }));
    fireEvent.click(screen.getByRole("option", { name: "हिन्दी" }));
    await waitFor(() => {
      expect(screen.getByTestId("about-label")).toHaveTextContent("मेरे बारे में");
    });
    await waitFor(() => {
      expect(document.documentElement.getAttribute("lang")).toBe("hi");
    });
    expect(screen.getByRole("button", { name: /हिन्दी/ })).toHaveAttribute("aria-expanded", "false");
  });

  it("supports keyboard selection and Escape", async () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: /switch language/i });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const list = screen.getByRole("listbox");
    fireEvent.keyDown(list, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const reopened = screen.getByRole("listbox");
    fireEvent.keyDown(reopened, { key: "End" });
    fireEvent.keyDown(reopened, { key: "Enter" });
    await waitFor(() => {
      expect(screen.getByTestId("about-label")).toHaveTextContent("আমার সম্পর্কে");
    });
  });
});
