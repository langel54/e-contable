import { alpha } from "@mui/material/styles";

// ==============================|| OVERRIDES - CSS BASELINE ||============================== //

export default function CssBaseline(theme) {
  const isDark = theme.palette.mode === "dark";
  const scrollbarThumb = isDark ? theme.palette.grey[400] : theme.palette.grey[300];

  return {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--app-bg": theme.palette.background.default,
          "--app-paper": theme.palette.background.paper,
          "--app-text": theme.palette.text.primary,
          "--app-primary": theme.palette.primary.main,
          "--scrollbar-thumb": scrollbarThumb,
        },
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
        },
        main: {
          border: "none",
          borderRadius: 0,
          boxShadow: "none",
          outline: "none",
          background: "none",
        },
        "::selection": {
          backgroundColor: alpha(theme.palette.primary.main, 0.25),
          color: theme.palette.text.primary,
        },
        "::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },
        "::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: scrollbarThumb,
          borderRadius: 6,
        },
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: `${scrollbarThumb} transparent`,
        },
      },
    },
  };
}
