import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { HelmetProvider } from "react-helmet-async";
import { i18n } from "../i18n";
import { AppThemeProvider } from "../theme/AppThemeProvider";

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <AppThemeProvider>{children}</AppThemeProvider>
        </I18nextProvider>
      </HelmetProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
