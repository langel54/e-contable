import CustomTable from "@/app/components/CustonTable";
import { getFormaPagoTribs, deleteFormaPagoTrib } from "@/app/services/formaPagoTribServices";
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
import FormaPagoTribForm from "./FormaPagoTribForm";
import Swal from "sweetalert2";

const FormaPagoTribPage = () => {
  const [formasPago, setFormasPago] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermValue, setSearchTermValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editedFormaPago, setEditedFormaPago] = useState(null);

  const fetchData = async (page, limit, search) => {
    setLoading(true);
    try {
      const data = await getFormaPagoTribs(page, limit, search);
       // data puede ser { formaPagoTribs: [], total: 0 }
      if (data.formaPagoTribs) {
          setFormasPago(data.formaPagoTribs);
          setTotal(data.total);
      } else {
         setFormasPago(data);
         setTotal(data.length || 0);
      }
    } catch (error) {
      console.error("Error fetching formaPagoTribs:", error);
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
          await deleteFormaPagoTrib(id);
          Swal.fire("Eliminado", "La forma de pago ha sido eliminada.", "success");
          fetchData(pagination.page + 1, pagination.pageSize, searchTermValue);
        } catch (error) {
          Swal.fire("Error", error.message || "Error al eliminar", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditedFormaPago(null);
    fetchData(pagination.page + 1, pagination.pageSize, searchTermValue);
  };

  const columns = [
    { field: "idforma_pago_trib", headerName: "ID", width: 120 },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
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
                setEditedFormaPago(params.row);
                setOpenModal(true);
              }}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => handleDelete(params.row.idforma_pago_trib)}
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
            Formas de Pago Tributo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona las formas de pago de tributos
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
          Nueva Forma Pago
        </Button>
      </Stack>

      <CustomTable
        columns={columns}
        data={formasPago || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idforma_pago_trib}
      />

      <ModalComponent
        open={openModal}
        handleClose={handleCloseModal}
        title={editedFormaPago ? "Editar Forma Pago" : "Nueva Forma Pago"}
        content={
          <FormaPagoTribForm
            initialData={editedFormaPago}
            handleCloseModal={handleCloseModal}
          />
        }
        width="500px"
      />
    </Box>
  );
};

export default FormaPagoTribPage;
