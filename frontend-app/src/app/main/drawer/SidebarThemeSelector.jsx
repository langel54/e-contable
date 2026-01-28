"use client";

import { Box, Button, Stack, Typography, useTheme, alpha } from "@mui/material";
import { WbSunnyOutlined, DarkModeOutlined } from "@mui/icons-material";
import { useAuth } from "@/app/provider";

const SidebarThemeSelector = ({ open }) => {
  const theme = useTheme();
  const { mode, toggleMode } = useAuth();

  if (!open) return null;

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          p: 0.5,
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05),
        }}
      >
        <Button
          fullWidth
          size="small"
          onClick={() => mode === "dark" && toggleMode()}
          startIcon={<WbSunnyOutlined sx={{ fontSize: '18px !important' }} />}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontSize: "0.75rem",
            color: mode === "light" ? "primary.main" : "text.secondary",
            bgcolor: mode === "light" ? "background.paper" : "transparent",
            boxShadow: mode === "light" ? theme.customShadows.z1 : "none",
            "&:hover": {
              bgcolor: mode === "light" ? "background.paper" : alpha(theme.palette.text.primary, 0.05),
            },
          }}
        >
          Claro
        </Button>
        <Button
          fullWidth
          size="small"
          onClick={() => mode === "light" && toggleMode()}
          startIcon={<DarkModeOutlined sx={{ fontSize: '18px !important' }} />}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontSize: "0.75rem",
            color: mode === "dark" ? "primary.main" : "text.secondary",
            bgcolor: mode === "dark" ? "background.paper" : "transparent",
            boxShadow: mode === "dark" ? theme.customShadows.z1 : "none",
            "&:hover": {
              bgcolor: mode === "dark" ? "background.paper" : alpha(theme.palette.text.primary, 0.05),
            },
          }}
        >
          Oscuro
        </Button>
      </Stack>
    </Box>
  );
};

export default SidebarThemeSelector;
