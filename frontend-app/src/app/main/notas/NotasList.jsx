"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Button, Divider } from "@mui/material";
import { PostAdd, DriveFileRenameOutline, DeleteOutline } from "@mui/icons-material";
import ModalComponent from "@/app/components/ModalComponent";
import CustomTable from "@/app/components/CustonTable";
import NotasFilters from "./components/NotasFilters";
import NotaForm from "./NotaForm";
import { getNotas, deleteNota } from "@/app/services/notasServices";
import { getClientesProvs } from "@/app/services/clienteProvService";
import dayjs from "dayjs";
import "../../components/date-picker/date-picker.css";

export default function NotasList() {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editNotaData, setEditNotaData] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Filtros
  const [clientes, setClientes] = useState([]);
  const [clienteFilter, setClienteFilter] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Tabla y datos
  const [notasData, setNotasData] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar clientes para filtro
  useEffect(() => {
    getClientesProvs(1, 1000, "", 1).then((res) => {
      setClientes(res.clientesProvs || []);
    });
  }, []);

  // Cargar notas con filtros
  useEffect(() => {
    async function fetchNotas() {
      setLoading(true);
      let search = "";
      if (clienteFilter) search += `cliente:${clienteFilter}`;
      let urlStart = startDate ? dayjs(startDate).format("YYYY-MM-DD") : "";
      let urlEnd = endDate ? dayjs(endDate).format("YYYY-MM-DD") : "";
      // El backend debe soportar estos filtros, si no, ajustar aquí
      const data = await getNotas(
        pagination.page + 1,
        pagination.pageSize,
        search
      );
      let notasFiltradas = data.notas || [];
      if (clienteFilter) {
        notasFiltradas = notasFiltradas.filter(n => n.idclienteprov === clienteFilter);
      }
      if (startDate && endDate) {
        notasFiltradas = notasFiltradas.filter(n => {
          const fecha = n.n_fecha ? dayjs(n.n_fecha) : null;
          return fecha && fecha.isAfter(dayjs(startDate).startOf("day").subtract(1, "day")) && fecha.isBefore(dayjs(endDate).endOf("day").add(1, "day"));
        });
      }
      setNotasData(notasFiltradas);
      setTotal(data.pagination?.total || notasFiltradas.length);
      setLoading(false);
    }
    fetchNotas();
  }, [pagination.page, pagination.pageSize, clienteFilter, startDate, endDate]);

  // Acciones
  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
    setDeleteError("");
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteId(null);
    setDeleteError("");
  };
  const handleConfirmDelete = async (id) => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteNota(id);
      handleCloseDeleteModal();
      setPagination((prev) => ({ ...prev })); // recarga
    } catch (error) {
      setDeleteError(error.message || "Error al eliminar la nota");
    } finally {
      setDeleting(false);
    }
  };
  const handleCloseFormModal = () => {
    setOpenFormModal(false);
    setEditNotaData(null);
    setPagination((prev) => ({ ...prev })); // recarga
  };
  const handleResetFilter = () => {
    setClienteFilter("");
    setDateRange([null, null]);
  };

  // Columnas para CustomTable
  const columns = [
    { field: "idnotas", headerName: "ID", width: 80 },
    {
      field: "n_fecha",
      headerName: "Fecha",
      width: 140,
      valueGetter: (params) => params ? dayjs(params).format("DD-MM-YYYY") : "",
    },
    {
      field: "cliente_prov",
      headerName: "Empresa/Cliente",
      flex: 1,
      renderCell: (params) => params.row?.cliente_prov?.razonsocial || "",
    },
    { field: "ncreador", headerName: "Creador", width: 120 },
    { field: "neditor", headerName: "Editor", width: 120 },
    {
      field: "contenido",
      headerName: "Contenido",
      flex: 2,
      renderCell: (params) => (
        <span dangerouslySetInnerHTML={{ __html: params.row.contenido?.slice(0, 100) }} />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 180,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => (
        <Stack direction={"row"} spacing={1}>
          <Button
            color="info"
            size="small"
            startIcon={<DriveFileRenameOutline />}
            onClick={() => {
              setEditNotaData(params.row);
              setOpenFormModal(true);
            }}
          >
            Editar
          </Button>
          <Button
            color="error"
            size="small"
            startIcon={<DeleteOutline />}
            onClick={() => handleOpenDeleteModal(params.row.idnotas)}
          >
            Eliminar
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack sx={{ pb: 2 }} direction="row" spacing={2} justifyContent={"space-between"}>
        <Typography variant="h4" fontWeight={"100"}>Notas</Typography>
        <Button
          size="medium"
          color="success"
          variant="contained"
          onClick={() => setOpenFormModal(true)}
          startIcon={<PostAdd fontSize="inherit" />}
        >
          Nueva Nota
        </Button>
      </Stack>
      <Divider />
      <NotasFilters
        clientes={clientes}
        clienteFilter={clienteFilter}
        setClienteFilter={setClienteFilter}
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        handleResetFilter={handleResetFilter}
      />
      <CustomTable
        columns={columns}
        data={notasData || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idnotas}
      />
      <ModalComponent
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        title="Confirmar eliminación"
        icon={<DeleteOutline color="error" />}
        width="400px"
        content={
          <>
            <Typography>
              ¿Está seguro que desea eliminar la Nota N° <b>{deleteId}</b>? Esta acción no puede deshacerse.
            </Typography>
            {deleteError && (
              <Typography color="error" sx={{ mt: 2 }}>{deleteError}</Typography>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
              <Button onClick={handleCloseDeleteModal} color="error" variant="outlined" disabled={deleting}>Cancelar</Button>
              <Button onClick={() => handleConfirmDelete(deleteId)} color="error" variant="contained" disabled={deleting}>{deleting ? "Eliminando..." : "Eliminar"}</Button>
            </Box>
          </>
        }
      />
      <ModalComponent
        icon={editNotaData ? <DriveFileRenameOutline color="success" /> : <PostAdd color="success" />}
        open={openFormModal}
        content={
          <NotaForm
            initialData={editNotaData}
            onSubmit={handleCloseFormModal}
            onCancel={() => setOpenFormModal(false)}
          />
        }
        handleClose={() => setOpenFormModal(false)}
        title={editNotaData ? "Editar Nota" : "Registrar una Nota"}
        width="600px"
      />
    </Box>
  );
}
