// material-ui
import { createTheme } from "@mui/material/styles";

// third-party
import { presetPalettes } from "@ant-design/colors";

// project import
import ThemeOption from "./theme";

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  const colors = presetPalettes;

  // Theme configuration from environment variables with sensible fallbacks
  // PRIMARY COLOR (Institutional)
  const themePrimary = process.env.NEXT_PUBLIC_THEME_PRIMARY_MAIN || "#1e3a8a";

  // LIGHT MODE BACKGROUNDS
  const themeBgDefault = process.env.NEXT_PUBLIC_THEME_BG_DEFAULT || "#f8fafc";
  const themeBgPaper = process.env.NEXT_PUBLIC_THEME_BG_PAPER || "#ffffff";

  // DARK MODE BACKGROUNDS
  const themeDarkBg = process.env.NEXT_PUBLIC_THEME_DARK_BG || "#0f172a";
  const themeDarkPaper = process.env.NEXT_PUBLIC_THEME_DARK_PAPER || "#1e293b";

  let greyPrimary = [
    "#ffffff",
    "#fafafa",
    "#f5f5f5",
    "#f0f0f0",
    "#d9d9d9",
    "#bfbfbf",
    "#8c8c8c",
    "#595959",
    "#262626",
    "#141414",
    "#000000",
  ];
  let greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
  let greyConstant = ["#fafafb", "#e6ebf1"];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors, presetColor, mode);

  // Apply institutional primary color to BOTH modes
  paletteColor.primary.main = themePrimary;
  paletteColor.primary.light = themePrimary;
  paletteColor.primary.dark = themePrimary;

  if (mode === "dark") {
    // Primary remains the same as institutional, just ensuring contrast
    paletteColor.primary.contrastText = "#ffffff";

    paletteColor.primary.lighter = "rgba(15, 23, 42, 0.1)";

    // Override secondary colors to be Slate-based for Dark Mode
    paletteColor.secondary.main = "#94a3b8"; // Slate 400
    paletteColor.secondary.light = "#cbd5e1"; // Slate 300
    paletteColor.secondary.dark = "#64748b"; // Slate 500
    paletteColor.secondary.lighter = themeDarkPaper; // Surface bg
    paletteColor.secondary.darker = themeDarkBg; // Main bg

    // Adjust grey palette to align with Slate/Midnight theme
    paletteColor.grey[0] = themeDarkPaper;
    paletteColor.grey[50] = "#1e293b"; // Same as paper for consistency
    paletteColor.grey[100] = "#334155";
    paletteColor.grey[200] = "#475569";
    paletteColor.grey[300] = "#64748b";
    paletteColor.grey[400] = "#94a3b8";
    paletteColor.grey[500] = "#cbd5e1";
    paletteColor.grey[600] = "#e2e8f0";
    paletteColor.grey[700] = "#f1f5f9";
    paletteColor.grey[800] = "#f8fafc";
    paletteColor.grey[900] = "#ffffff";
  } else {
    // Light mode refinements
    if (!paletteColor.background) paletteColor.background = {};
    paletteColor.background.default = themeBgDefault;
    paletteColor.background.paper = themeBgPaper;
  }

  return createTheme({
    palette: {
      mode,
      common: {
        black: "#000",
        white: "#fff",
      },
      ...paletteColor,
      text: {
        primary: mode === "dark" ? "#f1f5f9" : "#1e293b", // Slate 100 on dark, Slate 800 on light
        secondary: mode === "dark" ? "#94a3b8" : "#64748b", // Slate 400 on dark, Slate 500 on light
        disabled: paletteColor.grey[400],
      },
      action: {
        disabled: paletteColor.grey[300],
      },
      divider: mode === "dark" ? "rgba(255, 255, 255, 0.08)" : paletteColor.grey[200],
      background: {
        paper: mode === "dark" ? themeDarkPaper : themeBgPaper,
        default: mode === "dark" ? themeDarkBg : themeBgDefault,
      },
    },
  });
}
