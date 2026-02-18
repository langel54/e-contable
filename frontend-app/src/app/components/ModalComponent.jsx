import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ModalComponent = ({
  icon,
  open,
  handleClose,
  title,
  content,
  width = "80%",
}) => {
  return (
    <Modal
      open={open}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width,
          bgcolor: "background.paper",
          boxShadow: (theme) => theme.customShadows.z1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* Encabezado fijo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 10,
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {icon && React.cloneElement(icon, { sx: { color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main' } })}
            <Typography id="modal-title" variant="h5" component="h2" noWrap sx={{ color: "text.primary", fontWeight: 600 }}>
              {title}
            </Typography>
          </Stack>

          <IconButton onClick={handleClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Contenido scrollable */}
        <Box
          sx={{
            p: 2,
            overflowY: "auto",
          }}
        >
          {content}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
