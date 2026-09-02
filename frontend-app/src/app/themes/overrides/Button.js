import { alpha } from "@mui/material/styles";
import {
  getInteractionTransition,
  getInteractionFocusRing,
  getSubtleHover,
  getSubtleActive,
  getSubtleContainedHover,
  getSubtleContainedActive,
} from "../appTokens";

const COLOR_KEYS = ["primary", "secondary", "error", "success", "info", "warning"];

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildVariantHovers(theme) {
  const styles = {};

  COLOR_KEYS.forEach((key) => {
    styles[`contained${cap(key)}`] = {
      "&:hover": getSubtleContainedHover(theme, key),
      "&:active": getSubtleContainedActive(theme, key),
    };
    styles[`outlined${cap(key)}`] = {
      "&:hover": getSubtleHover(theme, key),
      "&:active": getSubtleActive(theme, key),
    };
    styles[`text${cap(key)}`] = {
      "&:hover": getSubtleHover(theme, key),
      "&:active": getSubtleActive(theme, key),
    };
  });

  return styles;
}

// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: theme.shape.borderRadius,
          ...getInteractionTransition(),
          ...getInteractionFocusRing(theme, "primary"),
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.2 : 0.08)}`,
          },
        },
        outlined: {
          "&:hover": {
            borderColor: "currentColor",
          },
        },
        ...buildVariantHovers(theme),
        sizeExtraSmall: {
          minWidth: 56,
          fontSize: "0.625rem",
          padding: "2px 8px",
        },
      },
    },
  };
}
