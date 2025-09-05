import CustomTable from "@/app/components/CustonTable";
import {
  getClientesProvs,
  getFilterClientesProvs,
  updateClienteProv,
  updateDeclaradoTodos,
} from "@/app/services/clienteProvService";
import { accessSunat } from "@/app/services/sunServices";
import { Edit, MoreVert } from "@mui/icons-material";
import {
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
  ListItemIcon,
  ListItemText,
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

const clientColumns = (
  setEditedClient,
  setOpenAddModal,
  setOpenStatusModal
) => {
  return [
    // {
    //   field: "idclienteprov",
    //   headerName: "Código",
    // },
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
      renderCell: (params) => {
        return (
          <Stack direction={"row"} spacing={1}>
            {params.row.planilla_elect === "SI" ? (
              <Tooltip title="Declara planilla" arrow placement="left">
                <AssignmentIndIcon fontSize={"small"} color="info" />
              </Tooltip>
            ) : (
              <AssignmentIndIcon fontSize={"small"} color="disabled" />
            )}
            <Typography>{params.row.razonsocial}</Typography>
          </Stack>
        );
      },
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
    // {
    //   field: "clave_rnp",
    //   headerName: "RNP",
    // },

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
          <IconButton
            sx={{ fontSize: 10, p: 1, height: 20 }}
            onClick={() => {}}
          >
            <Badge badgeContent={label} color={color}></Badge>
          </IconButton>
        );
      },
    },
    {
      field: "actions",
      headerName: "¿Declarado?",
      sortable: false,
      // flex: 0.5,
      width: 180,
      renderCell: (params) => {
        const data = {
          usuario: params.row.c_usuario,
          password: params.row.c_passw,
          ruc: params.row.ruc,
        };
        const estadoInicial = params.row.declarado === "1";

        const confirmDialog = ConfirmDialog({
          title: "Registrar declaración",
          message: `¿Estás seguro de marcar como:  ${
            estadoInicial ? "No declarado" : "Declarado"
          }?`,
          onConfirm: () => {
            const declaradoValue = !estadoInicial ? "1" : "0";
            params.row.declarado = declaradoValue;
            console.log(params.row);
            try {
              updateClienteProv(params.row.idclienteprov, params.row).then(
                () => {
                  params.api.updateRows([{ ...params.row }]);

                  // Swal.fire(
                  //   "Actualizado",
                  //   `El estado se marcó como ${!estadoInicial ? "Sí" : "No"}.`,
                  //   "success"
                  // );
                }
              );
            } catch (error) {
              Swal.fire(
                "Error",
                "No se pudo actualizar el estado. Intenta nuevamente.",
                "error"
              );
            }
          },
        });

        const handleChange = () => {
          confirmDialog.show();
        };

        return (
          <Stack direction={"row"} justifyContent={"space-between"}>
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
            <Tooltip
              title="Trámites y consultas"
              arrow
              placement="left"
              slots={{
                transition: Zoom,
              }}
            >
              <IconButton onClick={() => accessSunat(data)}>
                <SunatIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Sunafil"
              arrow
              placement="left"
              slots={{
                transition: Zoom,
              }}
            >
              <IconButton onClick={() => accessSunafil(data)}>
                <SunatIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];
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

  const fetchDataCliente = useCallback(
    async (currentPage, currentPageSize, digito, regimen, estado, planilla) => {
      setLoading(true);
      try {
        const data = await getFilterClientesProvs(
          currentPage,
          currentPageSize,
          digito,
          regimen,
          estado,
          planilla
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
    fetchDataCliente(
      pagination.page + 1,
      pagination.pageSize,
      selectedDigito,
      selectedRegimen,
      estadoClientesProvider,
      filterWithPlanilla
    );
  }, [
    pagination.page,
    pagination.pageSize,
    selectedDigito,
    selectedRegimen,
    estadoClientesProvider,
    filterWithPlanilla,
  ]);

  // Memoiza las columnas para evitar recrearlas en cada render
  const columns = React.useMemo(
    () => clientColumns(
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
  const fetchAllDataCliente = async (digito, regimen, estado, planilla) => {
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
          planilla
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
      filterWithPlanilla
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
