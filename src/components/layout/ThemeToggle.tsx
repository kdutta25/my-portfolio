import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../theme/AppThemeProvider";

const Toggle = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0.45rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

export function ThemeToggle() {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useAppTheme();
  const label = t("nav.toggleTheme");
  return (
    <Toggle
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {mode === "dark" ? "☀︎" : "☾"}{" "}
      {mode === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
    </Toggle>
  );
}
