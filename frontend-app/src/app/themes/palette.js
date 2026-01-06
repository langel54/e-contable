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
    paletteColor.primary.main = "#818cf8"; // Softer Indigo
    paletteColor.primary.light = "#a5b4fc";
    paletteColor.primary.dark = "#6366f1";
    paletteColor.primary.lighter = "rgba(129, 140, 248, 0.1)";
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
        primary: mode === "dark" ? "#ececec" : paletteColor.grey[700], // Soft White
        secondary: mode === "dark" ? "#b0b0b0" : paletteColor.grey[500], // Soft Grey
        disabled: paletteColor.grey[400],
      },
      action: {
        disabled: paletteColor.grey[300],
      },
      divider: mode === "dark" ? "rgba(255, 255, 255, 0.12)" : paletteColor.grey[200],
      background: {
        paper: mode === "dark" ? "#1e1e1e" : paletteColor.grey[0], // Surface
        default: mode === "dark" ? "#121212" : paletteColor.grey.A50, // Base
      },
    },
  });
}
