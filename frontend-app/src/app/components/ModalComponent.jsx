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
          boxShadow: 24,
          borderRadius: 2,
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
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {icon}
            <Typography id="modal-title" variant="h5" component="h2" noWrap>
              {title}
            </Typography>
          </Stack>

          <IconButton onClick={handleClose}>
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
