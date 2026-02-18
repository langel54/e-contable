import React from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
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
              backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.black, 0.7)
              : alpha(theme.palette.common.black, backdropOpacity),
              backdropFilter: 'blur(2px)',
            },
          },
        },
      }}
      sx={{ zIndex }}
      PaperProps={{
        sx: {
          width,
          // Use theme palette for consistency
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.paper, 
          backgroundImage: 'none', 
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
          // paddingTop: "72px",
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
