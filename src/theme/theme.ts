export type ThemeMode = "light" | "dark";

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    bg: string;
    bgElevated: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    glow: string;
    focusRing: string;
    glassHighlight: string;
  };
  fonts: {
    sans: string;
    display: string;
    mono: string;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
    pill: string;
  };
  shadows: {
    card: string;
    glow: string;
    soft: string;
  };
}

/** Editorial palette — warm paper + ink (Framer / Sawad-inspired) */
export const lightTheme: AppTheme = {
  mode: "light",
  colors: {
    bg: "#f7f5f0",
    bgElevated: "#fffefb",
    surface: "#fffefb",
    border: "rgba(17, 17, 17, 0.12)",
    text: "#121212",
    muted: "#5a5856",
    accent: "#c2410c",
    accentSoft: "rgba(194, 65, 12, 0.12)",
    glow: "rgba(194, 65, 12, 0.25)",
    focusRing: "#ea580c",
    glassHighlight: "rgba(255,255,255,0.85)",
  },
  fonts: {
    sans: '"DM Sans", "Inter", system-ui, sans-serif',
    display: '"Syne", "DM Sans", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  radii: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    pill: "999px",
  },
  shadows: {
    card: "0 1px 0 rgba(17, 17, 17, 0.06), 0 24px 48px -28px rgba(17, 17, 17, 0.12)",
    glow: "0 18px 48px rgba(194, 65, 12, 0.15)",
    soft: "0 32px 64px -24px rgba(17, 17, 17, 0.14)",
  },
};

export const darkTheme: AppTheme = {
  mode: "dark",
  colors: {
    bg: "#141210",
    bgElevated: "#1c1a17",
    surface: "#1c1a17",
    border: "rgba(245, 242, 235, 0.1)",
    text: "#f5f2eb",
    muted: "#a8a39b",
    accent: "#fb923c",
    accentSoft: "rgba(251, 146, 60, 0.14)",
    glow: "rgba(251, 146, 60, 0.28)",
    focusRing: "#fdba74",
    glassHighlight: "rgba(255,255,255,0.04)",
  },
  fonts: {
    sans: '"DM Sans", "Inter", system-ui, sans-serif',
    display: '"Syne", "DM Sans", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  radii: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    pill: "999px",
  },
  shadows: {
    card: "0 1px 0 rgba(255,255,255,0.05), 0 28px 56px -20px rgba(0, 0, 0, 0.65)",
    glow: "0 20px 56px rgba(251, 146, 60, 0.12)",
    soft: "0 36px 72px -24px rgba(0, 0, 0, 0.55)",
  },
};
