import {
  getInteractionTransition,
  getInteractionFocusRing,
  getSubtleHover,
  getSubtleActive,
} from "../appTokens";

// ==============================|| OVERRIDES - ICON BUTTON ||============================== //

export default function IconButton(theme) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          ...getInteractionTransition(),
          ...getInteractionFocusRing(theme, "primary"),
          "&:hover": getSubtleHover(theme, "primary"),
          "&:active": getSubtleActive(theme, "primary"),
        },
        sizeLarge: {
          width: theme.spacing(5.5),
          height: theme.spacing(5.5),
          fontSize: "1.25rem",
        },
        sizeMedium: {
          width: theme.spacing(4.5),
          height: theme.spacing(4.5),
          fontSize: "1rem",
        },
        sizeSmall: {
          width: theme.spacing(3.75),
          height: theme.spacing(3.75),
          fontSize: "0.75rem",
        },
      },
    },
  };
}
