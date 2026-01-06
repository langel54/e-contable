import CustomTable from "@/app/components/CustonTable";
import { getFacturadores, deleteFacturador } from "@/app/services/facturadorServices";
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
import FacturadorForm from "./FacturadorForm";
import Swal from "sweetalert2";

const FacturadorPage = () => {
  const [facturadores, setFacturadores] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermValue, setSearchTermValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editedFacturador, setEditedFacturador] = useState(null);

  const fetchData = async (page, limit, search) => {
    setLoading(true);
    try {
      // Nota: el servicio getFacturadores parece no aceptar parámetros de paginación en el frontend actual (ver step 114)
      // pero el backend sí. El servicio debería ser actualizado para soportarlo o recibir query params.
      // El código del servicio en step 114: return fetchWithAuth("/facturador");
      // Muestra que NO envía query params. Sin embargo, el backend Controller (step 36) lee req.query.
      // Así que si paso params al fetch, podría funcionar si fetchWithAuth los concatena, pero step 114 no concatena nada.
      // Asumiré que el servicio devuelve todo y paginaré en cliente o necesito actualizar el servicio.
      // Mejor actualizo el servicio primero? O asumo que lo corregí.
      // El usuario pidió "crea cruds", si el servicio está roto/incompleto debo arreglarlo?
      // Step 114: export const getFacturadores = async () => { return fetchWithAuth("/facturador"); };
      // Esto llama a GET /facturador sin params. El controller devuelve pagina 1 limit 10 por defecto.
      // ¡Entonces solo veré la primera página!
      // Debo actualizar `facturadorServices.js` para aceptar params.
      // Sin embargo, por ahora usaré la implementación que asume que el servicio funciona o lo arreglaré inline si puedo.
      // Voy a llamar a getFacturadores() y ver qué pasa.
      // Espera, si el controller paginas, necesito pasarle `?skip=...&limit=...`.
      // Voy a reescribir el servicio `facturadorServices.js` en el mismo paso o después?
      // Mejor reescribo el servicio en este paso para asegurar que funcione.
      const data = await getFacturadores(page, limit, search);
      if (data.facturadores) {
          setFacturadores(data.facturadores);
          setTotal(data.total);
      } else {
          // Fallback si la estructura es diferente
          setFacturadores(data); 
      }
    } catch (error) {
      console.error("Error fetching facturadores:", error);
    } finally {
      setLoading(false);
    }
  };

  // Como detecté que el servicio facturadorServices.js está incompleto, lo voy a sobrescribir en este turno.
  
  useEffect(() => {
    fetchData(pagination.page, pagination.pageSize, searchTermValue);
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
          await deleteFacturador(id);
          Swal.fire("Eliminado", "El facturador ha sido eliminado.", "success");
          fetchData(pagination.page, pagination.pageSize, searchTermValue);
        } catch (error) {
          Swal.fire("Error", error.message || "Error al eliminar", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditedFacturador(null);
    fetchData(pagination.page, pagination.pageSize, searchTermValue);
  };

  const columns = [
    { field: "idfacturador", headerName: "ID", width: 90 },
    { field: "n_facturador", headerName: "Nombre", flex: 1 },
    { field: "f_obs", headerName: "Observación", flex: 1 },
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
                setEditedFacturador(params.row);
                setOpenModal(true);
              }}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => handleDelete(params.row.idfacturador)}
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
          Facturadores
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
          Nuevo Facturador
        </Button>
      </Stack>

      <CustomTable
        columns={columns}
        data={facturadores || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idfacturador}
      />

      <ModalComponent
        open={openModal}
        handleClose={handleCloseModal}
        title={editedFacturador ? "Editar Facturador" : "Nuevo Facturador"}
        content={
          <FacturadorForm
            initialData={editedFacturador}
            handleCloseModal={handleCloseModal}
          />
        }
        width="500px"
      />
    </Box>
  );
};

export default FacturadorPage;
