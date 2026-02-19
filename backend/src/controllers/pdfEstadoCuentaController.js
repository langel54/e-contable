const path = require("path");
const fs = require("fs");
const pdfService = require("../services/pdfEstadoCuentaService");

const pdfController = {
  async generate(req, res) {
    try {
      const { idclienteprov, year } = req.query;

      if (!idclienteprov) {
        return res
          .status(400)
          .json({ message: "El parámetro 'idclienteprov' es requerido." });
      }

      if (!year) {
        return res
          .status(400)
          .json({ message: "El parámetro 'year' es requerido." });
      }

      const pdfPath = path.join(
        __dirname,
        "..",
        "temp-pdf",
        `estado-cuenta-${idclienteprov}-${year}.pdf`
      );

      // Generar siempre el PDF, sobrescribiendo si existe
      await pdfService.generatePDFFile(idclienteprov, Number(year), pdfPath);

      // Enviar el archivo al cliente
      res.sendFile(pdfPath, (err) => {
        if (err) {
          console.error("Error al enviar el PDF:", err);
          return res.status(500).json({ message: "Error al enviar el PDF" });
        }

        // Eliminar el archivo luego de enviarlo
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

