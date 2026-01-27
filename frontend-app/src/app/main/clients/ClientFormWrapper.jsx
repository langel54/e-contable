import React, { useState } from "react";
import { Box, FormControlLabel, Checkbox, Typography, Divider } from "@mui/material";
import ClientForm from "./ClientForm";
import QuickClientForm from "./QuickClientForm";

const ClientFormWrapper = ({
  handleCloseModal,
  initialData = null,
  formAction = "update",
  idclienteprov = null,
}) => {
  const [quickMode, setQuickMode] = useState(false);

  // Si hay datos iniciales (modo edición), no mostrar opción de modo rápido
  const isEditMode = !!initialData;

  return (
    <Box>
      {!isEditMode && (
        <>
          <Box sx={{ mb: 2, pb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={quickMode}
                  onChange={(e) => setQuickMode(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Usar modo rápido (solo campos esenciales)
                </Typography>
              }
            />
          </Box>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {quickMode && !isEditMode ? (
        <QuickClientForm handleCloseModal={handleCloseModal} />
      ) : (
        <ClientForm
          handleCloseModal={handleCloseModal}
          initialData={initialData}
          formAction={formAction}
          idclienteprov={idclienteprov}
        />
      )}
    </Box>
  );
};

export default ClientFormWrapper;
