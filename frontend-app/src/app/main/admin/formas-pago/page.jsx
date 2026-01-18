
"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { PostAdd, Edit, DeleteOutline } from "@mui/icons-material";
import CustomTable from "@/app/components/CustonTable";
import ModalComponent from "@/app/components/ModalComponent";
import { getFormasPagoTrib, deleteFormaPagoTrib } from "@/app/services/formaPagoTribServices";
import FormaPagoTribForm from "./FormaPagoTribForm";

const FormasPagoPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

  const [openFormModal, setOpenFormModal] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFormasPagoTrib(pagination.page, pagination.pageSize);
      // Assume array or listWrapper
      if (Array.isArray(response)) {
         setData(response);
         setTotal(response.length);
      } else if (response && response.formaPagoTribs) {
          setData(response.formaPagoTribs);
          setTotal(response.total || response.pagination?.total || 0);
      } else {
          // Fallback if structure unknown, might be inside response object
          setData(response || []);
      }
    } catch (error) {
      console.error("Error fetching formas pago:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenForm = (row = null) => {
    setDataToEdit(row);
    setOpenFormModal(true);
  };

  const handleCloseForm = () => {
    setOpenFormModal(false);
    setDataToEdit(null);
    fetchData();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFormaPagoTrib(deleteId);
      setOpenDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const columns = [
    { field: "idforma_pago_trib", headerName: "Código", width: 120 },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar">
            <IconButton onClick={() => handleOpenForm(params.row)} size="small">
              <Edit color="warning" fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton onClick={() => handleDeleteClick(params.row.idforma_pago_trib)} size="small">
              <DeleteOutline color="error" fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Formas de Pago Tributo</Typography>
        <Button
          variant="contained"
          startIcon={<PostAdd />}
          onClick={() => handleOpenForm()}
        >
          Nueva Forma
        </Button>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      
      <CustomTable
        columns={columns}
        data={data}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idforma_pago_trib}
      />

      <ModalComponent
        open={openFormModal}
        handleClose={handleCloseForm}
        title={dataToEdit ? "Editar Forma Pago" : "Nueva Forma Pago"}
        width="400px"
        content={<FormaPagoTribForm handleCloseModal={handleCloseForm} dataToEdit={dataToEdit} />}
      />

      <ModalComponent
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        title="Confirmar Eliminación"
        width="400px"
        content={
          <Box>
             <Typography sx={{ mb: 3 }}>¿Está seguro de eliminar este registro?</Typography>
             <Stack direction="row" justifyContent="flex-end" spacing={2}>
               <Button onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
               <Button variant="contained" color="error" onClick={confirmDelete}>Eliminar</Button>
             </Stack>
          </Box>
        }
      />
    </Box>
  );
};

export default FormasPagoPage;
