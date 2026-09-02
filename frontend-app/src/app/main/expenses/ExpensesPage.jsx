import CustomTable from "@/app/components/CustonTable";
import { getExpenses } from "@/app/services/expensesServices";
import {
  PostAdd,
  DriveFileRenameOutline,
  DeleteOutline,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import PageLayout from "@/app/ui-components/layout/PageLayout";
import MainCard from "@/app/ui-components/MainCard";
import { FILTER_LAYOUT, VIEW_LAYOUT } from "@/app/ui-components/layout/layoutConstants";
import ExpensesFilters from "./components/ExpensesFilters";
import React, { useEffect, useState } from "react";
import ExpensesForm from "./ExpensesForm";
import ModalComponent from "@/app/components/ModalComponent";
import PDFPreviewModal from "./components/PDFPreviewModal";
import "../../components/date-picker/date-picker.css";
import NotasClienteAutocomplete from "../notas/components/NotasClienteAutocomplete";
import { getConceptos } from "@/app/services/conceptoServices";
import { getPeriodos } from "@/app/services/periodoServices";
import { getEstados } from "@/app/services/estadoDocServices";
import { getColumns } from "./components/TableColumns";
import { useExpensesData } from "./hooks/useExpensesData";
// Helper to get formatted start/end dates
const getDateFormats = (startDate, endDate) => {
  let startDateFormat = "";
  let endDateFormat = "";
  if (startDate && endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    startDateFormat = start.toISOString();
    endDateFormat = end.toISOString();
  }
  return { startDateFormat, endDateFormat };
};
import {
  fetchAllExpenses,
  handleGenerateExcel,
  handleYearChange,
  renderYearContent,
  handleResetFilter,
  handleGeneratePDF,
} from "./utils/expensesUtils";

const ExpensesPage = () => {
  // Estado para el modal de anulación lógica
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
      // Importa el servicio de eliminación lógica de gastos
      const { deleteSalida } = await import("@/app/services/expensesServices");
      await deleteSalida(id);
      handleCloseDeleteModal();
      tableRefresh();
    } catch (error) {
      setDeleteError(error.message || "Error al anular el egreso");
    } finally {
      setDeleting(false);
    }
  };
  // State and hooks
  const {
    expensesData,
    setExpensesData,
    pagination,
    setPagination,
    total,
    loading,
    fetchDataExpenses,
  } = useExpensesData();
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editSalidaData, setEditSalidaData] = useState(null);
  const [periodosList, setPeriodosList] = useState([]);
  const [clienteFilter, setClienteFilter] = useState("");
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

  useEffect(() => {
    const fechasValidas = (startDate && endDate) || (!startDate && !endDate);
    const periodoValido =
      (periodo && selectedAnio) || (!periodo && !selectedAnio);
    const { startDateFormat, endDateFormat } = getDateFormats(
      startDate,
      endDate
    );
    if (fechasValidas && periodoValido) {
      fetchDataExpenses(
        pagination.page + 1,
        pagination.pageSize,
        startDateFormat,
        endDateFormat,
        conceptFilter,
        periodo,
        selectedAnio,
        selectedEstado,
        clienteFilter
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
    clienteFilter,
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
    clienteFilter,
  ]);

  // Handlers

  const tableRefresh = () => {
    const { startDateFormat, endDateFormat } = getDateFormats(
      startDate,
      endDate
    );
    fetchDataExpenses(
      pagination.page + 1,
      pagination.pageSize,
      startDateFormat,
      endDateFormat,
      conceptFilter,
      periodo,
      selectedAnio,
      selectedEstado,
      clienteFilter
    );
  };
  const handleClickPop = (event) => setAnchorElPop(event.currentTarget);
  const handleActionOpen = () => setAnchorElPop(null);
  const handleCloseFormModal = () => {
    setOpenFormModal(!openFormModal);
    setEditSalidaData(null);
    tableRefresh();
  };
  const handleOpenPDFModal = (row) => {
    setOpenPDFModal(true);
    setSelectedPDFData(row);
  };
  const handleClosePDFModal = () => {
    setOpenPDFModal(false);
    setSelectedPDFData(null);
  };

  const onResetFilters = () => {
    handleResetFilter({
      setDateRange,
      setConceptFilter,
      setPeriodo,
      setSelectedAnio,
      setSelectedEstado,
    });
    setClienteFilter("");
  };

  return (
    <PageLayout
      title="Egresos"
      subtitle="Registra y consulta egresos"
      action={
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 0 }}
        >
          <NotasClienteAutocomplete
            size="small"
            value={clienteFilter}
            onChange={(val) => setClienteFilter(val)}
            sx={{ width: { xs: "100%", sm: 280 }, minWidth: 0 }}
          />
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => setOpenFormModal(true)}
            startIcon={<PostAdd />}
            sx={{ width: { xs: "100%", sm: "auto" }, flexShrink: 0 }}
          >
            Registrar egreso
          </Button>
        </Stack>
      }
    >
      <MainCard contentSX={FILTER_LAYOUT.cardContent}>
        <ExpensesFilters
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
          handleResetFilter={onResetFilters}
          handleClickPop={handleClickPop}
          anchorElPop={anchorElPop}
          handleActionOpen={handleActionOpen}
          exportingExcel={exportingExcel}
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
          handleGeneratePDF={() =>
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
        />
      </MainCard>
      <Box sx={{ mt: VIEW_LAYOUT.sectionGap, minHeight: VIEW_LAYOUT.fullTableMinHeight, display: "flex", flexDirection: "column" }}>
      <CustomTable
        fill
        columns={getColumns({
          setEditSalidaData,
          setOpenFormModal,
          handleOpenPDFModal,
          openDeleteModal: handleOpenDeleteModal,
        })}
        data={expensesData || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idsalida}
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
              ¿Está seguro que desea anular el Egreso N° <b>{deleteId}</b>? Esta
              acción no puede deshacerse.
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
    </PageLayout>
  );
};

export default ExpensesPage;
