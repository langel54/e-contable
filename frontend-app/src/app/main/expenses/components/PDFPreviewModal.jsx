import { Box, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ModalComponent from "@/app/components/ModalComponent";
import { ReceiptLong } from "@mui/icons-material";
import { pdfSalidaService } from "@/app/services/pdfServices";

const PDFPreviewModal = ({ open, handleClose, data }) => {
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const generatePDF = async () => {
      if (!data) return;

      setLoading(true);
      try {
        // await new Promise((resolve) => setTimeout(resolve, 1500));

        const pdfBlob = await pdfSalidaService(data.idsalida);
        const pdfUrl = URL.createObjectURL(pdfBlob);

        setPdfUrl(pdfUrl);
      } catch (error) {
        console.error("Error al generar el PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && data) {
      generatePDF();
    }
  }, [open, data]);

  return (
    <ModalComponent
      icon={<ReceiptLong color="success" />}
      open={open}
      handleClose={handleClose}
      title="Vista Previa del Comprobante"
      width="800px"
      content={
        <Box sx={{ height: "70vh", width: "100%", position: "relative" }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography>Generando PDF...</Typography>
            </Box>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography color="error">
                Error al cargar el PDF. Por favor, intente nuevamente.
              </Typography>
            </Box>
          )}
        </Box>
      }
    />
  );
};

export default PDFPreviewModal;
