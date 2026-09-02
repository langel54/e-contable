import { alpha } from "@mui/material/styles";
import {
  getInteractionTransition,
  getInteractionFocusRing,
  getSubtleHover,
} from "../appTokens";

// ==============================|| OVERRIDES - TAB ||============================== //

export default function Tab(theme) {
  const primary = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";

  return {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 36,
          minWidth: "auto",
          px: 2,
          py: 0.75,
          borderRadius: theme.shape.borderRadius - 2,
          fontWeight: 600,
          fontSize: "0.8125rem",
          textTransform: "none",
          color: theme.palette.text.secondary,
          ...getInteractionTransition(),
          ...getInteractionFocusRing(theme, "primary"),
          "&:hover": {
            color: theme.palette.text.primary,
            ...getSubtleHover(theme, "primary"),
          },
          "&.Mui-selected": {
            color: theme.palette.primary.contrastText,
            backgroundColor: primary,
            boxShadow: `0 1px 4px ${alpha(primary, isDark ? 0.3 : 0.2)}`,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        },
      },
    },
  };
}
