const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const drawRecibo = require("../utils/drawRecibo");
const ingresoService = require("./ingresoService");
// const salidaService = require("./salidaService");

const pdfService = {
  async generatePDFFile(idingreso, filePath) {
    const data = await ingresoService.getById(parseInt(idingreso));
    if (!data) throw new Error("Ingreso no encontrado");
    const tipoRecibo = `RI01 - ${String(data.idingreso).padStart(6, "0")}`;
    const reciboOptions = {
      tipo: "ingreso",
      tipoRecibo,
      titulo: "RECIBO DE INGRESO",
      concepto: "* OTROS INGRESOS",
      pagadoA: "RECIBIDO DE:",
    };
    return new Promise((resolve, reject) => {
      const folderPath = path.dirname(filePath);
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      const doc = new PDFDocument({ margin: 20, size: "A4" });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Cálculo de posiciones X para márgenes uniformes
      const pageWidth = 595;      // A4 width in puntos
      const reciboWidth = 270;    // ancho de cada recibo
      const numRecibos = 2;
      const totalRecibosWidth = numRecibos * reciboWidth;
      const totalMargin = pageWidth - totalRecibosWidth;
      const marginBetween = totalMargin / (numRecibos + 1);
      const positionsX = [
        marginBetween,
        marginBetween * 2 + reciboWidth
      ];

      positionsX.forEach(posX => {
        drawRecibo(doc, data, { offsetX: posX, ...reciboOptions });
      });

      doc.end();
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
  },
};

module.exports = pdfService;
