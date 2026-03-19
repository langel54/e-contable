"use client";

import CustomTable from "@/app/components/CustonTable";
import { getRubros, deleteRubro } from "@/app/services/rubroServices";
import {
  AddCircleOutlineSharp,
  Delete,
  Edit,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchComponent from "@/app/components/SearchComponent";
import ModalComponent from "@/app/components/ModalComponent";
import RubrosForm from "./RubrosForm";
import Swal from "sweetalert2";

const RubrosPage = () => {
  const [rubros, setRubros] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermValue, setSearchTermValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editedRubro, setEditedRubro] = useState(null);

  const fetchData = async (page, limit, search) => {
    setLoading(true);
    try {
      const data = await getRubros(page, limit, search);
      setRubros(data.rubros);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error("Error fetching rubros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.page + 1, pagination.pageSize, searchTermValue);
  }, [pagination, searchTermValue]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchButton = () => {
    setSearchTermValue(searchTerm);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchTermValue("");
  };

  const handleDelete = async (nrubro) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRubro(nrubro);
          Swal.fire("Eliminado", "El rubro ha sido eliminado.", "success");
          fetchData(pagination.page + 1, pagination.pageSize, searchTermValue);
        } catch (error) {
          Swal.fire("Error", error.message || "Error al eliminar", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditedRubro(null);
    fetchData(pagination.page + 1, pagination.pageSize, searchTermValue);
  };

  const columns = [
    { field: "nrubro", headerName: "Nombre del Rubro", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => {
                setEditedRubro(params.row);
                setOpenModal(true);
              }}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => handleDelete(params.row.nrubro)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack sx={{ pb: 2 }} direction="row" spacing={2} justifyContent="space-between">
        <Stack>
          <Typography variant="h4" gutterBottom>
            Rubros
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona los rubros de los clientes y proveedores
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}
      >
        <SearchComponent
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleSearchButton={handleSearchButton}
          handleClearSearch={handleClearSearch}
        />
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineSharp />}
          onClick={() => setOpenModal(true)}
        >
          Nuevo Rubro
        </Button>
      </Stack>

      <CustomTable
        columns={columns}
        data={rubros || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.nrubro}
      />

      <ModalComponent
        open={openModal}
        handleClose={handleCloseModal}
        title={editedRubro ? "Editar Rubro" : "Nuevo Rubro"}
        content={
          <RubrosForm
            initialData={editedRubro}
            handleCloseModal={handleCloseModal}
          />
        }
        width="500px"
      />
    </Box>
  );
};

export default RubrosPage;
