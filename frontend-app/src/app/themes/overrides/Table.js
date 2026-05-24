import { alpha } from "@mui/material/styles";
import { getTableHeaderBg } from "../appTokens";

// ==============================|| OVERRIDES - TABLE ||============================== //

export default function Table(theme) {
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.customShadows?.z1,
          overflow: "hidden",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: getTableHeaderBg(theme),
          "& .MuiTableCell-root": {
            borderBottom: `2px solid ${alpha(primary, isDark ? 0.35 : 0.25)}`,
            fontSize: "0.8125rem",
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: "0.01em",
            textTransform: "none",
            color: theme.palette.text.secondary,
            py: 1.5,
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root": {
            transition: "background 0.15s ease",
            "&:nth-of-type(even)": {
              backgroundColor: isDark
                ? alpha(theme.palette.common.white, 0.02)
                : alpha(theme.palette.grey[500], 0.035),
            },
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "&:last-of-type .MuiTableCell-root": {
              borderBottom: "none",
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: `${alpha(primary, isDark ? 0.14 : 0.08)} !important`,
          },
          "&.Mui-selected:hover": {
            backgroundColor: `${alpha(primary, isDark ? 0.16 : 0.1)} !important`,
          },
        },
      },
    },
  };
}
