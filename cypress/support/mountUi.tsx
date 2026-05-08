import type { ReactElement } from "react";
import { mount } from "cypress/react";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { AppThemeProvider } from "../../src/theme/AppThemeProvider";
import { i18n } from "../../src/i18n";

export function mountUi(ui: ReactElement) {
  return mount(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <AppThemeProvider>{ui}</AppThemeProvider>
      </I18nextProvider>
    </HelmetProvider>,
  );
}
