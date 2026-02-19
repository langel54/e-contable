import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const pdfExport = ({
    data = [],
    imageUrl,
    fileName = "report.pdf",
    title = "Reporte Financiero",
    columnsToShow = {},
}) => {
    const generatePDF = async () => {
        try {
            const doc = new jsPDF();

            // --- Configuration ---
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 14;

            // Colors (Dark Slate / Corporate Blue for headers)
            const primaryColor = [41, 53, 72]; // #293548
            const secondaryColor = [100, 116, 139]; // #64748b - lighter text

            // --- Header Section ---
            // Add Logo if provided
            // (Simplified logic: assuming imageUrl is handle externally or skipped for now to keep it robust)

            // Title
            doc.setFontSize(20);
            doc.setTextColor(...primaryColor);
            doc.setFont("helvetica", "bold");
            doc.text(title, margin, 20);

            // Subtitle / Date
            doc.setFontSize(10);
            doc.setTextColor(...secondaryColor);
            doc.setFont("helvetica", "normal");
            const dateStr = new Date().toLocaleDateString("es-PE", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
            doc.text(`Generado el: ${dateStr}`, margin, 26);

            // Company Name (Static placeholder or passed prop)
            doc.setFontSize(10);
            doc.text("Caja", pageWidth - margin, 20, { align: "right" });

            // Line separator
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, 30, pageWidth - margin, 30);

            // --- Table Section ---

            const headers = Object.keys(columnsToShow).map(key => columnsToShow[key]);
            const dataKeys = Object.keys(columnsToShow);

            // Identify numeric columns for right alignment (simple heuristic: key contains 'importe', 'saldo', 'total', 'monto')
            const numericKeys = dataKeys.filter(key =>
                ['importe', 'saldo', 'total', 'monto', 'precio'].some(term => key.toLowerCase().includes(term))
            );
            const numericIndices = dataKeys.reduce((acc, key, index) => {
                if (numericKeys.includes(key)) acc.push(index);
                return acc;
            }, []);

            const tableData = data.map(row => {
                return dataKeys.map(key => {
                    let val = row[key];
                    if (val === undefined || val === null) return "";

                    // Simple formatting if needed, though usually data comes formatted. 
                    // If raw number, format it:
                    if (typeof val === 'number') {
                        return val.toLocaleString('es-PE', { minimumFractionDigits: 2 });
                    }
                    return String(val);
                });
            });

            // Define column styles
            const columnStyles = {};
            numericIndices.forEach(index => {
                columnStyles[index] = { halign: 'right' };
            });

            autoTable(doc, {
                head: [headers],
                body: tableData,
                startY: 35,
                theme: 'grid', // 'grid' is more formal than 'striped' default sometimes, but let's customize 'striped'
                styles: {
                    fontSize: 8,
                    cellPadding: 3,
                    textColor: [50, 50, 50],
                    lineColor: [200, 200, 200],
                    lineWidth: 0.1,
                    valign: 'middle',
                    font: "helvetica",
                },
                headStyles: {
                    fillColor: primaryColor,
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    halign: 'center',
                    fontSize: 9,
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252], // Very light blue/gray
                },
                columnStyles: columnStyles,
                margin: { top: 35, left: margin, right: margin },
                didDrawPage: (data) => {
                    // Footer
                    const pageCount = doc.internal.getNumberOfPages();
                    const pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(
                        `Página ${pageCurrent} de ${pageCount}`,
                        pageWidth - margin,
                        pageHeight - 10,
                        { align: "right" }
                    );
                }
            });

            doc.save(fileName);

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return generatePDF;
};

export default pdfExport;
