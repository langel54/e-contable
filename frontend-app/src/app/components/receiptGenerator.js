
import jsPDF from "jspdf";
import { numeroAFormatoContable, formatearMoneda } from "../main/incomes/utils/formatters";

// Images are often handled better as base64 in client-side jsPDF
// Images are loaded dynamically now

// Replicates behavior of drawRecibo from backend
const drawRecibo = (doc, recibo, options = {}) => {
    const {
        offsetX = 30,
        tipoRecibo = "RI01",
        ciudad = "ILAVE",
        fecha = new Date(recibo.fecha).toLocaleDateString("es-PE"),
        periodo = (recibo.periodo?.nom_periodo || "----") + "-" + (recibo.anio || "----"),
        observacion = recibo.observacion || "---",
        responsable = recibo.registra,
        estado = recibo.estado?.nom_estado || recibo.estado,
        idestado = recibo.idestado,
        tipo = "ingreso", // "ingreso" o "egreso"
        concepto = recibo.concepto?.nombre_concepto ||
        options.concepto ||
        (tipo === "ingreso" ? "* OTROS INGRESOS" : "* OTROS GASTOS"),
        titulo = options.titulo ||
        (tipo === "ingreso" ? "RECIBO DE INGRESO" : "RECIBO DE EGRESO"),
        pagadoA = tipo === "ingreso"
            ? "RECIBIDO DE:"
            : tipo === "egreso"
                ? "ENTREGADO A:"
                : options.pagadoA || "RECIBIDO DE:",
    } = options;

    const nombre =
        recibo.cliente_prov?.razonsocial || recibo.cliente_prov?.nombre || "------";
    const importeVal = parseFloat(recibo.importe || 0);
    const montoTexto = numeroAFormatoContable(importeVal);
    const importeFormateado = formatearMoneda(importeVal);

    const width = 270;
    const leftX = offsetX;
    const startY = 30;

    // --- LOGO ---
    if (options.logo) {
        try {
            doc.addImage(options.logo, 'PNG', leftX, startY - 5, 40, 40);
        } catch (e) {
            console.warn("Could not add logo", e);
        }
    }

    const logoWidth = 40;
    const textOffsetX = leftX + logoWidth + 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Soluciones Contables SAC", textOffsetX, startY);
    doc.text("Jr. Mollendo # 219 - 2do Piso", textOffsetX, startY + 12);
    doc.text("ILAVE - EL COLLAO - PUNO", textOffsetX, startY + 24);
    doc.text("Telf. (051) 552096 - 981 838364 - 950 400101", textOffsetX, startY + 36);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${tipoRecibo}`, leftX + width - 80, startY);

    // Dashed line
    doc.setLineDash([3, 3], 0);
    doc.line(leftX, startY + 55, leftX + width, startY + 55);
    doc.stroke();
    doc.setLineDash([]); // Reset dash

    const cuerpoY = startY + 80;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, leftX, cuerpoY);
    doc.text(`S/ ${importeFormateado}`, leftX + width - 90, cuerpoY);

    // Periodo Box
    const periodoTexto = `PERIODO: ${periodo}`;
    doc.setFontSize(9);

    // Simplify centering logic for jsPDF
    const boxWidth = width;
    const boxHeight = 15;
    const boxX = leftX;
    const boxY = cuerpoY + 20;

    doc.rect(boxX, boxY, boxWidth, boxHeight); // Draw rect
    doc.text(periodoTexto, boxX + boxWidth / 2, boxY + 10, { align: "center" }); // Center text

    // Details
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const bloqueY = cuerpoY + 50;
    const linea = 24;

    // Row 1
    doc.text(pagadoA, leftX, bloqueY);
    doc.text(nombre, leftX + width * 0.25, bloqueY);

    // Row 2
    doc.text("LA SUMA DE:", leftX, bloqueY + linea);
    // Multi-line text handling for amount in words if needed, but usually short enough
    doc.text(montoTexto, leftX + width * 0.25, bloqueY + linea, { maxWidth: width * 0.65 });

    // Row 3
    doc.text("POR CONCEPTO DE:", leftX, bloqueY + linea * 2);
    doc.text(concepto, leftX + width * 0.36, bloqueY + linea * 2);

    // Row 4
    doc.text("DETALLE:", leftX, bloqueY + linea * 3);
    doc.text(observacion, leftX + width * 0.2, bloqueY + linea * 3, { maxWidth: width * 0.68 });

    // Location/Date
    doc.text(`${ciudad}, ${fecha}`, leftX + width * 0.33, bloqueY + linea * 4 + 10);

    // Signatures
    const firmasY = bloqueY + linea * 5 + 30;

    // Sig 1
    doc.line(leftX, firmasY, leftX + width * 0.44, firmasY);
    doc.text("V° B° Caja SOLCONSA", leftX + width * 0.055, firmasY + 10);

    // Sig 2
    doc.line(leftX + width * 0.52, firmasY, leftX + width, firmasY);
    doc.text("RECIBÍ CONFORME", leftX + width * 0.57, firmasY + 10);

    // Footer / Status
    doc.setFontSize(6);
    doc.text(
        `SOLCONSA-${responsable} | Impreso: ${new Date().toLocaleString("es-PE")}`,
        leftX,
        firmasY + 25
    );
    doc.text("CAJA / " + estado + "*", leftX + width * 0.76, firmasY + 25);

    // Watermark for ANULADO
    if (idestado == 2) {
        doc.saveGraphicsState();
        doc.setTextColor(255, 0, 0);
        doc.setFontSize(50);
        doc.setGState(new doc.GState({ opacity: 0.2 }));

        const centerX = leftX + width / 2;
        const centerY = startY + 280;
        doc.text(" ANULADO ", centerX + 20, centerY, { align: 'center', angle: 35 }); // JS PDF rotation is different, usually needs transformation matrix or angle option

        doc.restoreGraphicsState();
    }
};

const fetchImage = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error loading image:", error);
        return null;
    }
};

export const generateReceiptPDF = async (data, type = "ingreso") => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
    });

    // Replicating logic for 2 receipts per page side-by-side or based on margins
    // Backend logic: 2 receipts, positionsX = [marginBetween, marginBetween*2 + reciboWidth]
    // In backend: pageWidth=595, reciboWidth=270, numRecibos=2
    // totalRecibosWidth = 540, totalMargin=55, marginBetween=18.33

    const marginBetween = 18.33;
    const reciboWidth = 270;

    const positionsX = [marginBetween, marginBetween * 2 + reciboWidth];
    const tipoRecibo = type === "ingreso"
        ? `RI01 - ${String(data.idingreso).padStart(6, "0")}`
        : `RE01 - ${String(data.idsalida).padStart(6, "0")}`;

    const logoBase64 = await fetchImage("/images/logo.png");

    const options = {
        tipo: type,
        tipoRecibo: tipoRecibo,
        titulo: type === "ingreso" ? "RECIBO DE INGRESO" : "RECIBO DE EGRESO",
        logo: logoBase64
    };

    positionsX.forEach(posX => {
        drawRecibo(doc, data, { offsetX: posX, ...options });
    });

    return doc.output("blob");
};
