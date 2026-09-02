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

  // Tema moderno: indigo + escala Slate (configurable por .env)
  const themePrimary = process.env.NEXT_PUBLIC_THEME_PRIMARY_MAIN || "#7c3aed";

  const themeBgDefault = process.env.NEXT_PUBLIC_THEME_BG_DEFAULT || "#f4f4f5";
  const themeBgPaper = process.env.NEXT_PUBLIC_THEME_BG_PAPER || "#ffffff";

  const themeDarkBg = process.env.NEXT_PUBLIC_THEME_DARK_BG || "#09090b";
  const themeDarkPaper = process.env.NEXT_PUBLIC_THEME_DARK_PAPER || "#18181b";

  // Escala Slate (coherente con texto y superficies)
  let greyPrimary = [
    "#ffffff",
    "#f8fafc",
    "#f1f5f9",
    "#e2e8f0",
    "#cbd5e1",
    "#94a3b8",
    "#64748b",
    "#475569",
    "#334155",
    "#1e293b",
    "#0f172a",
  ];
  let greyAscent = ["#f8fafc", "#94a3b8", "#475569", "#1e293b"];
  let greyConstant = ["#f8fafc", "#e2e8f0"];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors, presetColor, mode);

  // Variantes del primario en la misma tonalidad (evita morados en hover)
  paletteColor.primary.main = themePrimary;
  paletteColor.primary.light = lightenHex(themePrimary, 40);
  paletteColor.primary.dark = darkenHex(themePrimary, 20);
  paletteColor.primary.darker = darkenHex(themePrimary, 45);
  paletteColor.primary.lighter = alpha(themePrimary, 0.08);

  // Semánticos modernos (emerald, rose, amber, teal)
  const semantic = {
    success: { main: "#10b981", light: "#34d399", dark: "#059669" },
    error: { main: "#f43f5e", light: "#fb7185", dark: "#e11d48" },
    warning: { main: "#f59e0b", light: "#fbbf24", dark: "#d97706" },
    info: { main: "#14b8a6", light: "#2dd4bf", dark: "#0d9488" },
  };
  Object.entries(semantic).forEach(([key, tones]) => {
    paletteColor[key].main = tones.main;
    paletteColor[key].light = tones.light;
    paletteColor[key].dark = tones.dark;
    paletteColor[key].lighter = alpha(tones.main, mode === "dark" ? 0.18 : 0.1);
  });

  if (mode === "light") {
    paletteColor.grey[0] = "#ffffff";
    paletteColor.grey[50] = "#f8fafc";
    paletteColor.grey[100] = "#f1f5f9";
    paletteColor.grey[200] = "#e2e8f0";
    paletteColor.grey[300] = "#cbd5e1";
    paletteColor.grey[400] = "#94a3b8";
    paletteColor.grey[500] = "#64748b";
    paletteColor.grey[600] = "#475569";
    paletteColor.grey[700] = "#334155";
    paletteColor.grey[800] = "#1e293b";
    paletteColor.grey[900] = "#0f172a";
    paletteColor.secondary.main = "#64748b";
    paletteColor.secondary.light = "#94a3b8";
    paletteColor.secondary.dark = "#475569";
  }

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
      divider: mode === "dark" ? "rgba(148, 163, 184, 0.12)" : paletteColor.grey[200],
      background: {
        paper: mode === "dark" ? themeDarkPaper : themeBgPaper,
        default: mode === "dark" ? themeDarkBg : themeBgDefault,
      },
    },
  });
}
