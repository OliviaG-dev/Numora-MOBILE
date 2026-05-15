/** Palette alignée sur Numora web (`src/index.css`). */
export const colors = {
  primaryPurple: "#6b46c1",
  primaryPurpleLight: "#8b5cf6",
  primaryPurpleDark: "#553c9a",
  secondaryGold: "#f59e0b",
  secondaryGoldLight: "#fbbf24",
  bgPrimary: "#0f0f23",
  bgSecondary: "#1a1a40",
  bgTertiary: "#2d2d5f",
  textPrimary: "#ffffff",
  textSecondary: "#e2e8f0",
  textMuted: "#94a3b8",
  textOnGold: "#0f0f23",
  error: "#f87171",
  purpleGlass: "rgba(139, 92, 246, 0.15)",
  purpleBorder: "rgba(139, 92, 246, 0.35)"
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
} as const;

export const radii = {
  sm: 8,
  md: 12,
  pill: 50
} as const;
