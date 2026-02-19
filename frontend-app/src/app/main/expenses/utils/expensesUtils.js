import dayjs from "dayjs";
import excelExport from "@/app/components/excelReport";
import { getExpenses } from "@/app/services/expensesServices";

dayjs.extend(require("dayjs/plugin/utc"));

export const fetchAllExpenses = async (
  startDate,
  endDate,
  conceptFilter,
  periodo,
  selectedAnio,
  selectedEstado
) => {
  let allData = [];
  let currentPage = 1;
  const pageSize = 100;
  try {
    while (true) {
      const data = await getExpenses(
        currentPage,
        pageSize,
        "",
        selectedEstado,
        startDate,
        endDate,
        conceptFilter,
        periodo,
        selectedAnio
      );
      allData = [...allData, ...(data.salidas || [])];
      if (!data.salidas || data.salidas.length < pageSize) {
        break;
      }
      currentPage++;
    }
  } catch (error) {
    console.error("Error al obtener egresos:", error);
  }
  return allData;
};

export const handleGenerateExcel = async ({
  startDate,
  endDate,
  conceptFilter,
  periodo,
  selectedAnio,
  selectedEstado,
  setExportingExcel,
  handleActionOpen,
}) => {
  setExportingExcel(true);
  const selectedColumns = {
    idsalida: "Nro",
    fecha: "FECHA",
    idclienteprov: "ID Cliente",
    razonsocial: "Razon Social",
    periodo: "PERIODO",
    anio: "AÑO",
    concepto: "CONCEPTO",
    importe: "IMPORTE",
    estado: "ESTADO",
    observacion: "OBS",
    registra: "REGISTRA",
    codcaja_m: "CAJA",
  };
  let startDateFormat = "";
  let endDateFormat = "";
  if (startDate && endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    startDateFormat = dayjs(start).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    endDateFormat = dayjs(end).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  }
  try {
    const fetchedData = await fetchAllExpenses(
      startDateFormat,
      endDateFormat,
      conceptFilter,
      periodo,
      selectedAnio,
      selectedEstado
    );
    const transformedData = fetchedData.map((item) => ({
      idsalida: item.idsalida,
      fecha: dayjs(item.fecha).format("DD/MM/YYYY HH:mm"),
      idclienteprov: item.idclienteprov,
      razonsocial: item.cliente_prov ? item.cliente_prov.razonsocial : "",
      periodo: item.periodo ? item.periodo.nom_periodo : "",
      anio: item.anio,
      concepto: item.concepto ? item.concepto.nombre_concepto : "",
      importe: item.importe,
      estado: item.estado ? item.estado.nom_estado : "",
      observacion: item.observacion,
      registra: item.registra,
      codcaja_m: item.codcaja_m,
    }));
    const imageUrl = "/images/users/avatar-1.png";
    const generateReport = excelExport({
      data: transformedData,
      imageUrl: imageUrl,
      fileName: "Egresos.xlsx",
      title: "Reporte de Egresos",
      columnsToShow: selectedColumns,
    });
    generateReport();
  } catch (error) {
    console.error("Error al generar el reporte:", error);
  } finally {
    setExportingExcel(false);
    handleActionOpen();
  }
};

export const handleGeneratePDF = async ({
  startDate,
  endDate,
  conceptFilter,
  periodo,
  selectedAnio,
  selectedEstado,
  handleActionOpen,
}) => {
  const selectedColumns = {
    idsalida: "Nro",
    fecha: "FECHA",
    razonsocial: "Razon Social",
    concepto: "CONCEPTO",
    importe: "IMPORTE",
    estado: "ESTADO",
    observacion: "OBS",
  };
  let startDateFormat = "";
  let endDateFormat = "";
  if (startDate && endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    startDateFormat = dayjs(start).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    endDateFormat = dayjs(end).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  }

  try {
    const fetchedData = await fetchAllExpenses(
      startDateFormat,
      endDateFormat,
      conceptFilter,
      periodo,
      selectedAnio,
      selectedEstado
    );

    const transformedData = fetchedData.map((item) => ({
      idsalida: item.idsalida,
      fecha: dayjs(item.fecha).format("DD/MM/YYYY HH:mm"),
      razonsocial: item.cliente_prov ? item.cliente_prov.razonsocial : "",
      anio: item.anio,
      concepto: item.concepto ? item.concepto.nombre_concepto : "",
      importe: item.importe,
      estado: item.estado ? item.estado.nom_estado : "",
      observacion: item.observacion,
    }));

    // Dynamic import to avoid circular dependency issues if any, or just consistent usage
    const { default: pdfExport } = await import("@/app/components/pdfReport");

    const generate = pdfExport({
      data: transformedData,
      fileName: "Reporte_Egresos.pdf",
      title: "Reporte de Egresos",
      columnsToShow: selectedColumns,
    });

    await generate();

  } catch (error) {
    console.error("Error generating PDF", error);
  } finally {
    handleActionOpen();
  }
};

export const handleYearChange = (date, setSelectedAnio) => {
  if (date) setSelectedAnio(date.getFullYear());
};

export const renderYearContent = (year) => (
  <span title={`Año: ${year}`}>{year}</span>
);

export const handleResetFilter = ({
  setDateRange,
  setConceptFilter,
  setPeriodo,
  setSelectedAnio,
  setSelectedEstado,
}) => {
  setDateRange([null, null]);
  setConceptFilter("");
  setPeriodo("");
  setSelectedAnio("");
  setSelectedEstado("");
};
