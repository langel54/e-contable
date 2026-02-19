"use client";

import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography, alpha, useTheme } from "@mui/material";
import { Fullscreen } from "@mui/icons-material";
import SidebarThemeSelector from "./SidebarThemeSelector";
import SidebarProfile from "./SidebarProfile";

const SidebarFooter = ({ open }) => {
  const theme = useTheme();

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <Box sx={{ mt: 'auto', pt: 1 }}>
      <Divider sx={{ mb: 1, opacity: 0.6 }} />
      
      {open && (
        <List disablePadding sx={{ px: 1, mb: 1 }}>
          <ListItemButton 
            onClick={handleFullscreen}
            sx={{ 
                borderRadius: 2,
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Fullscreen fontSize="small" />
            </ListItemIcon>
            <ListItemText 
                primary="Pantalla completa" 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
            />
          </ListItemButton>
        </List>
      )}

      <SidebarThemeSelector open={open} />
      <SidebarProfile open={open} />
      
      {/* {open && (
        <Box sx={{ px: 2, pb: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
            v2.2.6
          </Typography>
        </Box>
      )} */}
    </Box>
  );
};

export default SidebarFooter;
