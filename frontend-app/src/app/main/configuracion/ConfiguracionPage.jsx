import CustomTable from "@/app/components/CustonTable";
import { getConfiguraciones, deleteConfiguracion } from "@/app/services/configuracionServices";
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
import ConfiguracionForm from "./ConfiguracionForm";
import Swal from "sweetalert2";

const ConfiguracionPage = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermValue, setSearchTermValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editedConfiguracion, setEditedConfiguracion] = useState(null);

  const fetchData = async (page, limit, search) => {
    setLoading(true);
    try {
      const data = await getConfiguraciones(page, limit, search);
      setConfiguraciones(data.configuraciones);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error("Error fetching configuraciones:", error);
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

  const handleDelete = async (id) => {
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
          await deleteConfiguracion(id);
          Swal.fire("Eliminado", "La configuración ha sido eliminada.", "success");
          fetchData(pagination.page + 1, pagination.pageSize, searchTermValue);
        } catch (error) {
          Swal.fire("Error", error.message || "Error al eliminar", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditedConfiguracion(null);
    fetchData(pagination.page + 1, pagination.pageSize, searchTermValue);
  };

  const columns = [
    { field: "idconfig", headerName: "ID", width: 90 },
    { field: "e_razonsocial", headerName: "Razón Social", flex: 1 },
    { field: "e_ruc", headerName: "RUC", width: 120 },
    { field: "igv", headerName: "IGV", width: 90 },
    { field: "tim", headerName: "TIM", width: 90 },
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
                setEditedConfiguracion(params.row);
                setOpenModal(true);
              }}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => handleDelete(params.row.idconfig)}
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
        <Typography variant="h4" fontWeight="100">
          Configuración
        </Typography>
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
          Nueva Configuración
        </Button>
      </Stack>

      <CustomTable
        columns={columns}
        data={configuraciones || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idconfig}
      />

      <ModalComponent
        open={openModal}
        handleClose={handleCloseModal}
        title={editedConfiguracion ? "Editar Configuración" : "Nueva Configuración"}
        content={
          <ConfiguracionForm
            initialData={editedConfiguracion}
            handleCloseModal={handleCloseModal}
          />
        }
        width="600px"
      />
    </Box>
  );
};

export default ConfiguracionPage;
