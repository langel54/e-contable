import { getMenuPaperSx, getNavListItemSx } from "../appTokens";

// ==============================|| OVERRIDES - MENU ||============================== //

export default function Menu(theme) {
  return {
    MuiMenu: {
      styleOverrides: {
        paper: {
          ...getMenuPaperSx(theme),
          marginTop: 6,
        },
        list: {
          py: 0.75,
          px: 0.5,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: 1.5,
          mx: 0.5,
          my: 0.25,
          minHeight: 40,
          fontSize: "0.875rem",
          fontWeight: 500,
          ...getNavListItemSx(theme, Boolean(ownerState.selected)),
        }),
      },
    },
  };
}
