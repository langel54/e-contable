"use client";

import { IconButton, useTheme } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useAuth } from "../provider";

const ThemeToggle = () => {
  const theme = useTheme();
  const { mode, toggleMode } = useAuth();

  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={toggleMode}
      color="inherit"
      aria-label="Toggle theme mode"
    >
      {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggle;
