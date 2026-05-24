import { alpha } from "@mui/material/styles";
import { getTableHeaderBg } from "../appTokens";

// ==============================|| OVERRIDES - DATA GRID ||============================== //

export default function DataGrid(theme) {
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const headerBg = getTableHeaderBg(theme);

  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          fontSize: "0.875rem",
          "& .MuiDataGrid-withBorderColor": {
            borderColor: theme.palette.divider,
          },
          "& .MuiDataGrid-columnHeader": {
            background: `${headerBg} !important`,
            color: theme.palette.text.primary,
          },
          "& .MuiDataGrid-columnHeaders": {
            borderColor: theme.palette.divider,
            background: headerBg,
            borderBottom: `2px solid ${alpha(primary, isDark ? 0.35 : 0.25)}`,
            minHeight: "48px !important",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.8125rem",
            letterSpacing: "0.01em",
          },
          "& .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-menuIcon": {
            visibility: "visible",
            width: "auto",
            color: theme.palette.text.secondary,
          },
          "& .MuiDataGrid-sortIcon": {
            color: primary,
          },
          "& .MuiDataGrid-row": {
            minHeight: 48,
            transition: "background 0.15s ease",
            "&:nth-of-type(even)": {
              backgroundColor: isDark
                ? alpha(theme.palette.common.white, 0.02)
                : alpha(theme.palette.grey[500], 0.035),
            },
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "&.Mui-selected": {
              backgroundColor: `${alpha(primary, isDark ? 0.14 : 0.08)} !important`,
            },
            "&.Mui-selected:hover": {
              backgroundColor: `${alpha(primary, isDark ? 0.16 : 0.1)} !important`,
            },
          },
          "& .MuiDataGrid-cell": {
            borderColor: theme.palette.divider,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${theme.palette.divider}`,
            background: isDark
              ? alpha(theme.palette.background.paper, 0.9)
              : theme.palette.grey[50],
            minHeight: 48,
          },
          "& .MuiIconButton-colorInfo": {
            color: `${theme.palette.info.main} !important`,
          },
          "& .MuiIconButton-colorSuccess": {
            color: `${theme.palette.success.main} !important`,
          },
          "& .MuiIconButton-colorError": {
            color: `${theme.palette.error.main} !important`,
          },
          "& .MuiIconButton-colorWarning": {
            color: `${theme.palette.warning.main} !important`,
          },
          "& .MuiDataGrid-scrollbar": {
            zIndex: 1,
          },
        },
      },
    },
  };
}
