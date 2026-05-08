import styled from "styled-components";
import { useTranslation } from "react-i18next";

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

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const next = i18n.language.startsWith("fr") ? "en" : "fr";
  const label = t("nav.toggleLanguage");
  return (
    <Toggle
      type="button"
      onClick={() => void i18n.changeLanguage(next)}
      aria-label={label}
      title={label}
    >
      {i18n.language.startsWith("fr") ? "English" : "Français"}
    </Toggle>
  );
}
