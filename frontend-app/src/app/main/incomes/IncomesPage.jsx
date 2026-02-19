import CustomTable from "@/app/components/CustonTable";
// import { getIngresos } from "@/app/services/incomesServices";
import {
  // Clear,
  // MoreVert,
  PostAdd,
  DriveFileRenameOutline,
  DeleteOutline,
  // RestartAlt,
} from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import IncomeForm from "./IncomesForm";
import ModalComponent from "@/app/components/ModalComponent";
import PDFPreviewModal from "./components/PDFPreviewModal";

import dayjs from "dayjs";
import { deleteIngreso } from "@/app/services/incomesServices";
import "../../components/date-picker/date-picker.css";
// ...existing code...
import { getConceptos } from "@/app/services/conceptoServices";
import { getPeriodos } from "@/app/services/periodoServices";
import utc from "dayjs/plugin/utc";
// import EstadoChip from "@/app/components/EstadoChip";
import { getEstados } from "@/app/services/estadoDocServices";
// import excelExport from "@/app/components/excelReport";
import { getColumns } from "./components/TableColumns";
import IncomesFilters from "./components/IncomesFilters";
import IncomesActionsPopover from "./components/IncomesActionsPopover";
import { handleGenerateExcel, handleGeneratePDF } from "./utils";
import { useIncomesData } from "./hooks/useIncomesData";

dayjs.extend(utc);

// Helper to get formatted start/end dates
const getDateFormats = (startDate, endDate) => {
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
};

const IncomesPage = () => {
  // Estado para el modal de anulación
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  // Abrir modal de confirmación
  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
    setDeleteError("");
  };

  // Cerrar modal de confirmación
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteId(null);
    setDeleteError("");
  };

  // Confirmar anulación lógica
  const handleConfirmDelete = async (id) => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteIngreso(id);
      handleCloseDeleteModal();
      refreshTable();
    } catch (error) {
      setDeleteError(error.message || "Error al anular el ingreso");
    } finally {
      setDeleting(false);
    }
  };
  // Datos y paginación con hook
  const {
    incomesData,
    setIncomesData,
    pagination,
    setPagination,
    total,
    loading,
    fetchDataIncomes,
  } = useIncomesData();

  // UI y filtros
  const [exportingExcel, setExportingExcel] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editIncomeData, setEditIncomeData] = useState(null);
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

  useEffect(() => {
    const fechasValidas = (startDate && endDate) || (!startDate && !endDate);
    const periodoValido =
      (periodo && selectedAnio) || (!periodo && !selectedAnio);
    const { startDateFormat, endDateFormat } = getDateFormats(
      startDate,
      endDate
    );
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

  const refreshTable = () => {
    const { startDateFormat, endDateFormat } = getDateFormats(
      startDate,
      endDate
    );
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
  };

  const handleYearChange = (date) => {
    if (date) {
      setSelectedAnio(date.getFullYear());
    }
  };
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
  const handleActionOpen = () => setAnchorElPop(null);
  const handleCloseFormModal = () => {
    setOpenFormModal(!openFormModal);
    setEditIncomeData(null);
    refreshTable();
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
        <Stack>
          <Typography variant="h4" gutterBottom>
            Ingresos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registra y consulta ingresos
          </Typography>
        </Stack>
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
      <IncomesFilters
        conceptos={conceptos}
        conceptFilter={conceptFilter}
        setConceptFilter={setConceptFilter}
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        periodosList={periodosList}
        periodo={periodo}
        setPeriodo={setPeriodo}
        selectedAnio={selectedAnio}
        setSelectedAnio={setSelectedAnio}
        estados={estados}
        selectedEstado={selectedEstado}
        setSelectedEstado={setSelectedEstado}
        handleYearChange={handleYearChange}
        renderYearContent={renderYearContent}
        handleResetFilter={handleResetFilter}
        handleClickPop={handleClickPop}
      />
      <IncomesActionsPopover
        anchorElPop={anchorElPop}
        handleActionOpen={handleActionOpen}
        handleGenerateExcel={() =>
          handleGenerateExcel({
            startDate,
            endDate,
            conceptFilter,
            periodo,
            selectedAnio,
            selectedEstado,
            setExportingExcel,
            handleActionOpen,
          })
        }
        exportingExcel={exportingExcel}
        onOtherAction={() => 
          handleGeneratePDF({
            startDate,
            endDate,
            conceptFilter,
            periodo,
            selectedAnio,
            selectedEstado,
            handleActionOpen,
          })
        }
        handleClosePop={handleActionOpen}
      />
      <CustomTable
        columns={getColumns({
          setEditIncomeData,
          setOpenFormModal,
          handleOpenPDFModal,
          openDeleteModal: handleOpenDeleteModal,
        })}
        data={incomesData || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idingreso}
      />
      <ModalComponent
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        title="Confirmar anulación"
        icon={<DeleteOutline color="error" />}
        width="400px"
        content={
          <>
            <Typography>
              ¿Está seguro que desea anular el Ingreso N° <b>{deleteId}</b>?
              Esta acción no puede deshacerse.
            </Typography>
            {deleteError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {deleteError}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                onClick={handleCloseDeleteModal}
                color="error"
                variant="outlined"
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleConfirmDelete(deleteId)}
                color="error"
                variant="contained"
                disabled={deleting}
              >
                {deleting ? "Anulando..." : "Anular"}
              </Button>
            </Box>
          </>
        }
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
