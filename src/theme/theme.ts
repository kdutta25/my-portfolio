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
    /** Filled active states (nav pill, highlighted rows, primary buttons). */
    ink: string;
    /** Text drawn on top of `ink`. */
    onInk: string;
    /** Giant decorative watermark text. */
    watermark: string;
  };
  fonts: {
    sans: string;
    display: string;
    serif: string;
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

const fonts: AppTheme["fonts"] = {
  sans: '"DM Sans", "Inter", system-ui, sans-serif',
  display: '"DM Sans", "Inter", system-ui, sans-serif',
  serif: '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

const radii: AppTheme["radii"] = {
  sm: "10px",
  md: "16px",
  lg: "22px",
  pill: "999px",
};

/** Editorial palette — warm cream paper, navy ink, ember accent */
export const lightTheme: AppTheme = {
  mode: "light",
  colors: {
    bg: "#f3eee4",
    bgElevated: "#faf7f1",
    surface: "#fffdf8",
    border: "rgba(31, 36, 56, 0.12)",
    text: "#1b1f2e",
    muted: "#5d5f6b",
    accent: "#c2410c",
    accentSoft: "rgba(194, 65, 12, 0.12)",
    glow: "rgba(194, 65, 12, 0.25)",
    focusRing: "#ea580c",
    glassHighlight: "rgba(255,255,255,0.85)",
    ink: "#232b45",
    onInk: "#f7f3ea",
    watermark: "rgba(35, 43, 69, 0.06)",
  },
  fonts,
  radii,
  shadows: {
    card: "0 1px 0 rgba(31, 36, 56, 0.05), 0 24px 48px -28px rgba(31, 36, 56, 0.18)",
    glow: "0 18px 48px rgba(194, 65, 12, 0.15)",
    soft: "0 32px 64px -24px rgba(31, 36, 56, 0.2)",
  },
};

export const darkTheme: AppTheme = {
  mode: "dark",
  colors: {
    bg: "#121318",
    bgElevated: "#181a21",
    surface: "#1c1e26",
    border: "rgba(240, 236, 228, 0.1)",
    text: "#f2eee6",
    muted: "#a5a3a0",
    accent: "#fb923c",
    accentSoft: "rgba(251, 146, 60, 0.14)",
    glow: "rgba(251, 146, 60, 0.28)",
    focusRing: "#fdba74",
    glassHighlight: "rgba(255,255,255,0.04)",
    ink: "#e9e3d6",
    onInk: "#14161d",
    watermark: "rgba(242, 238, 230, 0.05)",
  },
  fonts,
  radii,
  shadows: {
    card: "0 1px 0 rgba(255,255,255,0.05), 0 28px 56px -20px rgba(0, 0, 0, 0.65)",
    glow: "0 20px 56px rgba(251, 146, 60, 0.12)",
    soft: "0 36px 72px -24px rgba(0, 0, 0, 0.55)",
  },
};
