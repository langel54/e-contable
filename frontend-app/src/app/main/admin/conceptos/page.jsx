
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
import { getConceptos, deleteConcepto } from "@/app/services/conceptoServices";
import ConceptoForm from "./ConceptoForm";

const ConceptosPage = () => {
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
      const response = await getConceptos(pagination.page + 1, pagination.pageSize); // Note: ConceptoService might assume 1-based page
      // Inspecting ConceptoController: const { page = 1, limit = 10 } = req.query;
      // So here pass page+1.
      // Response { conceptos, pagination }
      if (response && response.conceptos) {
         setData(response.conceptos);
         setTotal(response.pagination?.total || 0);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching conceptos:", error);
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
      await deleteConcepto(deleteId);
      setOpenDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const columns = [
    { field: "idconcepto", headerName: "ID", width: 90 },
    { field: "nombre_concepto", headerName: "Concepto", flex: 1 },
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
            <IconButton onClick={() => handleDeleteClick(params.row.idconcepto)} size="small">
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
        <Typography variant="h4">Conceptos</Typography>
        <Button
          variant="contained"
          startIcon={<PostAdd />}
          onClick={() => handleOpenForm()}
        >
          Nuevo Concepto
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
        getRowId={(row) => row.idconcepto}
      />

      <ModalComponent
        open={openFormModal}
        handleClose={handleCloseForm}
        title={dataToEdit ? "Editar Concepto" : "Nuevo Concepto"}
        width="400px"
        content={<ConceptoForm handleCloseModal={handleCloseForm} dataToEdit={dataToEdit} />}
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

export default ConceptosPage;
