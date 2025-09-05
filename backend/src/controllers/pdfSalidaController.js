const path = require("path");
const fs = require("fs");
const pdfService = require("../services/pdfSalidaService");

const pdfController = {
  async generate(req, res) {
    try {
      const { idsalida } = req.params;
      const pdfPath = path.join(
        __dirname,
        "..",
        "temp-pdf",
        `pdf-${idsalida}.pdf`
      );
      await pdfService.generatePDFFile(idsalida, pdfPath);
      res.sendFile(pdfPath, (err) => {
        if (err) {
          console.error("Error al enviar el PDF:", err);
          return res.status(500).json({ message: "Error al enviar el PDF" });
        }
        fs.unlink(pdfPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error al eliminar el PDF:", unlinkErr);
          } else {
            console.log(`PDF eliminado: ${pdfPath}`);
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
