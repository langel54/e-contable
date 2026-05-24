import { getInteractionTransition, getInteractionFocusRing } from "../appTokens";

// ==============================|| OVERRIDES - BUTTON BASE ||============================== //

export default function ButtonBase(theme) {
  return {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          ...getInteractionTransition(),
          ...getInteractionFocusRing(theme, "primary"),
        },
      },
    },
  };
}
