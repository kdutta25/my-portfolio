import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5.5rem;
  }

  html[data-bs-theme="dark"],
  html[data-bs-theme="light"] {
    color-scheme: dark light;
  }

  html[data-bs-theme="dark"] {
    color-scheme: dark;
  }

  html[data-bs-theme="light"] {
    color-scheme: light;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: ${({ theme }) => theme.fonts.sans};
    background-color: ${({ theme }) => theme.colors.bg};
    background-image:
      radial-gradient(
        circle at 85% 0%,
        ${({ theme }) => theme.colors.accentSoft} 0%,
        transparent 38%
      ),
      linear-gradient(
        180deg,
        ${({ theme }) => theme.colors.bg} 0%,
        ${({ theme }) => theme.colors.bgElevated} 100%
      );
    background-attachment: fixed;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    overflow-x: clip;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.text};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`;
