const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const drawRecibo = require("../utils/drawRecibo");
const ingresoService = require("./ingresoService");
const salidaService = require("./salidaService");
const pdfService = {
  async generatePDFFile(id, filePath, tipo = "ingreso") {
    let data;
    let tipoRecibo;

    if (tipo === "ingreso") {
      data = await ingresoService.getById(parseInt(id));
      tipoRecibo = `RI01 - ${String(data.idingreso).padStart(6, "0")}`;
    } else if (tipo === "egreso") {
      data = await salidaService.getById(parseInt(id));
      tipoRecibo = `RE01 - ${String(data.idegreso).padStart(6, "0")}`;
    } else {
      throw new Error("Tipo de recibo no válido");
    }

    if (!data)
      throw new Error(
        `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} no encontrado`
      );

    return new Promise((resolve, reject) => {
      const folderPath = path.dirname(filePath);
      if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, { recursive: true });
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      const doc = new PDFDocument({ margin: 20, size: "A4" });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      drawRecibo(doc, data, { offsetX: 30, tipoRecibo });
      drawRecibo(doc, data, { offsetX: 310, tipoRecibo });

      doc.end();
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
  },
};

module.exports = pdfService;
