
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
import { getFacturadores, deleteFacturador } from "@/app/services/facturadorServices";
import FacturadorForm from "./FacturadorForm";

const FacturadoresPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState(""); // Add search support if needed in CustomTable

  const [openFormModal, setOpenFormModal] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFacturadores(pagination.page, pagination.pageSize, search);
      // Adjust based on actual API response structure (checking controller...)
      // Controller: returns { facturadores, pagination: { total, ... } } if structured, 
      // OR direct array if not.
      // Based on ExpensesPage/Controller logic:
      // FacturadorController: res.json(facturadores); (Wait, Step 56 showed caja controller returned object. Facturador controller usually just list?)
      // Let's assume standard response based on `expensesUtils`: { data, total } or similar.
      // Actually `facturadorServices.js` calls `/facturador`. 
      // If backend returns array directly, we handle it.
      if (response && response.facturadores) {
         setData(response.facturadores);
         setTotal(response.total || response.pagination?.total || 0);
      } else if (Array.isArray(response)) {
          setData(response);
          setTotal(response.length);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching facturadores:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, search]);

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
      await deleteFacturador(deleteId);
      setOpenDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const columns = [
    { field: "idfacturador", headerName: "ID", width: 90 },
    { field: "n_facturador", headerName: "Nombre", flex: 1 },
    { field: "f_obs", headerName: "Observaciones", flex: 2 },
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
            <IconButton onClick={() => handleDeleteClick(params.row.idfacturador)} size="small">
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
        <Stack>
          <Typography variant="h4" gutterBottom>Facturadores</Typography>
          <Typography variant="body2" color="text.secondary">Gestiona facturadores electrónicos</Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<PostAdd />}
          onClick={() => handleOpenForm()}
        >
          Nuevo Facturador
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
        getRowId={(row) => row.idfacturador}
      />

      <ModalComponent
        open={openFormModal}
        handleClose={handleCloseForm}
        title={dataToEdit ? "Editar Facturador" : "Nuevo Facturador"}
        width="500px"
        content={<FacturadorForm handleCloseModal={handleCloseForm} dataToEdit={dataToEdit} />}
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

export default FacturadoresPage;
