import excelExport from "@/app/components/excelReport";
import dayjs from "dayjs";
import { getIngresos } from "@/app/services/incomesServices";
export async function handleGenerateExcel({
  startDate,
  endDate,
  conceptFilter,
  periodo,
  selectedAnio,
  selectedEstado,
  setExportingExcel,
  handleActionOpen,
}) {
  setExportingExcel(true);
  const selectedColumns = {
    idingreso: "Nro",
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
    const fetchedData = await fetchAllIngresos(
      getIngresos,
      startDateFormat,
      endDateFormat,
      conceptFilter,
      periodo,
      selectedAnio,
      selectedEstado
    );
    const transformedData = fetchedData.map((item) => ({
      idingreso: item.idingreso,
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
      fileName: "Ingresos.xlsx",
      title: "Reporte de Ingresos",
      columnsToShow: selectedColumns,
    });
    generateReport();
  } catch (error) {
    console.error("Error al generar el reporte:", error);
  } finally {
    setExportingExcel(false);
    handleActionOpen();
  }
}
// import dayjs from "dayjs";
// dayjs.extend(require("dayjs/plugin/utc"));

export function formatDateRange(startDate, endDate) {
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
  return { startDateFormat, endDateFormat };
}

export async function fetchAllIngresos(getIngresos, startDate, endDate, conceptFilter, periodo, selectedAnio, selectedEstado) {
  let allData = [];
  let currentPage = 1;
  const pageSize = 100;
  try {
    while (true) {
      const data = await getIngresos(
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
      allData = [...allData, ...data.ingresos];
      if (data.ingresos.length < pageSize) break;
      currentPage++;
    }
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
  }
  return allData;
}
