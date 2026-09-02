import { alpha } from "@mui/material/styles";

// ==============================|| OVERRIDES - TABS ||============================== //

export default function Tabs(theme) {
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 42,
          padding: 3,
          borderRadius: theme.shape.borderRadius,
          bgcolor: isDark ? alpha(primary, 0.06) : alpha(theme.palette.grey[500], 0.06),
          border: `1px solid ${theme.palette.divider}`,
          backgroundImage: isDark
            ? `linear-gradient(180deg, ${alpha("#fff", 0.03)} 0%, transparent 100%)`
            : `linear-gradient(180deg, ${alpha("#fff", 0.6)} 0%, transparent 100%)`,
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& .MuiTabs-flexContainer": {
            gap: 3,
          },
          "& .MuiTabs-scrollButtons": {
            borderRadius: 1,
            color: "text.secondary",
            "&.Mui-disabled": { opacity: 0.35 },
          },
        },
        vertical: {
          overflow: "visible",
        },
      },
    },
  };
}
