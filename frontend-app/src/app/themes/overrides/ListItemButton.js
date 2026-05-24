import { getNavListItemSx } from "../appTokens";

// ==============================|| OVERRIDES - LIST ITEM BUTTON ||============================== //

export default function ListItemButton() {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          ...getNavListItemSx(theme, Boolean(ownerState.selected)),
        }),
      },
    },
  };
}
