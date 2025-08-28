import CustomTable from "@/app/components/CustonTable";
import { getIngresos } from "@/app/services/incomesServices";
import {
  CleanHands,
  CleanHandsSharp,
  CleaningServices,
  Clear,
  ClearAll,
  ClearSharp,
  DeleteSweep,
  DriveFileRenameOutline,
  DryCleaningRounded,
  InfoOutlined,
  MoreVert,
  PostAdd,
  ReceiptLong,
  ResetTv,
  RestartAlt,
  RestoreFromTrash,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  PopoverPaper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import IncomeForm from "./IncomesForm";
import ModalComponent from "@/app/components/ModalComponent";
import PDFPreviewModal from "./components/PDFPreviewModal";

import dayjs from "dayjs";
import "../../components/date-picker/date-picker.css";
import DatePicker from "react-datepicker";
import { getConceptos } from "@/app/services/conceptoServices";
import { getPeriodos } from "@/app/services/periodoServices";
import utc from "dayjs/plugin/utc";
import EstadoChip from "@/app/components/EstadoChip";
import { getEstados } from "@/app/services/estadoDocServices";
import { FileExcelFilled, FilePdfFilled } from "@ant-design/icons";
import excelExport from "@/app/components/excelReport";
import { getColumns } from "./components/TableColumns";

dayjs.extend(utc);

const IncomesPage = () => {
  const [incomesData, setIncomesData] = useState();
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const [openFormModal, setOpenFormModal] = useState(false);

  const [editIncomeData, setEditIncomeData] = useState(null);
  console.log("🚀 ~ IncomesPage ~ editIncomeData:", editIncomeData)
  // const [startDate, setStartDate] = useState("");
  const [periodosList, setPeriodosList] = useState([]);
  const [conceptFilter, setConceptFilter] = useState("");
  const [conceptos, setConceptos] = useState([]);
  const [periodo, setPeriodo] = useState("");
  const [selectedAnio, setSelectedAnio] = useState("");
  const [estados, setEstados] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  // const anioActual = dayjs().year() + 1;
  // const anios = Array.from({ length: 10 }, (_, i) => anioActual - i); // Últimos 10 años

  const [anchorElPop, setAnchorElPop] = useState(null);
  const [openPDFModal, setOpenPDFModal] = useState(false);
  const [selectedPDFData, setSelectedPDFData] = useState(null);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conceptosData, periodosData, estadosData] = await Promise.all([
          getConceptos(),
          getPeriodos(),
          getEstados(),
        ]);

        setConceptos(conceptosData.conceptos);
        setPeriodosList(periodosData.periodos);
        setEstados(estadosData.estados);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const fetchDataIncomes = useCallback(
    async (
      page,
      pageSize,
      startDate,
      endDate,
      conceptFilter,
      periodo,
      selectedAnio,
      selectedEstado
    ) => {
      setLoading(true);

      try {
        const data = await getIngresos(
          //
          page,
          pageSize,
          "", //search
          selectedEstado, //"", //status
          startDate,
          endDate,
          conceptFilter,
          periodo,
          selectedAnio
        );
        setIncomesData(data.ingresos);
        setTotal(data.pagination.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleCloseFormModal = () => {
    console.log("Cerrar");
    setOpenFormModal(!openFormModal);
    setEditIncomeData(null);
  };

  useEffect(() => {
    const fechasValidas = (startDate && endDate) || (!startDate && !endDate);
    const periodoValido =
      (periodo && selectedAnio) || (!periodo && !selectedAnio);

    let startDateFormat = "";
    let endDateFormat = "";

    if (startDate && endDate) {
      let start = new Date(startDate);
      let end = new Date(endDate);

      // Ajustar horas: startDate a 00:00:00.000 y endDate a 23:59:59.999
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      // Formatear a ISO 8601 con zona horaria UTC
      startDateFormat = dayjs(start).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      endDateFormat = dayjs(end).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    }

    if (fechasValidas && periodoValido) {
      fetchDataIncomes(
        pagination.page + 1,
        pagination.pageSize,
        startDateFormat,
        endDateFormat,
        conceptFilter,
        periodo,
        selectedAnio,
        selectedEstado
      );
    }
  }, [
    pagination.page,
    pagination.pageSize,
    startDate,
    endDate,
    conceptFilter,
    periodo,
    selectedAnio,
    selectedEstado,
  ]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, [
    startDate,
    endDate,
    conceptFilter,
    periodo,
    selectedAnio,
    selectedEstado,
  ]);

  // Función para manejar el cambio de año
  const handleYearChange = (date) => {
    if (date) {
      setSelectedAnio(date.getFullYear()); // Actualizar el estado con el año seleccionado
    }
  };

  // Función para personalizar el contenido de los años (tooltip u otras personalizaciones)
  const renderYearContent = (year) => {
    const tooltipText = `Año: ${year}`;
    return <span title={tooltipText}>{year}</span>;
  };

  const handleResetFilter = () => {
    setDateRange([null, null]);
    setConceptFilter("");
    setPeriodo("");
    setSelectedAnio("");
    setSelectedEstado("");
  };

  const handleClickPop = (event) => setAnchorElPop(event.currentTarget);

  const handleActionOpen = () => {
    setAnchorElPop(null);
  };

  const fetchAllIngresos = async (
    startDate,
    endDate,
    conceptFilter,
    periodo,
    selectedAnio,
    selectedEstado
  ) => {
    let allData = [];
    let currentPage = 1;
    const pageSize = 100; // Tamaño de página

    try {
      while (true) {
        const data = await getIngresos(
          currentPage,
          pageSize,
          "", // search
          selectedEstado,
          startDate,
          endDate,
          conceptFilter,
          periodo,
          selectedAnio
        );

        allData = [...allData, ...data.ingresos];

        if (data.ingresos.length < pageSize) {
          break; // Sale del bucle si la última página tiene menos elementos que el tamaño máximo
        }

        currentPage++;
      }
    } catch (error) {
      console.error("Error al obtener ingresos:", error);
    }

    return allData;
  };

  const handleGenerateExcel = async () => {
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
  };

  const handleOpenPDFModal = (row) => {
    setSelectedPDFData(row);
    setOpenPDFModal(true);
  };

  const handleClosePDFModal = () => {
    setOpenPDFModal(false);
    setSelectedPDFData(null);
  };

  return (
    <Box>
      <Stack
        sx={{ pb: 2 }}
        direction="row"
        spacing={2}
        justifyContent={"space-between"}
      >
        <Typography variant="h4" fontWeight={"100"}>
          Ingresos
        </Typography>
        <Button
          size="medium"
          color="success"
          variant="contained"
          onClick={() => {
            setOpenFormModal(true);
          }}
          startIcon={<PostAdd fontSize="inherit" />}
        >
          Registrar Ingreso
        </Button>
      </Stack>
      <Divider></Divider>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mb: 1,
          mt: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        width={"100%"}
      >
        {/* <SearchComponent
        // handleClearSearch={handleClearSearch}
        // handleSearchButton={handleSearchButton}
        // handleSearchChange={handleSearchChange}
        // searchTerm={searchTerm}
        /> */}
        <Stack direction={"row"} justifyContent={"start"} spacing={2}>
          <FormControl sx={{ width: 250 }}>
            <InputLabel>Concepto</InputLabel>
            <Select
              sx={{ pr: 3 }}
              value={conceptFilter}
              onChange={(e) => setConceptFilter(e.target.value)}
              displayEmpty
              label="Selecciona un concepto"
              input={
                <OutlinedInput
                  endAdornment={
                    <InputAdornment position="end">
                      {conceptFilter && (
                        <IconButton
                          size="small"
                          edge="end"
                          onClick={() => setConceptFilter("")} // Limpia el filtro
                          sx={{
                            // pr: 2,
                            borderRadius: "50%",
                          }}
                        >
                          <Clear sx={{ height: 14 }} />
                        </IconButton>
                      )}
                    </InputAdornment>
                  }
                />
              }
            >
              {/* <MenuItem value="">Todos</MenuItem> */}
              {conceptos.map((c) => (
                <MenuItem key={c.idconcepto} value={c.idconcepto}>
                  {c.nombre_concepto}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            {/* <InputLabel>Inicio - Fin</InputLabel> */}
            <DatePicker
              locale={"es"}
              dateFormat="dd/MM/yyyy "
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              // isClearable={false}
              customInput={
                <TextField
                  label="Fecha de pago"
                  autoComplete={false}
                  slotProps={{
                    input: {
                      endAdornment: (startDate || endDate) && (
                        <InputAdornment position="end">
                          <IconButton
                            sx={{ borderRadius: "50%" }}
                            onClick={() => setDateRange([null, null])} // Limpia las fechas
                            size="small"
                          >
                            <Clear sx={{ height: 14 }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              }
            />
          </FormControl>
          <FormControl size="medium" sx={{ width: 100 }}>
            <InputLabel>Periodo</InputLabel>
            <Select
              value={periodo}
              name="idperiodo"
              onChange={(e) => setPeriodo(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {periodosList.map((period) => (
                <MenuItem key={period.idperiodo} value={period.idperiodo}>
                  {period.nom_periodo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <FormControl size="medium" sx={{ width: 100 }}>
            <InputLabel>Año</InputLabel>
            <Select
              value={selectedAnio}
              onChange={(e) => setSelectedAnio(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {anios.map((anio) => (
                <MenuItem key={anio} value={anio}>
                  {anio}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <FormControl size="medium" sx={{ width: 150 }}>
            <DatePicker
              selected={selectedAnio ? new Date(selectedAnio, 0, 1) : null} // Seleccionar el año completo
              onChange={handleYearChange} // Actualiza el año seleccionado
              showYearPicker // Solo mostrar años
              dateFormat="yyyy" // Formato de solo año
              renderYearContent={renderYearContent} // Personalización de cada año con un tooltip
              customInput={
                <TextField
                  label="Seleccionar Año"
                  value={selectedAnio || ""} // Mostrar el año seleccionado o vacío
                  InputProps={{
                    readOnly: true, // Solo de lectura
                  }}
                />
              }
            />
          </FormControl>
          <FormControl size="medium" sx={{ width: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {estados.map((estatus) => (
                <MenuItem key={estatus.idestado} value={estatus.idestado}>
                  {estatus.nom_estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <Tooltip arrow title="Quitar FIltros" placement="left">
            <IconButton onClick={() => handleResetFilter()}>
              <RestartAlt />
            </IconButton>
          </Tooltip>
          <IconButton onClick={handleClickPop}>
            <MoreVert />
          </IconButton>
          <Popover
            open={Boolean(anchorElPop)}
            anchorEl={anchorElPop}
            onClose={handleActionOpen}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <List>
              <ListItem
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  handleGenerateExcel();
                }}
                disabled={exportingExcel}
              >
                <ListItemIcon
                  sx={(theme) => ({ color: theme.palette.success.main })}
                >
                  {exportingExcel ? (
                    <CircularProgress size={20} color="success" />
                  ) : (
                    <FileExcelFilled />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={exportingExcel ? "Exportando..." : "Exportar Excel"} 
                />
              </ListItem>
              <Divider />
              <ListItem
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  onOtherAction();
                  handleClosePop();
                }}
              >
                <ListItemIcon
                  sx={(theme) => ({ color: theme.palette.error.main })}
                >
                  <FilePdfFilled />
                </ListItemIcon>
                <ListItemText primary="Imprimir PDF" />
              </ListItem>
            </List>
          </Popover>
        </Stack>
      </Stack>
      <CustomTable
        columns={getColumns({
          setEditIncomeData,
          setOpenFormModal,
          handleOpenPDFModal,
        })}
        data={incomesData || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idingreso}
      />
      <ModalComponent
        icon={
          editIncomeData ? (
            <DriveFileRenameOutline color="success" />
          ) : (
            <PostAdd color="success" />
          )
        }
        open={openFormModal}
        content={
          <IncomeForm
            ingresoEdit={editIncomeData}
            handleCloseModal={handleCloseFormModal}
          />
        }
        handleClose={handleCloseFormModal}
        title={editIncomeData ? "Editar Ingreso" : "Registrar un Ingreso"}
        width="600px"
      />
      <PDFPreviewModal
        open={openPDFModal}
        handleClose={handleClosePDFModal}
        data={selectedPDFData}
      />
    </Box>
  );
};

export default IncomesPage;
