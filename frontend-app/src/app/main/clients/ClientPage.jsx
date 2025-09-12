import CustomTable from "@/app/components/CustonTable";
import { getClientesProvs } from "@/app/services/clienteProvService";
import { accessSunat } from "@/app/services/sunServices";
import AnimateButton from "@/app/ui-components/@extended/AnimateButton";
import {
  AddCircleOutlineSharp,
  Clear,
  Delete,
  Edit,
  Search,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import EstadoClienteSelect from "./SelectStatusClient";
import { useAuth } from "@/app/provider";
import SearchComponent from "@/app/components/SearchComponent";
import ClientForm from "./ClientForm";
import ModalComponent from "@/app/components/ModalComponent";
import EstatusEditForm from "./EstatusEditForm";
import SunatIcon from "@/app/components/SunatIcon";
import { clientsStore } from "@/app/store/clientsStore";
import ClientDetails from "./ClientDetails";

const clientColumns = (
  setEditedClient,
  setOpenAddModal,
  setOpenStatusModal,
  setOpenDetailsModal
) => {
  return [
    {
      field: "idclienteprov",
      headerName: "Código",
    },
    {
      field: "nregimen",
      headerName: "Régimen",
      renderCell: (params) => {
        return (
          <Chip
            label={params.row.nregimen || "-"}
            color="secondary"
            size="small"
            sx={{ fontSize: 10 }}
            variant="outlined"
          />
        );
      },
    },
    {
      field: "razonsocial",
      headerName: "Razón Social",
      flex: 1,
    },
    {
      field: "ruc",
      headerName: "RUC",
      valueGetter: (params) => params || "-",
    },
    {
      field: "dni",
      headerName: "DNI",
      valueGetter: (params) => {
        return params || "-";
      },
    },
    {
      field: "c_usuario",
      headerName: "Usuario",
    },
    {
      field: "c_passw",
      headerName: "Password",
    },
    {
      field: "clave_afpnet",
      headerName: "AFPNet",
    },
    {
      field: "clave_rnp",
      headerName: "RNP",
    },

    {
      field: "estado",
      headerName: "Estado",
      renderCell: (params) => {
        let label, color;

        switch (params.row.estado) {
          case "1":
            label = "Activo";
            color = "success";
            break;
          case "2":
            label = "Suspendido";
            color = "warning";
            break;
          case "3":
            label = "Baja temp";
            color = "info";
            break;
          case "4":
            label = "Baja def";
            color = "error";
            break;
          default:
            label = "Sin estado";
            color = "default";
            break;
        }

        return (
          <Tooltip
            title="Cambiar estado"
            arrow
            slots={{
              transition: Zoom,
            }}
            placement="top"
          >
            <IconButton
              sx={{ fontSize: 10, p: 1, height: 20 }}
              onClick={() => {
                setEditedClient(params.row);
                setOpenStatusModal();
              }}
            >
              <Badge badgeContent={label} color={color}></Badge>
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      width: 150,
      renderCell: (params) => {
        const data = {
          usuario: params.row.c_usuario,
          password: params.row.c_passw,
          ruc: params.row.ruc,
        };
        return (
          <div className="flex gap-8">
            <IconButton
              size="small"
              onClick={() => {
                setEditedClient(params.row);
                setOpenAddModal();
              }}
              color="primary"
            >
              <Edit fontSize="small" />
            </IconButton>
            {/* <IconButton
              size="small"
              onClick={() => handleDelete(params.row.idclienteprov)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton> */}
            <Tooltip
              title="Tramites y consultas"
              arrow
              placement="top"
              slots={{
                transition: Zoom,
              }}
            >
              <IconButton onClick={() => accessSunat(data)}>
                <SunatIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={() => {
                setOpenDetailsModal();
                setEditedClient(params.row);
              }}
            >
              <Badge badgeContent={"Ver"} color="secondary"></Badge>
            </IconButton>
          </div>
        );
      },
    },
  ];
};
const ClientPage = () => {
  const { estadoClientesProvider } = useAuth();
  const {
    clients,
    total,
    loading,
    fetchClientesProvs,
    addClient,
    updateClient,
  } = clientsStore();

  // const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  // const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  // const [loading, setLoading] = useState(false);
  const [searchTermValue, setSearchTermValue] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const [editedClient, setEditedClient] = useState(null);

  // const fetchDataCliente = async (
  //   currentPage,
  //   currentPageSize,
  //   search,
  //   estado
  // ) => {
  //   setLoading(true);
  //   try {
  //     const data = await getClientesProvs(
  //       currentPage,
  //       currentPageSize,
  //       search,
  //       estado
  //     );
  //     setClients(data.clientesProvs);
  //     setTotal(data.pagination.total);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    // if (value.length >= 2 || value.length === 0) {
    //   setPagination((prev) => ({ ...prev, page: 0 }));
    // }
  };

  const refreshTable = () => {
    fetchClientesProvs(
      pagination.page + 1,
      pagination.pageSize,
      searchTermValue,
      estadoClientesProvider
    );
  };

  const handleSearchButton = () => {
    if (searchTerm.length >= 1) {
      setSearchTermValue(searchTerm);
      setPagination((prev) => ({ ...prev, page: 0 }));
    }
  };
  const handleClearSearch = () => {
    setSearchTermValue("");
    setSearchTerm("");
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setEditedClient(null);
    refreshTable();
  };
  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setEditedClient(null);
    refreshTable();
  };
  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setEditedClient(null);
  };

  useEffect(() => {
    if (searchTermValue.length >= 2 || searchTermValue.length === 0) {
      fetchClientesProvs(
        pagination.page + 1,
        pagination.pageSize,
        searchTermValue,
        estadoClientesProvider
      );
    }
  }, [pagination, estadoClientesProvider, searchTermValue]);

  const columns = React.useMemo(
    () =>
      clientColumns(
        setEditedClient,
        () => setOpenAddModal(true),
        () => setOpenStatusModal(true),
        () => setOpenDetailsModal(true)
      ),
    [setEditedClient]
  );
  return (
    <Box>
      <Stack sx={{ pb: 2 }} direction="row" spacing={2}>
        <Typography variant="h4" fontWeight={"100"}>
          Clientes
        </Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchComponent
          handleClearSearch={handleClearSearch}
          handleSearchButton={handleSearchButton}
          handleSearchChange={handleSearchChange}
          searchTerm={searchTerm}
        />
        <Stack direction={"row"} justifyContent={"end"} spacing={4}>
          <EstadoClienteSelect />
          <Button
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => {
              setOpenAddModal(true);
            }}
          >
            <AddCircleOutlineSharp fontSize="inherit" /> Agregar Usuario
          </Button>
        </Stack>
      </Stack>

      <CustomTable
        columns={columns || []}
        data={clients || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row?.idclienteprov ?? `tmp-${Math.random()}`}
      />
      <ModalComponent
        content={
          <ClientForm
            handleCloseModal={handleCloseAddModal}
            initialData={editedClient}
            formAction={editedClient ? "update" : "create"}
            idclienteprov={editedClient?.idclienteprov}
          />
        }
        title={
          editedClient
            ? "Editar Cliente / Beneficiario"
            : "Agregar Cliente / Beneficiario"
        }
        handleClose={handleCloseAddModal}
        open={openAddModal}
      />

      <ModalComponent
        open={openStatusModal}
        content={
          <EstatusEditForm
            data={editedClient}
            handleCloseModal={handleCloseStatusModal}
          />
        }
        handleClose={handleCloseStatusModal}
        title={"Cambiar estado del Cliente"}
        width="400px"
      />
      <ModalComponent
        title={"Detalles del Cliente / Beneficiario"}
        open={openDetailsModal}
        handleClose={handleCloseDetailsModal}
        content={<ClientDetails data={editedClient} />}
        width="600px"
      />
    </Box>
  );
};
export default ClientPage;
