import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const excelExport = ({
  data,
  imageUrl,
  fileName = "exported_data.xlsx",
  title = "Reporte de Datos",
  columnsToShow, // Parámetro para seleccionar y renombrar columnas / en orden de la data sin variar 
}) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1", {
      views: [{ state: "frozen", xSplit: 1, ySplit: 3 }],
    });

    try {
      // Manejo de la imagen
      if (imageUrl) {
        let imageBase64 = imageUrl;
        if (!imageUrl.startsWith("data:image")) {
          const imageResponse = await fetch(imageUrl);
          const imageBlob = await imageResponse.blob();
          imageBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(imageBlob);
          });
        }

        const imageId = workbook.addImage({
          base64: imageBase64,
          extension: "png",
        });

        worksheet.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: 50, height: 50 },
        });
      }

      const totalColumns = Object.keys(columnsToShow || {}).length || (data[0] ? Object.keys(data[0]).length : 1); // Número total de columnas
      console.log("🚀 ~ exportToExcel ~ totalColumns:", totalColumns);
      const titleCellRange = `A2:${String.fromCharCode(
        65 + totalColumns - 1
      )}2`; // Desde 'A2' hasta la última columna
      console.log("🚀 ~ exportToExcel ~ titleCellRange:", titleCellRange);

      worksheet.mergeCells(titleCellRange);
      const titleCell = worksheet.getCell("A2");
      titleCell.value = title;
      titleCell.font = { size: 18, bold: true };
      titleCell.alignment = { horizontal: "center", vertical: "middle" };

      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Filtrar y renombrar columnas según el parámetro columnsToShow
      const filteredData = (data || []).map((row) => {
        const filteredRow = {};
        Object.keys(row).forEach((key) => {
          if (!columnsToShow) {
            filteredRow[key] = row[key];
          } else if (columnsToShow[key]) {
            filteredRow[columnsToShow[key]] = row[key];
          }
        });
        return filteredRow;
      });

      // Obtener las columnas renombradas y agregar el encabezado
      const renamedColumns = columnsToShow ? Object.values(columnsToShow) : (filteredData[0] ? Object.keys(filteredData[0]) : []);
      const headerRow = worksheet.addRow(renamedColumns);

      // Configurar formato solo para el encabezado
      headerRow.eachCell((cell) => {
        cell.font = { size: 12, bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFB0C4DE" }, // Sombreado solo en encabezados
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Agregar las filas de datos con bordes solo a las celdas con contenido
      filteredData.forEach((row) => {
        const rowData = worksheet.addRow(Object.values(row));

        // Aplicar formato únicamente a las celdas con contenido
        rowData.eachCell((cell) => {
          cell.font = { size: 12 };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });
      // Ajustar automáticamente el ancho de las columnas
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          maxLength = Math.max(maxLength, cellLength);
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });

      worksheet.pageSetup = {
        paperSize: "A4",
        orientation: "landscape",
        printArea: `A1:${String.fromCharCode(65 + totalColumns - 1)}${
          data.length + 4
        }`,
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  return exportToExcel; // Devuelve la función que se ejecutará al llamar al botón
};

export default excelExport;
