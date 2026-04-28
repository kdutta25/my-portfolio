import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const THEME_STORAGE_KEY = "portfolio-theme";
export const THEME_MODES = ["dark", "enhanced-dark"];

const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
});

function normalizeTheme(value) {
  if (value === "light") return "dark";
  if (value && THEME_MODES.includes(value)) return value;
  return "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
  });

  const setTheme = (next) => {
    setThemeState(normalizeTheme(next));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
