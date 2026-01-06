import CustomTable from "@/app/components/CustonTable";
import {
  getClientesProvs,
  getFilterClientesProvs,
  updateClienteProv,
  updateDeclaradoTodos,
} from "@/app/services/clienteProvService";
import {
  accessSunatDeclaracionesPagos,
  accessSunatTramites,
} from "@/app/services/sunServices";
import {
  AccountBalance,
  AssignmentInd,
  Done,
  Edit,
  Error,
  Launch,
  MoreVert,
  MoreVertOutlined,
  Policy,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Stack,
  Switch,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import EstadoClienteSelect from "../clients/SelectStatusClient";
import { useAuth } from "@/app/provider";
import SearchComponent from "@/app/components/SearchComponent";
import SunatIcon from "@/app/components/SunatIcon";
import SelectDigito from "./SelectDigito";
import SelectRegimen from "./SelectRegimen";
import SwitchIosComponent from "@/app/components/SwitchIosComponent";
import ConfirmDialog from "@/app/components/ConfirmAlert";
import Swal from "sweetalert2";
import excelExport from "@/app/components/excelReport";
import { FileExcelFilled, FilePdfFilled } from "@ant-design/icons";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { accessSunafil } from "@/app/services/sunafilServices";

export const clientColumns = (
  setEditedClient,
  setOpenAddModal,
  setOpenStatusModal
) => {
  return [
    {
      field: "idclienteprov",
      headerName: "ID",
      width: 60,
    },

    {
      field: "regimen",
      headerName: "Rég.",
      with: 50,
      align: "center",
      renderCell: (params) => {
        const { nregimen } = params.row;

        return (
          <Stack
            direction="row"
            flexWrap="nowrap"
            alignItems="center"
            spacing={0.5}
          >
            <Chip
              label={nregimen || "-"}
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ fontSize: 8, width: "fit-content" }}
            />
          </Stack>
        );
      },
    },

    {
      field: "info",
      headerName: "Cliente / Proveedor",
      flex: 1.5,
      renderCell: (params) => {
        const { razonsocial, planilla_elect } = params.row;

        return (
          <Stack
            direction="row"
            flexWrap="nowrap"
            alignItems="center"
            spacing={0.5}
          >
            {planilla_elect === "SI" ? (
              <Tooltip title="Declara planilla">
                <AssignmentIndIcon fontSize="small" color="info" />
              </Tooltip>
            ) : (
              <AssignmentIndIcon fontSize="small" color="disabled" />
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {razonsocial}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "ruc",
      headerName: "RUC",
      width: 100,
    },
    {
      field: "dni",
      headerName: "DNI",
      width: 80,
    },
    {
      field: "c_usuario",
      headerName: "Usuario",
      width: 100,
    },
    {
      field: "c_passw",
      headerName: "Password",
      width: 100,
    },

    {
      field: "clave_afpnet",
      headerName: "AFPNet",
      width: 80,
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 100,
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
            label = "Baja Temp";
            color = "info";
            break;
          case "4":
            label = "Baja Def";
            color = "error";
            break;
          default:
            label = "Sin estado";
            color = "default";
        }
        return (
          <Chip label={label} color={color} size="small" variant="outlined" />
        );
      },
    },
    {
      field: "actions",
      headerName: "Declarado?",
      width: 120,
      sortable: false,
      renderCell: (params) => <ActionPopover params={params} />,
    },
  ];
};

const ActionPopover = ({ params }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const data = {
    usuario: params.row.c_usuario,
    password: params.row.c_passw,
    ruc: params.row.ruc,
  };
  const estadoInicial = params.row.declarado === "1";

  const confirmDialog = ConfirmDialog({
    title: "Registrar declaración",
    message: `¿Estás seguro de marcar como: ${
      estadoInicial ? "No declarado" : "Declarado"
    }?`,
    onConfirm: () => {
      const declaradoValue = !estadoInicial ? "1" : "0";
      params.row.declarado = declaradoValue;
      updateClienteProv(params.row.idclienteprov, params.row)
        .then(() => params.api.updateRows([{ ...params.row }]))
        .catch(() =>
          Swal.fire("Error", "No se pudo actualizar el estado", "error")
        );
    },
  });

  const handleChange = () => confirmDialog.show();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={estadoInicial}
            onChange={handleChange}
            color="primary"
          />
        }
        label={estadoInicial ? "Sí" : "No"}
      />
      <IconButton size="small" onClick={handleClick}>
        <MoreVertOutlined />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ "& .MuiPaper-root": { width: 220, p: 0.5 } }}
      >
        <List dense>
          {/* <ListItemButton onClick={handleChange}>
            <ListItemIcon>
              {estadoInicial ? (
                <Done color="success" />
              ) : (
                <Error color="error" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                estadoInicial ? "Marcar No declarado" : "Marcar Declarado"
              }
            />
          </ListItemButton>
          <Divider /> */}
          <ListItemButton
            onClick={async () => {
              const res = await accessSunatTramites(data);
              if (res.url)
                window.open(
                  res.url,
                  "_blank",
                  "noopener,noreferrer,width=1200,height=800"
                );
            }}
          >
            <ListItemIcon>
              <Launch fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Trámites SUNAT" />
          </ListItemButton>
          <ListItemButton
            onClick={async () => {
              const res = await accessSunatDeclaracionesPagos(data);
              if (res.url)
                window.open(
                  res.url,
                  "_blank",
                  "noopener,noreferrer,width=1200,height=800"
                );
            }}
          >
            <ListItemIcon>
              <SunatIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Declaraciones y pagos" />
          </ListItemButton>
          <ListItemButton onClick={() => accessSunafil(data)}>
            <ListItemIcon>
              <SunatIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sunafil" />
          </ListItemButton>
        </List>
      </Popover>
    </>
  );
};

