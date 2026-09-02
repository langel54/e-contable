import {
  getInteractionTransition,
  getInteractionFocusRing,
} from "../appTokens";

// ==============================|| OVERRIDES - LINK ||============================== //

export default function Link(theme) {
  return {
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
          ...getInteractionTransition(),
          ...getInteractionFocusRing(theme, "primary"),
          "&:hover": {
            color: theme.palette.primary.main,
          },
        },
      },
    },
  };
}
