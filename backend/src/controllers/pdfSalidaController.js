const path = require("path");
const fs = require("fs");
const pdfService = require("../services/pdfSalidaService");

const pdfController = {
  async generate(req, res) {
    try {
      const { idsalida } = req.params;
      // Crear archivo PDF en la carpeta temp-pdf manualmente
      const tempPdfDir = path.join(__dirname, '..', 'temp-pdf');
      if (!fs.existsSync(tempPdfDir)) {
        fs.mkdirSync(tempPdfDir, { recursive: true });
      }
      const pdfPath = path.join(tempPdfDir, `pdf-${idsalida}-${Date.now()}.pdf`);
      await pdfService.generatePDFFile(idsalida, pdfPath);
      res.sendFile(pdfPath, (err) => {
        if (err) {
          console.error("Error al enviar el PDF:", err);
          return res.status(500).json({ message: "Error al enviar el PDF" });
        }
        // Elimina el archivo PDF manualmente después de enviarlo
        fs.unlink(pdfPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("No se pudo eliminar el PDF temporal:", unlinkErr);
          } else {
            console.log(`PDF temporal eliminado: ${pdfPath}`);
          }
        });
      });
    } catch (error) {
      console.error("Error al generar PDF:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = pdfController;
