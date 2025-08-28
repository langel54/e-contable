const path = require("path");
const numeroAFormatoContable = require("./convertNumberToText");
const formatearMoneda = require("./formatToMoney");

function drawRecibo(doc, ingreso, options = {}) {
  console.log("🚀 ~ drawRecibo ~ ingreso:", ingreso);
  const {
    offsetX = 30,
    tipoRecibo = "RI01",
    ciudad = "ILAVE",
    fecha = new Date(ingreso.fecha).toLocaleDateString("es-PE"),
    periodo = ingreso.periodo?.nom_periodo + "-" + ingreso.anio || "----",
    observacion = ingreso.observacion || "---",
    responsable = ingreso.registra,
    estado = ingreso.estado.nom_estado,
    idestado = ingreso.idestado,
  } = options;

  const nombre = ingreso.cliente_prov?.razonsocial || "------";
  const importe = parseFloat(ingreso.importe || 0).toFixed(2);
  const montoTexto = numeroAFormatoContable(importe);
  const importeFormateado = formatearMoneda(importe);

  const width = 270;
  const leftX = offsetX;
  const startY = 30;

  const logoPath = path.join(
    __dirname,
    "..",
    // "..",
    "assets",
    "images",
    "logo.png"
  );
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
    .text(`${tipoRecibo}`, leftX + 190, startY);

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
    .text("RECIBO DE INGRESO", leftX, cuerpoY)
    .text(`S/ ${importeFormateado}`, leftX + 180, cuerpoY);

  doc
    .fontSize(9)
    .font("Helvetica")
    .text(`PERIODO: ${periodo}`, leftX, cuerpoY + 20);

  const bloqueY = cuerpoY + 40;
  const linea = 24;

  doc
    .text("PAGADO A:", leftX, bloqueY)
    .fontSize(8)
    .text(nombre, leftX + 68, bloqueY, { width: 175, height: 28 });

  doc
    .text("LA SUMA DE:", leftX, bloqueY + linea)
    .text(montoTexto, leftX + 68, bloqueY + linea, { width: 175, height: 28 });

  doc
    .text("POR CONCEPTO DE:", leftX, bloqueY + linea * 2)
    .text("* OTROS GASTOS", leftX + 98, bloqueY + linea * 2);

  doc
    .text("DETALLE:", leftX, bloqueY + linea * 3)
    .text(observacion, leftX + 53, bloqueY + linea * 3, {
      width: 185,
      height: 28,
    });

  doc.text(`${ciudad}, ${fecha}`, leftX + 90, bloqueY + linea * 4 + 10);

  const firmasY = bloqueY + linea * 5 + 30;

  doc
    .moveTo(leftX, firmasY)
    .lineTo(leftX + 120, firmasY)
    .stroke()
    .text("V° B° Caja SOLCONSA", leftX + 15, firmasY + 4);

  doc
    .moveTo(leftX + 140, firmasY)
    .lineTo(leftX + 260, firmasY)
    .stroke()
    .text("RECIBÍ CONFORME", leftX + 155, firmasY + 4);

  doc
    .fontSize(6)
    .text(
      `SOLCONSA-${responsable} | Impreso: ${new Date().toLocaleString(
        "es-PE"
      )}`,
      leftX,
      firmasY + 25
    )
    .text("CAJA / " + estado + "*", leftX + 205, firmasY + 25);

  if (idestado == 2) {
    const text = " ANULADO ";

    doc.save(); // Guardamos el estado actual

    doc
      .fillColor("red")
      .fontSize(60) // Tamaño grande
      .opacity(0.2) // Opcional: hace que se vea como marca de agua
      .rotate(-45, { origin: [80, 400] }) // Rotar desde un punto específico
      .text(text, 30, 300, {
        align: "center",
      })

      .text(text, 320, 490, {
        align: "center",
        width: "380",
      });

    doc.restore(); // Restauramos el estado para no afectar lo siguiente
  }
}

module.exports = drawRecibo;
