// material-ui
import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

// third-party
import { presetPalettes } from "@ant-design/colors";

// project import
import ThemeOption from "./theme";

// ==============================|| HELPERS - Misma tonalidad ||============================== //
// Aclara u oscurece un hex manteniendo la tonalidad (evita morados/descuadres en hover)

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("");
}
function lightenHex(hex, amount = 35) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + amount, g + amount, b + amount);
}
function darkenHex(hex, amount = 25) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r - amount, g - amount, b - amount);
}

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  const colors = presetPalettes;

  // Theme configuration from environment variables with sensible fallbacks
  // PRIMARY COLOR (Institutional)
  const themePrimary = process.env.NEXT_PUBLIC_THEME_PRIMARY_MAIN || "#2496ed";

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

  // Variantes del primario en la misma tonalidad (evita morados en hover)
  paletteColor.primary.main = themePrimary;
  paletteColor.primary.light = lightenHex(themePrimary, 40);
  paletteColor.primary.dark = darkenHex(themePrimary, 20);
  paletteColor.primary.darker = darkenHex(themePrimary, 45);
  paletteColor.primary.lighter = alpha(themePrimary, 0.08);

  if (mode === "dark") {
    // Mismo color primario que en modo claro; variantes más claras para contraste sobre fondos oscuros
    paletteColor.primary.main = themePrimary;
    paletteColor.primary.contrastText = "#ffffff";
    paletteColor.primary.light = lightenHex(themePrimary, 55);
    paletteColor.primary.dark = darkenHex(themePrimary, 15);
    paletteColor.primary.darker = darkenHex(themePrimary, 35);
    paletteColor.primary.lighter = alpha(themePrimary, 0.2);

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
        hover: alpha(paletteColor.grey[500], mode === "dark" ? 0.08 : 0.04),
        selected: alpha(paletteColor.grey[500], mode === "dark" ? 0.12 : 0.08),
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
