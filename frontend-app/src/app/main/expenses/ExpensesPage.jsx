import CustomTable from "@/app/components/CustonTable";
import { getExpenses } from "@/app/services/expensesServices";
import {
  Clear,
  MoreVert,
  PostAdd,
  DriveFileRenameOutline,
  RestartAlt,
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
import ExpensesForm from "./ExpensesForm";
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

const ExpensesPage = () => {
  const [expensesData, setExpensesData] = useState();
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editSalidaData, setEditSalidaData] = useState(null);
  const [periodosList, setPeriodosList] = useState([]);
  const [conceptFilter, setConceptFilter] = useState("");
  const [conceptos, setConceptos] = useState([]);
  const [periodo, setPeriodo] = useState("");
  const [selectedAnio, setSelectedAnio] = useState("");
  const [estados, setEstados] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [anchorElPop, setAnchorElPop] = useState(null);
  const [openPDFModal, setOpenPDFModal] = useState(false);
  const [selectedPDFData, setSelectedPDFData] = useState(null);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [startDate, endDate] = dateRange;

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

  const fetchDataExpenses = useCallback(
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
        const data = await getExpenses(
          page,
          pageSize,
          "",
          selectedEstado,
          startDate,
          endDate,
          conceptFilter,
          periodo,
          selectedAnio
        );
        setExpensesData(data.salidas);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error("Error fetching egresos:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const fechasValidas = (startDate && endDate) || (!startDate && !endDate);
    const periodoValido =
      (periodo && selectedAnio) || (!periodo && !selectedAnio);
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
    if (fechasValidas && periodoValido) {
      fetchDataExpenses(
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

  const handleYearChange = (date) => {
    if (date) setSelectedAnio(date.getFullYear());
  };
  const renderYearContent = (year) => (
    <span title={`Año: ${year}`}>{year}</span>
  );
  const handleResetFilter = () => {
    setDateRange([null, null]);
    setConceptFilter("");
    setPeriodo("");
    setSelectedAnio("");
    setSelectedEstado("");
  };
  const handleClickPop = (event) => setAnchorElPop(event.currentTarget);
  const handleActionOpen = () => setAnchorElPop(null);
  const handleCloseFormModal = () => {
    setOpenFormModal(!openFormModal);
    setEditSalidaData(null);
  };
  const handleOpenPDFModal = (row) => {
    setOpenPDFModal(true);
    setSelectedPDFData(row);
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
          Egresos
        </Typography>
        <Button
          size="medium"
          color="success"
          variant="contained"
          onClick={() => setOpenFormModal(true)}
          startIcon={<PostAdd fontSize="inherit" />}
        >
          Registrar Egreso
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
                          onClick={() => setConceptFilter("")}
                          sx={{ borderRadius: "50%" }}
                        >
                          <Clear sx={{ height: 14 }} />
                        </IconButton>
                      )}
                    </InputAdornment>
                  }
                />
              }
            >
              {conceptos.map((c) => (
                <MenuItem key={c.idconcepto} value={c.idconcepto}>
                  {c.nombre_concepto}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <DatePicker
              locale={"es"}
              dateFormat="dd/MM/yyyy "
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
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
                            onClick={() => setDateRange([null, null])}
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
          <FormControl size="medium" sx={{ width: 150 }}>
            <DatePicker
              selected={selectedAnio ? new Date(selectedAnio, 0, 1) : null}
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
              renderYearContent={renderYearContent}
              customInput={
                <TextField
                  label="Seleccionar Año"
                  value={selectedAnio || ""}
                  InputProps={{ readOnly: true }}
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
          {/* Popover para acciones adicionales, como exportar o imprimir PDF */}
        </Stack>
      </Stack>
      <CustomTable
        columns={getColumns({
          setEditSalidaData,
          setOpenFormModal,
          handleOpenPDFModal,
        })}
        data={expensesData || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idsalida}
      />
      <ModalComponent
        icon={
          editSalidaData ? (
            <DriveFileRenameOutline color="success" />
          ) : (
            <PostAdd color="success" />
          )
        }
        open={openFormModal}
        content={
          <ExpensesForm
            salidaEdit={editSalidaData}
            handleCloseModal={handleCloseFormModal}
          />
        }
        handleClose={handleCloseFormModal}
        title={editSalidaData ? "Editar Egreso" : "Registrar un Egreso"}
        width="600px"
      />
      {openPDFModal && (
        <PDFPreviewModal
          open={openPDFModal}
          handleClose={handleClosePDFModal}
          data={selectedPDFData}
        />
      )}
    </Box>
  );
};

export default ExpensesPage;