const ClientsFilter = () => {
  const { estadoClientesProvider } = useAuth();
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDigito, setSelectedDigito] = useState("");
  const [selectedRegimen, setSelectedRegimen] = useState("");

  const [anchorElPop, setAnchorElPop] = useState(null);

  const [filterWithPlanilla, setFilterWithPlanilla] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermValue, setSearchTermValue] = useState("");

  const fetchDataCliente = useCallback(
    async (currentPage, currentPageSize, digito, regimen, estado, planilla, search) => {
      setLoading(true);
      try {
        const data = await getFilterClientesProvs(
          currentPage,
          currentPageSize,
          digito,
          regimen,
          estado,
          planilla,
          search
        );
        setClients(data.clientesProvs);
        setTotal(data.pagination.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [] // Memoiza para evitar crear una nueva referencia en cada render
  );

  // Search handlers
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
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

  useEffect(() => {
    // Si cambian los filtros, reseteamos a la primera página
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, [
    selectedDigito,
    selectedRegimen,
    estadoClientesProvider,
    filterWithPlanilla,
  ]);

  useEffect(() => {
    // Hacemos la petición solo después de que pagination.page esté actualizado
    if (searchTermValue.length >= 2 || searchTermValue.length === 0) {
      fetchDataCliente(
        pagination.page + 1,
        pagination.pageSize,
        selectedDigito,
        selectedRegimen,
        estadoClientesProvider,
        filterWithPlanilla,
        searchTermValue
      );
    }
  }, [
    pagination.page,
    pagination.pageSize,
    selectedDigito,
    selectedRegimen,
    estadoClientesProvider,
    filterWithPlanilla,
    searchTermValue,
  ]);

  // Memoiza las columnas para evitar recrearlas en cada render
  const columns = React.useMemo(
    () =>
      clientColumns(
        () => setOpenAddModal(true),
        () => setOpenStatusModal(true)
      ),
    []
  );

  const confirmDialog = ConfirmDialog({
    title: "Desmarcar todos",
    message: `¿Estás seguro de desmarcar las filas marcadas?`,
    onConfirm: () => {
      try {
        updateDeclaradoTodos("0");
      } catch (error) {
        Swal.fire(
          "Error",
          "No se pudo actualizar el estado. Intenta nuevamente.",
          "error"
        );
      }
    },
  });
  const handleModificarDeclarado = () => {
    confirmDialog.show();
  };

  //para eexcel
  const fetchAllDataCliente = async (digito, regimen, estado, planilla, search = "") => {
    let allData = [];
    let currentPage = 1;
    const pageSize = 100;

    try {
      while (true) {
        const data = await getFilterClientesProvs(
          currentPage,
          pageSize,
          digito,
          regimen,
          estado,
          planilla,
          search
        );

        allData = [...allData, ...data.clientesProvs];

        if (data.clientesProvs.length < pageSize) {
          break;
        }

        currentPage++;
      }
    } catch (error) {
      console.error("Error:", error);
    }

    return allData;
  };

  const imageUrl = "/images/users/avatar-1.png";

  const handleGenerateExcel = async () => {
    const selectedColumns = {
      idclienteprov: "ID Cliente/Proveedor",
      nregimen: "Régimen",
      razonsocial: "Razón Social",
      // u_digito: "Dígito",
      ruc: "RUC",
      // c_usuario: "Usuario",
      // c_passw: "Contraseña",
      clave_afpnet: "AFPNET",
      obs: "OBSERVACIONES",
    };

    // Espera a que los datos sean obtenidos antes de continuar
    const fetchedData = await fetchAllDataCliente(
      selectedDigito,
      selectedRegimen,
      estadoClientesProvider,
      filterWithPlanilla,
      searchTermValue
    );

    // Ahora generamos el reporte usando los datos obtenidos
    const generateReport = excelExport({
      data: fetchedData, // Usamos los datos devueltos por fetchAllDataCliente
      imageUrl: imageUrl,
      fileName: "reporte_completo.xlsx",
      title: "Reporte de Clientes: " + selectedRegimen + " - " + selectedDigito,
      columnsToShow: selectedColumns,
    });

    generateReport(); // Ejecutamos la generación del archivo Excel
  };

  const handleClickPop = (event) => setAnchorElPop(event.currentTarget);
  const handleClosePop = () => setAnchorElPop(null);

  const handlePlanilla = () => {
    setFilterWithPlanilla(!filterWithPlanilla);
  };

  const theme = useTheme();
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
          <SelectDigito
            selected={selectedDigito}
            setSelected={setSelectedDigito}
          />
          <SelectRegimen
            selected={selectedRegimen}
            setSelected={setSelectedRegimen}
          />
          <EstadoClienteSelect />
          <FormControlLabel
            sx={{
              // background: theme.palette.background.paper,
              borderRadius: 2,
              paddingRight: 2,
              border: "1px solid" + theme.palette.grey[300],
            }}
            control={
              <Checkbox
                checked={filterWithPlanilla}
                onChange={handlePlanilla}
                color="success"
              />
            }
            label="Con planilla"
          />
        </Stack>

        <Box
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
          gap={1}
        >
          <Button
            onClick={handleModificarDeclarado}
            variant="contained"
            color="error"
          >
            {"Desmarcar Todos"}
            {/* <Checkbox checked={false} disabled /> No */}
          </Button>
          <IconButton onClick={handleClickPop}>
            <MoreVert />
          </IconButton>
          <Popover
            open={Boolean(anchorElPop)}
            anchorEl={anchorElPop}
            onClose={handleClosePop}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <List>
              <ListItem
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  handleGenerateExcel();
                  handleClosePop();
                }}
              >
                <ListItemIcon
                  sx={(theme) => ({ color: theme.palette.success.main })}
                >
                  <FileExcelFilled />
                </ListItemIcon>
                <ListItemText primary="Exportar Excel" />
              </ListItem>
              <Divider />
              <ListItem
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  onOtherAction();
                  handleClosePop();
                }}
              >
                <ListItemIcon
                  sx={(theme) => ({ color: theme.palette.error.main })}
                >
                  <FilePdfFilled />
                </ListItemIcon>
                <ListItemText primary="Imprimir PDF" />
              </ListItem>
              <Divider />
              <ListItem
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  handleModificarDeclarado();
                  handleClosePop();
                }}
              >
                <ListItemText
                  primary={
                    <>
                      {"Reiniciar todos a: "}{" "}
                      <Checkbox checked={false} disabled /> No
                    </>
                  }
                />
              </ListItem>
            </List>
          </Popover>
        </Box>
      </Stack>

      <CustomTable
        columns={columns || []}
        data={clients}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idclienteprov}
      />
    </Box>
  );
};
export default ClientsFilter;
