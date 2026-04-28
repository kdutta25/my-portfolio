import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Keeps <html lang="..."> in sync with the active i18n language (a11y + font selection).
 */
function I18nSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const code = (i18n.language || "en").split("-")[0];
    document.documentElement.setAttribute("lang", code);
    document.documentElement.setAttribute("dir", "ltr");
  }, [i18n.language]);

  return null;
}

export default I18nSync;
