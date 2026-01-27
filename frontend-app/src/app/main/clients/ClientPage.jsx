import CustomTable from "@/app/components/CustonTable";
import { getClientesProvs } from "@/app/services/clienteProvService";
import { accessSunatTramites } from "@/app/services/sunServices";
import AnimateButton from "@/app/ui-components/@extended/AnimateButton";
import {
  AccountBalance,
  AddCircleOutlineSharp,
  Clear,
  Delete,
  Edit,
  MoreVert,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import ClientFormWrapper from "./ClientFormWrapper";
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
) => [
    {
      field: "regimen",
      headerName: "Reg.",
      flex: 0.5,
      sortable: false,
      // align: "center",
      renderCell: (params) => {
        const { idclienteprov, nregimen, razonsocial } = params.row;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 0.5 }}>
            <Chip
              label={nregimen || "Sin régimen"}
              size="small"
              variant="outlined"
              sx={{
                mt: 0.3,
                fontSize: 10,
                height: 18,
                alignSelf: "start",
                borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : theme.palette.secondary.main,
                color: 'text.secondary'
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "info",
      headerName: "Cliente",
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        const { idclienteprov, nregimen, razonsocial } = params.row;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 0.5 }}>
            {/* <Avatar
            sx={{
              bgcolor: "primary.light",
              color: "primary.contrastText",
              width: 36,
              height: 36,
              fontSize: 13,
              fontWeight: "bold",
            }}
          >
            {razonsocial ? razonsocial.charAt(0).toUpperCase() : "?"}
          </Avatar> */}

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500, color: "text.primary", lineHeight: 1.2 }}
              >
                {razonsocial || "Sin razón social"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", lineHeight: 1.2 }}
              >
                Código: {idclienteprov}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "ruc",
      headerName: "RUC",
      // width: 120,
      valueGetter: (params) => params || "-",
    },
    {
      field: "dni",
      headerName: "DNI",
      // width: 120,
      valueGetter: (params) => params || "-",
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
      // width: 120,
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
          <Tooltip title="Cambiar estado" arrow TransitionComponent={Zoom}>
            <Button
              // sx={{ fontSize: 10, p: 0.5 }}
              onClick={() => {
                setEditedClient(params.row);
                setOpenStatusModal();
              }}
              color={color}
              variant="contained"
              size="small"
            >
              {label}
              {/* <Badge badgeContent={label} color={color} /> */}
            </Button>
          </Tooltip>
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      width: 80,
      renderCell: (params) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);

        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        const data = {
          usuario: params.row.c_usuario,
          password: params.row.c_passw,
          ruc: params.row.ruc,
        };

        // const handleSunat = async () => {
        //   handleClose();
        //   try {
        //     const res = await accessSunatTramites(data);
        //     if (res.url) {
        //       window.open(
        //         res.url,
        //         "_blank",
        //         "noopener,noreferrer,width=1200,height=800,left=100,top=100"
        //       );
        //     } else {
        //       Swal.fire(
        //         "Error",
        //         res.error || "No se pudo generar la URL.",
        //         "error"
        //       );
        //     }
        //   } catch {
        //     Swal.fire(
        //       "Error",
        //       "No se pudo conectar con el servicio SUNAT.",
        //       "error"
        //     );
        //   }
        // };

        return (
          <>
            <IconButton onClick={handleClick}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                elevation: 3,
                sx: { minWidth: 180, borderRadius: 2, py: 0.5 },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  setEditedClient(params.row);
                  setOpenAddModal();
                }}
              >
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Editar cliente" />
              </MenuItem>

              {/* <MenuItem onClick={handleSunat}>
              <ListItemIcon>
                <AccountBalance fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Trámites SUNAT" />
            </MenuItem> */}

              <Divider />

              <MenuItem
                onClick={() => {
                  handleClose();
                  setEditedClient(params.row);
                  setOpenDetailsModal();
                }}
              >
                <ListItemIcon>
                  <Visibility fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Ver detalles" />
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];
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
        <Stack direction={"row"} justifyContent={"end"} spacing={4} alignItems="center">
          <EstadoClienteSelect />
          <Button
            size="medium"
            variant="contained"
            onClick={() => {
              setOpenAddModal(true);
            }}
            startIcon={<AddCircleOutlineSharp fontSize="inherit" />}
            sx={{
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#818cf8' : theme.palette.primary.main,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#6366f1' : theme.palette.primary.dark,
              }
            }}
          >
            Agregar Cliente
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
          <ClientFormWrapper
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
        width="800px"
      />
    </Box>
  );
};
export default ClientPage;
