import CustomTable from "@/app/components/CustonTable";
import { getConceptos, deleteConcepto } from "@/app/services/conceptoServices";
import {
  AddCircleOutlineSharp,
  Delete,
  Edit,
  PostAdd,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchComponent from "@/app/components/SearchComponent";
import ModalComponent from "@/app/components/ModalComponent";
import ConceptoForm from "./ConceptoForm";
import Swal from "sweetalert2";

const ConceptoPage = () => {
  const [conceptos, setConceptos] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermValue, setSearchTermValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editedConcepto, setEditedConcepto] = useState(null);

  const fetchData = async (page, limit, search) => {
    setLoading(true);
    try {
      const data = await getConceptos(page, limit, search);
      setConceptos(data.conceptos);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error("Error fetching conceptos:", error);
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
          await deleteConcepto(id);
          Swal.fire("Eliminado", "El concepto ha sido eliminado.", "success");
          fetchData(pagination.page + 1, pagination.pageSize, searchTermValue);
        } catch (error) {
          Swal.fire("Error", error.message || "Error al eliminar", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditedConcepto(null);
    fetchData(pagination.page + 1, pagination.pageSize, searchTermValue);
  };

  const columns = [
    { field: "idconcepto", headerName: "ID", width: 90 },
    { field: "nombre_concepto", headerName: "Nombre", flex: 1 },
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
                setEditedConcepto(params.row);
                setOpenModal(true);
              }}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => handleDelete(params.row.idconcepto)}
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
            Conceptos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona los conceptos de ingresos y egresos
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
          Nuevo Concepto
        </Button>
      </Stack>

      <CustomTable
        columns={columns}
        data={conceptos || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idconcepto}
      />

      <ModalComponent
        open={openModal}
        handleClose={handleCloseModal}
        title={editedConcepto ? "Editar Concepto" : "Nuevo Concepto"}
        content={
          <ConceptoForm
            initialData={editedConcepto}
            handleCloseModal={handleCloseModal}
          />
        }
        width="500px"
      />
    </Box>
  );
};

export default ConceptoPage;
