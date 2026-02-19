const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const egresosClienteService = require("./egresosClienteService");
const formatearMoneda = require("../utils/formatToMoney");

const pdfService = {
  async generatePDFFile(idclienteprov, year, filePath) {
    const result = await egresosClienteService.getByClientAndYear(
      idclienteprov,
      year
    );

    if (!result || !result.cliente) {
      throw new Error("No se encontraron datos para el cliente");
    }

    return new Promise((resolve, reject) => {
      const folderPath = path.dirname(filePath);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Configuración para página horizontal (landscape)
      const doc = new PDFDocument({
        margin: 20,
        size: "A4",
        layout: "landscape", // Orientación horizontal
      });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Configuración de márgenes y posiciones para landscape
      const pageWidth = 842; // A4 landscape width in puntos
      const pageHeight = 595; // A4 landscape height in puntos
      const marginLeft = 25;
      const marginRight = 25;
      const marginTop = 25;
      const contentWidth = pageWidth - marginLeft - marginRight;
      let currentY = marginTop;

      // Configuración de colores y estilos formales
      doc.fillColor("black");
      doc.strokeColor("black");

      // Logo y Header
      const logoPath = path.join(
        __dirname,
        "..",
        "assets",
        "images",
        "logo.png"
      );
      const logoWidth = 40;
      const logoHeight = 40;

      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, marginLeft, currentY, {
          width: logoWidth,
          height: logoHeight,
        });
      }

      const textOffsetX = marginLeft + logoWidth + 12;

      // Header formal con línea divisoria
      const documentHeaderHeight = 50;

      // Información de la empresa con mejor formato
      doc
        .fillColor("black")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Soluciones Contables SAC", textOffsetX, currentY)
        .font("Helvetica")
        .fontSize(8)
        .text("Jr. Mollendo # 219 - 2do Piso", textOffsetX, currentY + 13)
        .text("ILAVE - EL COLLAO - PUNO", textOffsetX, currentY + 25)
        .fontSize(7.5)
        .text(
          "Telf. (051) 552096 - #981 838364 - 950 400101",
          textOffsetX,
          currentY + 37
        );

      // Fecha y hora del reporte (top right) con formato formal
      const fechaHora = new Date().toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      doc
        .fillColor("black")
        .fontSize(7.5)
        .font("Helvetica-Bold")
        .text("REPORTE - EGRESOS", marginLeft + contentWidth - 130, currentY)
        .font("Helvetica")
        .fontSize(7.5)
        .text(fechaHora, marginLeft + contentWidth - 130, currentY + 12);

      // Línea divisoria formal debajo del header (sutil)
      currentY += documentHeaderHeight;
      doc
        .lineWidth(0.5)
        .moveTo(marginLeft, currentY)
        .lineTo(marginLeft + contentWidth, currentY)
        .stroke()
        .lineWidth(0.5);

      currentY += 15;

      // Título formal centrado con doble línea
      const titulo = "CUENTA CORRIENTE - EGRESOS POR CLIENTE";
      doc.fillColor("black");
      doc.fontSize(15).font("Helvetica-Bold");
      const tituloWidth = doc.widthOfString(titulo);
      const tituloHeight = doc.currentLineHeight() + 16;
      const tituloX = marginLeft + (contentWidth - tituloWidth - 40) / 2;
      const tituloY = currentY;

      // Cuadro del título con borde sutil
      doc
        .lineWidth(0.8)
        .rect(tituloX, tituloY, tituloWidth + 40, tituloHeight)
        .stroke();

      // Texto del título centrado
      doc.fillColor("black");
      doc.text(titulo, tituloX + 20, tituloY + 8, {
        width: tituloWidth,
        align: "center",
      });

      currentY += tituloHeight + 18;

      // Información del cliente en cuadro formal
      const cliente = result.cliente;
      const infoBoxHeight = 50;
      const infoBoxY = currentY;

      // Cuadro para información del cliente (sutil)
      doc
        .lineWidth(0.5)
        .rect(marginLeft, infoBoxY, contentWidth, infoBoxHeight)
        .stroke();
      doc
        .rect(marginLeft, infoBoxY, contentWidth, infoBoxHeight)
        .fill("#FAFAFA");

      doc.fillColor("black");
      doc.fontSize(9).font("Helvetica-Bold");
      doc.text("INFORMACIÓN DEL CLIENTE", marginLeft + 8, infoBoxY + 5);

      doc.font("Helvetica");
      doc.fontSize(8.5);
      const infoStartY = infoBoxY + 18;
      doc.text(`Código Cliente:`, marginLeft + 8, infoStartY);
      doc.font("Helvetica-Bold");
      doc.text(
        `${cliente.idclienteprov || "N/A"}`,
        marginLeft + 75,
        infoStartY
      );

      doc.font("Helvetica");
      doc.text(`Razón Social / Nombres:`, marginLeft + 8, infoStartY + 12);
      doc.font("Helvetica-Bold");
      doc.text(
        `${cliente.razonsocial || "N/A"}`,
        marginLeft + 120,
        infoStartY + 12
      );

      doc.font("Helvetica");
      doc.text(`Año en Consulta:`, marginLeft + contentWidth - 200, infoStartY);
      doc.font("Helvetica-Bold");
      doc.text(`${year}`, marginLeft + contentWidth - 120, infoStartY);

      currentY += infoBoxHeight + 15;

      // Tabla de transacciones con diseño formal
      const tableTop = currentY;
      const rowHeight = 18; // más condensado
      const headerHeight = 24;
      const columnWidths = {
        item: 38,
        egreso: 58,
        fecha: 72,
        tipoOp: 62,
        tipoPago: 62,
        idCliente: 62,
        concepto: 105,
        periodo: 48,
        año: 38,
        importe: 75,
        estado: 62,
        obs: 125,
      };

      // Calcular posiciones de columnas
      let colX = marginLeft;
      const columns = [
        { name: "Item", x: colX, width: columnWidths.item },
        {
          name: "Egreso",
          x: (colX += columnWidths.item),
          width: columnWidths.egreso,
        },
        {
          name: "Fecha",
          x: (colX += columnWidths.egreso),
          width: columnWidths.fecha,
        },
        {
          name: "Tipo Operacion",
          x: (colX += columnWidths.fecha),
          width: columnWidths.tipoOp,
        },
        {
          name: "Tipo de pago",
          x: (colX += columnWidths.tipoOp),
          width: columnWidths.tipoPago,
        },
        {
          name: "ID Cliente",
          x: (colX += columnWidths.tipoPago),
          width: columnWidths.idCliente,
        },
        {
          name: "Concepto",
          x: (colX += columnWidths.idCliente),
          width: columnWidths.concepto,
        },
        {
          name: "Periodo",
          x: (colX += columnWidths.concepto),
          width: columnWidths.periodo,
        },
        {
          name: "Año",
          x: (colX += columnWidths.periodo),
          width: columnWidths.año,
        },
        {
          name: "Importe (S/)",
          x: (colX += columnWidths.año),
          width: columnWidths.importe,
        },
        {
          name: "Estado",
          x: (colX += columnWidths.importe),
          width: columnWidths.estado,
        },
        {
          name: "Obs",
          x: (colX += columnWidths.estado),
          width: columnWidths.obs + 25,
        },
      ];

      // Ajustar ancho total si es necesario
      const totalTableWidth = colX + columnWidths.obs;
      if (totalTableWidth > contentWidth) {
        // Escalar proporcionalmente
        const scale = contentWidth / totalTableWidth;
        columns.forEach((col) => {
          col.x = marginLeft + (col.x - marginLeft) * scale;
          col.width = col.width * scale;
        });
      }

      // Header de la tabla con estilo sutil
      doc.fillColor("black");
      doc.fontSize(8.5).font("Helvetica-Bold");
      columns.forEach((col, idx) => {
        doc
          .lineWidth(0.5)
          .rect(col.x, tableTop, col.width, headerHeight)
          .fillAndStroke("#F2F2F2", "#CCCCCC");
        if (idx > 0) {
          doc
            .moveTo(col.x, tableTop)
            .lineTo(col.x, tableTop + headerHeight)
            .stroke();
        }
        const align =
          col.name === "Item" ||
          col.name === "Egreso" ||
          col.name === "Año" ||
          col.name === "Importe (S/)"
            ? "center"
            : "left";
        doc.fillColor("black").text(col.name, col.x + 4, tableTop + 10, {
          width: col.width - 8,
          align,
        });
      });

      currentY = tableTop + headerHeight;

      // Filas de datos - Solo egresos
      doc.fillColor("black");
      doc.fontSize(7.5).font("Helvetica");
      const egresos = result.transacciones;
      egresos.forEach((transaccion, index) => {
        // Verificar si necesitamos una nueva página (ajustado para landscape)
        if (currentY + rowHeight > pageHeight - 100) {
          doc.addPage();
          currentY = marginTop;
          // Redibujar header en nueva página con mismo estilo
          doc.fillColor("black");
          doc.fontSize(8.5).font("Helvetica-Bold");
          doc
            .lineWidth(1.5)
            .rect(marginLeft, currentY, contentWidth, headerHeight)
            .stroke()
            .lineWidth(1);

          columns.forEach((col, idx) => {
            doc
              .rect(col.x, currentY, col.width, headerHeight)
              .fillAndStroke("#E8E8E8", "#000000");
            if (idx > 0) {
              doc
                .moveTo(col.x, currentY)
                .lineTo(col.x, currentY + headerHeight)
                .stroke();
            }
            doc.fillColor("black");
            const align =
              col.name === "Item" ||
              col.name === "Egreso" ||
              col.name === "Año" ||
              col.name === "Importe (S/)"
                ? "center"
                : "left";
            doc.text(col.name, col.x + 4, currentY + 10, {
              width: col.width - 8,
              align: align,
            });
          });
          currentY += headerHeight;
          doc.fontSize(7.5).font("Helvetica");
          doc.fillColor("black");
        }

        const fechaFormateada = transaccion.fecha
          ? new Date(transaccion.fecha).toLocaleDateString("es-PE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "-";

        const importeNumero = parseFloat(transaccion.importe || 0).toFixed(2);
        const importeFormateado = formatearMoneda(importeNumero.toString());

        // Alternar color de fondo sutil
        if (index % 2 === 0) {
          doc
            .rect(marginLeft, currentY, contentWidth, rowHeight)
            .fill("#FCFCFC");
        }

        // Dibujar bordes de fila sutiles
        doc.strokeColor("#CCCCCC");
        doc
          .lineWidth(0.4)
          .rect(marginLeft, currentY, contentWidth, rowHeight)
          .stroke();

        // Líneas verticales entre columnas
        columns.forEach((col, idx) => {
          if (idx > 0) {
            doc
              .moveTo(col.x, currentY)
              .lineTo(col.x, currentY + rowHeight)
              .stroke();
          }
        });

        // Datos de la fila con mejor formato
        doc.fillColor("black");
        const cellPadding = 3;
        const cellY = currentY + 5;

        doc.text((index + 1).toString(), columns[0].x + cellPadding, cellY, {
          width: columns[0].width - cellPadding * 2,
          align: "center",
        });
        doc.text(transaccion.id.toString(), columns[1].x + cellPadding, cellY, {
          width: columns[1].width - cellPadding * 2,
          align: "center",
        });
        doc.text(fechaFormateada, columns[2].x + cellPadding, cellY, {
          width: columns[2].width - cellPadding * 2,
        });
        doc.text(transaccion.tipo, columns[3].x + cellPadding, cellY, {
          width: columns[3].width - cellPadding * 2,
        });
        doc.text(
          transaccion.tipo_pago || "-",
          columns[4].x + cellPadding,
          cellY,
          { width: columns[4].width - cellPadding * 2 }
        );
        doc.text(
          transaccion.id_cliente || "-",
          columns[5].x + cellPadding,
          cellY,
          { width: columns[5].width - cellPadding * 2 }
        );
        doc.text(
          transaccion.concepto || "-",
          columns[6].x + cellPadding,
          cellY,
          { width: columns[6].width - cellPadding * 2 }
        );
        doc.text(
          transaccion.periodo || "-",
          columns[7].x + cellPadding,
          cellY,
          { width: columns[7].width - cellPadding * 2, align: "center" }
        );
        doc.text(
          transaccion.anio?.toString() || "-",
          columns[8].x + cellPadding,
          cellY,
          { width: columns[8].width - cellPadding * 2, align: "center" }
        );
        doc.font("Helvetica-Bold");
        doc.text(importeFormateado, columns[9].x + cellPadding, cellY, {
          width: columns[9].width - cellPadding * 2,
          align: "right",
        });
        doc.font("Helvetica");
        doc.text(
          transaccion.estado || "-",
          columns[10].x + cellPadding,
          cellY,
          { width: columns[10].width - cellPadding * 2 }
        );
        doc.text(
          transaccion.observacion || "-",
          columns[11].x + cellPadding,
          cellY,
          { width: columns[11].width - cellPadding * 2 }
        );

        currentY += rowHeight;
      });

      // Línea divisoria antes del total
      currentY += 10;
      doc
        .lineWidth(0.6)
        .moveTo(marginLeft, currentY)
        .lineTo(marginLeft + contentWidth, currentY)
        .stroke()
        .lineWidth(0.5);

      currentY += 12;

      // Footer con Total Anual (estilo sutil)
      const totalY = currentY;
      const totalBoxWidth = 180;
      const totalBoxHeight = 32;
      const totalBoxX = marginLeft + contentWidth - totalBoxWidth;

      // Cuadro del total con línea sutil y fondo ligero
      doc
        .lineWidth(0.8)
        .rect(totalBoxX, totalY, totalBoxWidth, totalBoxHeight)
        .stroke();
      doc
        .rect(totalBoxX, totalY, totalBoxWidth, totalBoxHeight)
        .fill("#F6F6F6");

      // Calcular total de egresos
      const totalEgresosNumero = parseFloat(result.totalEgresos || 0).toFixed(
        2
      );
      const totalEgresosFormateado = formatearMoneda(
        totalEgresosNumero.toString()
      );
      doc.fillColor("black");
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("TOTAL ANUAL: S/", totalBoxX + 10, totalY + 8)
        .fontSize(12)
        .text(totalEgresosFormateado, totalBoxX + 10, totalY + 18, {
          width: totalBoxWidth - 20,
          align: "right",
        });

      doc.end();
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
  },
};

module.exports = pdfService;
