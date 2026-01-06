import React from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DrawerComponent = ({
  open,
  onClose,
  title,
  icon,
  width = 480,
  content,
  zIndex = 1,
  backdropOpacity = 0.35,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      hideBackdrop={false}
      ModalProps={{
        keepMounted: true,
        disableEnforceFocus: true,
        slotProps: {
          backdrop: {
            sx: {
              zIndex: zIndex - 1,
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : `rgba(0,0,0,${backdropOpacity})`,
              backdropFilter: 'blur(2px)',
            },
          },
        },
      }}
      sx={{ zIndex }}
      PaperProps={{
        sx: {
          width,
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : theme.palette.background.paper,
          backgroundImage: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))' : 'none',
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          paddingTop: "72px",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {icon}
          <Typography variant="h5" noWrap>
            {title}
          </Typography>
        </Stack>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2, overflowY: "auto" }}>{content}</Box>
    </Drawer>
  );
};

export default DrawerComponent;
