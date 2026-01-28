// material-ui
import { createTheme } from "@mui/material/styles";

// third-party
import { presetPalettes } from "@ant-design/colors";

// project import
import ThemeOption from "./theme";

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  const colors = presetPalettes;

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

  // Custom primary for dark mode to be a softer blue/indigo
  if (mode === "dark") {
    paletteColor.primary.main = "#2f6df6";
    paletteColor.primary.light = "#5b8cff";
    paletteColor.primary.dark = "#1f4fe0";

    paletteColor.primary.lighter = "rgba(15, 15, 32, 0.1)";

    // Override secondary colors to be Slate-based for Dark Mode
    paletteColor.secondary.main = "#94a3b8"; // Slate 400
    paletteColor.secondary.light = "#cbd5e1"; // Slate 300
    paletteColor.secondary.dark = "#64748b"; // Slate 500
    paletteColor.secondary.lighter = "#1e293b"; // Slate 800 (Card bg)
    paletteColor.secondary.darker = "#0f172a"; // Slate 900 (Main bg)

    // Adjust grey palette to avoid bright flashes if components use it directly
    paletteColor.grey[0] = "#1e293b"; // Replaces paper
    paletteColor.grey[50] = "#253046";
    paletteColor.grey[100] = "#334155";
    paletteColor.grey[200] = "#475569";
    paletteColor.grey[300] = "#64748b";
    paletteColor.grey[400] = "#94a3b8";
    paletteColor.grey[500] = "#cbd5e1";
    paletteColor.grey[600] = "#e2e8f0";
    paletteColor.grey[700] = "#f1f5f9";
    paletteColor.grey[800] = "#f8fafc";
    paletteColor.grey[900] = "#ffffff";
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
        primary: mode === "dark" ? "#f1f5f9" : paletteColor.grey[700], // Slate 100
        secondary: mode === "dark" ? "#94a3b8" : paletteColor.grey[500], // Slate 400
        disabled: paletteColor.grey[400],
      },
      action: {
        disabled: paletteColor.grey[300],
      },
      divider: mode === "dark" ? "rgba(255, 255, 255, 0.08)" : paletteColor.grey[200],
      background: {
        paper: mode === "dark" ? "#1e293b" : "#ffffff",
        default: mode === "dark" ? "#0f172a" : "#f8f8f8", // Soft slate grey for light mode
      },
    },
  });
}
