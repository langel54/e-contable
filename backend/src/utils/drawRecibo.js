const path = require("path");
const numeroAFormatoContable = require("./convertNumberToText");
const formatearMoneda = require("./formatToMoney");

function drawRecibo(doc, recibo, options = {}) {
  const {
    offsetX = 30,
    tipoRecibo = "RI01",
    ciudad = "ILAVE",
    fecha = new Date(recibo.fecha).toLocaleDateString("es-PE"),
    periodo = recibo.periodo?.nom_periodo + "-" + recibo.anio || "----",
    observacion = recibo.observacion || "---",
    responsable = recibo.registra,
    estado = recibo.estado?.nom_estado || recibo.estado,
    idestado = recibo.idestado,
    tipo = "ingreso", // "ingreso" o "egreso"
    concepto = options.concepto ||
      (tipo === "ingreso" ? "* OTROS INGRESOS" : "* OTROS GASTOS"),
    titulo = options.titulo ||
      (tipo === "ingreso" ? "RECIBO DE INGRESO" : "RECIBO DE EGRESO"),
    pagadoA = options.pagadoA ||
      (tipo === "ingreso" ? "RECIBIDO DE:" : "ENTREGADO A:"),
  } = options;

  const nombre =
    recibo.cliente_prov?.razonsocial || recibo.cliente_prov?.nombre || "------";
  const importe = parseFloat(recibo.importe || 0).toFixed(2);
  const montoTexto = numeroAFormatoContable(importe);
  const importeFormateado = formatearMoneda(importe);

  const width = 270;
  const leftX = offsetX;
  const startY = 30;

  const logoPath = path.join(__dirname, "..", "assets", "images", "logo.png");
  const logoWidth = 40;
  const logoHeight = 40;

  doc.image(logoPath, leftX, startY, { width: logoWidth, height: logoHeight });

  const textOffsetX = leftX + logoWidth + 10;

  doc
    .fontSize(10)
    .text("Soluciones Contables SAC", textOffsetX, startY)
    .text("Jr. Mollendo # 219 - 2do Piso", textOffsetX, startY + 12)
    .text("ILAVE - EL COLLAO - PUNO", textOffsetX, startY + 24)
    .text(
      "Telf. (051) 552096 - 981 838364 - 950 400101",
      textOffsetX,
      startY + 36
    );

  doc
  .fontSize(11)
  .font("Helvetica-Bold")
  .text(`${tipoRecibo}`, leftX + width - 80, startY); // 190 -> width - 80

  doc
    .moveTo(leftX, startY + 55)
    .lineTo(leftX + width, startY + 55)
    .dash(3)
    .stroke()
    .undash();

  const cuerpoY = startY + 65;
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(titulo, leftX, cuerpoY)
  .text(`S/ ${importeFormateado}`, leftX + width - 90, cuerpoY); // 180 -> width - 90

  // doc
  //   .fontSize(9)
  //   .font("Helvetica")
  //   .text(`PERIODO: ${periodo}", leftX, cuerpoY + 20);
  // ---- PERIODO EN UN CUADRO CENTRADO ----
  
  const periodoTexto = `PERIODO: ${periodo}`;
  doc.fontSize(9).font("Helvetica-Bold");

  const textWidth = doc.widthOfString(periodoTexto);
  const textHeight = doc.currentLineHeight();

  const boxWidth = width; // margen lateral
  const boxHeight = textHeight + 10; // margen vertical

  // Centramos dentro del ancho disponible (width = 270)
  const boxX = leftX + (width - boxWidth) / 2;
  const boxY = cuerpoY + 20;

  // Dibujar el rectángulo
  doc.rect(boxX, boxY, boxWidth, boxHeight).stroke();

  // Escribir el texto centrado dentro del cuadro
  doc.text(periodoTexto, boxX, boxY + (boxHeight - textHeight) / 2, {
    width: boxWidth,
    align: "center",
  });
  // -----------------------------------------
  doc.fontSize(8).font("Helvetica");
  const bloqueY = cuerpoY + 50;
  const linea = 24;

  doc
    .text(pagadoA, leftX, bloqueY)
    .fontSize(8)
    .text(nombre, leftX + width * 0.25, bloqueY, { width: width * 0.65, height: 28 }); // 68 -> width*0.25, 175->width*0.65

  doc
    .text("LA SUMA DE:", leftX, bloqueY + linea)
    .text(montoTexto, leftX + width * 0.25, bloqueY + linea, { width: width * 0.65, height: 28 });

  doc
    .text("POR CONCEPTO DE:", leftX, bloqueY + linea * 2)
    .text(concepto, leftX + width * 0.36, bloqueY + linea * 2); // 98 -> width*0.36

  doc
    .text("DETALLE:", leftX, bloqueY + linea * 3)
    .text(observacion, leftX + width * 0.2, bloqueY + linea * 3, {
      width: width * 0.68,
      height: 28,
    }); // 53->width*0.2, 185->width*0.68

  doc.text(`${ciudad}, ${fecha}`, leftX + width * 0.33, bloqueY + linea * 4 + 10); // 90->width*0.33

  const firmasY = bloqueY + linea * 5 + 30;

  doc
    .moveTo(leftX, firmasY)
    .lineTo(leftX + width * 0.44, firmasY)
    .stroke()
    .text("V° B° Caja SOLCONSA", leftX + width * 0.055, firmasY + 4); // 120->width*0.44, 15->width*0.055

  doc
    .moveTo(leftX + width * 0.52, firmasY)
    .lineTo(leftX + width, firmasY)
    .stroke()
    .text("RECIBÍ CONFORME", leftX + width * 0.57, firmasY + 4); // 140->width*0.52, 260->width, 155->width*0.57

  doc
    .fontSize(6)
    .text(
      `SOLCONSA-${responsable} | Impreso: ${new Date().toLocaleString(
        "es-PE"
      )}`,
      leftX,
      firmasY + 25
    )
  .text("CAJA / " + estado + "*", leftX + width * 0.76, firmasY + 25); // 205->width*0.76

  if (idestado == 2) {
    const text = " ANULADO ";
    const centerX = leftX + width / 2;
    const centerY = startY + 150; // Ajusta 150 si quieres mover la marca más arriba o abajo

    doc.save();
    doc
      .fillColor("red")
      .fontSize(50)
      .opacity(0.2)
      .rotate(-45, { origin: [centerX, centerY] })
      .text(text, leftX, centerY - 30, {
        width: width,
        align: "center",
      });
    doc.restore();
  }
}

module.exports = drawRecibo;
