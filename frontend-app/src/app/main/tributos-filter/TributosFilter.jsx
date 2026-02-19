import CustomTable from "@/app/components/CustonTable";
import { getFilterTributos } from "@/app/services/tributosService";
import {
  Edit,
  MoreVert,
  AttachMoney,
  CheckCircle,
  Cancel,
  Pending,
  Preview,
  CheckCircleOutline,
  CancelOutlined,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SelectCliente from "./SelectCliente";
import SelectTipoTrib from "./SelectTipoTrib";
import SelectAnio from "./SelectAnio";
import SelectMes from "./SelectMes";
import SelectEstadoTrib from "./SelectEstadoTrib";
import Swal from "sweetalert2";
import excelExport from "@/app/components/excelReport";
import { FileExcelFilled } from "@ant-design/icons";
import ModalComponent from "@/app/components/ModalComponent";
import DrawerComponent from "@/app/components/DrawerComponent";
import TributoForm from "./TributoForm";
import PagosModal from "./pagos/PagosModal";

const tributoColumns = (
  setEditedTributo,
  setOpenAddModal,
  setOpenStatusModal,
  openPagosModalFn,
  updateTableTributos
) => {
  return [
    {
      field: "actions",
      headerName: "Ver",
      width: 60,
      sortable: false,
      align: "left",
      renderCell: (params) => {
        const data = params.row;
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Editar / ELiminar" arrow placement="left">
              <IconButton
                onClick={() => {
                  setEditedTributo(data);
                  setOpenAddModal(true);
                }}
                size="small"
                color="info"
                type="button"
              >
                <Preview fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      field: "idtributos",
      headerName: "N° Reg.",
      width: 80,
      renderCell: (params) => {
        return (
          <Typography variant="body2" fontWeight="bold">
            {params.row.idtributos}
          </Typography>
        );
      },
    },
    {
      field: "fecha_v",
      headerName: "Fecha Venc.",
      width: 80,
      renderCell: (params) => {
        const fecha = params.row.fecha_v;
        if (!fecha) return "-";

        // Convertir fecha a formato DD-MM-YYYY
        const date = new Date(fecha);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return (
          <Typography variant="body2">{`${day}-${month}-${year}`}</Typography>
        );
      },
    },
    {
      field: "periodo",
      headerName: "Periodo",
      width: 80,
      renderCell: (params) => {
        const anio = params.row.anio;
        const mes = params.row.mes;
        const periodo = anio && mes ? `${anio}${mes.padStart(2, "0")}` : "-";
        return <Typography variant="body2">{periodo}</Typography>;
      },
    },
    {
      field: "cliente_prov",
      headerName: "Razón Social",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const cliente = params.row.cliente_prov;
        return (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {cliente?.razonsocial || "-"}
          </Typography>
        );
      },
    },
    {
      field: "tipo_trib",
      headerName: "Cod. trib.",
      width: 80,
      renderCell: (params) => {
        const tipoTrib = params.row.tipo_trib;
        return (
          <Tooltip title={tipoTrib.descripcion_t} placement="top-start" arrow>
            <Typography
              variant="caption"
              color="primary"
              fontWeight={600}
              // onClick={() =>
              //   console.log("Código tributo:", tipoTrib?.idtipo_trib)
              // }
            >
              {tipoTrib?.idtipo_trib || "-"}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "importe_reg",
      headerName: "Determinado.",
      width: 80,
      align: "right",
      renderCell: (params) => {
        const importe = params.row.importe_reg || 0;
        return (
          <Typography
            variant="body2"
            sx={{
              backgroundColor: 'info.lighter',
              color: 'info.main',
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {importe.toLocaleString("es-PE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        );
      },
    },
    {
      field: "importe_pc",
      headerName: "Pagado",
      width: 80,
      align: "right",
      renderCell: (params) => {
        const importe = params.row.importe_pc || 0;
        return (
          <Typography
            variant="body2"
            sx={{
              backgroundColor: 'success.lighter',
              color: 'success.main',
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {importe.toLocaleString("es-PE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        );
      },
    },
    {
      field: "importe_pend",
      headerName: "Pendiente",
      width: 80,
      align: "right",
      renderCell: (params) => {
        const pendiente =
          (params.row.importe_reg || 0) - (params.row.importe_pc || 0);
        return (
          <Typography
            variant="body2"
            sx={{
              backgroundColor: 'error.lighter',
              color: 'error.main',
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {pendiente.toLocaleString("es-PE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        );
      },
    },
    {
      field: "dias_atrasados",
      headerName: "D-Atrasados",
      width: 80,
      renderCell: (params) => {
        const fechaVencStr = params.row.fecha_v;
        const fechaVenc = (fechaVencStr && fechaVencStr !== "0000-00-00") ? new Date(fechaVencStr) : null;
        
        if (!fechaVenc || isNaN(fechaVenc.getTime())) {
          return <Typography variant="body2">0 días</Typography>;
        }

        const hoy = new Date();
        const diffTime = hoy - fechaVenc;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diasAtrasados = diffDays > 0 ? diffDays : 0;

        return <Typography variant="body2">{diasAtrasados} días</Typography>;
      },
    },
    {
      field: "interes",
      headerName: "Interes",
      width: 80,
      align: "right",
      renderCell: (params) => {
        const fechaVenc = params.row.fecha_v ? new Date(params.row.fecha_v) : null;
        if (!fechaVenc) return <Typography variant="body2">0.00</Typography>;

        const hoy = new Date();
        const diffTime = hoy - fechaVenc;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const mesesAtrasados = Math.max(0, diffDays / 30);
        const interes = (params.row.importe_reg || 0) * (mesesAtrasados * 0.004);

        return (
          <Typography
            variant="body2"
            sx={{
              backgroundColor: 'warning.lighter',
              color: 'warning.main',
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {interes.toLocaleString("es-PE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        );
      },
    },
    {
      field: "deuda_actual",
      headerName: "Deuda Actual",
      width: 80,
      align: "right",
      renderCell: (params) => {
        const pendiente =
          (params.row.importe_reg || 0) - (params.row.importe_pc || 0);
        const fechaVenc = params.row.fecha_v ? new Date(params.row.fecha_v) : null;
        let interes = 0;
        if (fechaVenc) {
          const hoy = new Date();
          const diffTime = hoy - fechaVenc;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const mesesAtrasados = Math.max(0, diffDays / 30);
          interes = (params.row.importe_reg || 0) * (mesesAtrasados * 0.004);
        }
        const deudaActual = pendiente + interes;

        return (
          <Typography
            variant="body2"
            sx={{
              backgroundColor: 'error.lighter',
              color: 'error.main',
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold",
              border: (t) => t.palette.mode === 'dark' ? `1px solid ${t.palette.error.main}` : 'none',
            }}
          >
            {deudaActual.toLocaleString("es-PE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        );
      },
    },
    {
      field: "pagado_status",
      headerName: "¿Pagado?",
      width: 80,
      align: "right",
      renderCell: (params) => {
        const pendiente =
          (params.row.importe_reg || 0) - (params.row.importe_pc || 0);
        const estaPagado = pendiente <= 0;
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip arrow placement="left" title="Añadir pago">
              <Button
                variant="outlined"
                color={estaPagado ? "success" : "error"}
                size="small"
                sx={{ minWidth: "auto", px: 1 }}
                onClick={() =>
                  openPagosModalFn(params.row, updateTableTributos)
                }
              >
                {estaPagado ? (
                  <CheckCircle fontSize="small" />
                ) : (
                  <Cancel fontSize="small" />
                )}
              </Button>
            </Tooltip>
            {/* <IconButton
              size="small"
              color="primary"
              onClick={() => openPagosModalFn(params.row)}
            >
              <AttachMoney fontSize="small" />
            </IconButton> */}
          </Stack>
        );
      },
    },
  ];
};

const TributosFilter = () => {
  const [tributos, setTributos] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [selectedTipoTrib, setSelectedTipoTrib] = useState("");
  const [selectedAnio, setSelectedAnio] = useState("");
  const [selectedMes, setSelectedMes] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editedTributo, setEditedTributo] = useState(null);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openPagosModal, setOpenPagosModal] = useState(false);
  const [tributoPagos, setTributoPagos] = useState(null);

  const fetchDataTributos = useCallback(
    async (
      currentPage,
      currentPageSize,
      cliente,
      tipoTrib,
      anio,
      mes,
      estado
    ) => {
      setLoading(true);
      try {
        const data = await getFilterTributos(
          currentPage,
          currentPageSize,
          cliente,
          tipoTrib,
          anio,
          mes,
          estado
        );
        setTributos(data.tributos || []);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "No se pudieron cargar los tributos", "error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    // Si cambian los filtros, reseteamos a la primera página
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, [
    selectedCliente,
    selectedTipoTrib,
    selectedAnio,
    selectedMes,
    selectedEstado,
  ]);

  useEffect(() => {
    // Hacemos la petición solo después de que pagination.page esté actualizado
    fetchDataTributos(
      pagination.page + 1,
      pagination.pageSize,
      selectedCliente,
      selectedTipoTrib,
      selectedAnio,
      selectedMes,
      selectedEstado
    );
  }, [
    pagination.page,
    pagination.pageSize,
    selectedCliente,
    selectedTipoTrib,
    selectedAnio,
    selectedMes,
    selectedEstado,
  ]);

  const updateTableTributos = () => {
    fetchDataTributos(
      pagination.page + 1,
      pagination.pageSize,
      selectedCliente,
      selectedTipoTrib,
      selectedAnio,
      selectedMes,
      selectedEstado
    );
  };
  // Memoiza las columnas para evitar recrearlas en cada render
  const columns = React.useMemo(
    () =>
      tributoColumns(
        (data) => {
          setEditedTributo(data);
          setOpenAddModal(true);
        },
        setOpenAddModal,
        setOpenStatusModal,
        // Añadimos función para abrir pagos
        (data) => {
          setTributoPagos(data);
          setOpenPagosModal(true);
        }
      ),
    [setOpenAddModal, setOpenStatusModal]
  );

  const handleExportExcel = async () => {
    try {
      // Obtener todos los datos sin paginación para exportar
      const data = await getFilterTributos(
        1,
        total, // Un número grande para obtener todos
        selectedCliente,
        selectedTipoTrib,
        selectedAnio,
        selectedMes,
        selectedEstado
      );

      const exportData =
        data.tributos?.map((tributo) => {
          // Calcular días atrasados
          const fechaVencStr = tributo.fecha_v;
          const fechaVenc = (fechaVencStr && fechaVencStr !== "0000-00-00") ? new Date(fechaVencStr) : null;
          
          let diffDays = 0;
          let diasAtrasados = 0;

          if (fechaVenc && !isNaN(fechaVenc.getTime())) {
            const hoy = new Date();
            const diffTime = hoy - fechaVenc;
            diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            diasAtrasados = diffDays > 0 ? diffDays : 0;
          }

          // Calcular interés
          const mesesAtrasados = Math.max(0, diffDays / 30);
          const interes = (tributo.importe_reg || 0) * (mesesAtrasados * 0.004);

          // Calcular deuda actual
          const pendiente = (tributo.importe_reg || 0) - (tributo.importe_pc || 0);
          const deudaActual = pendiente + interes;

          // Formatear fecha
          const fechaFormateada = tributo.fecha_v
            ? new Date(tributo.fecha_v)
                .toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, "-")
            : "-";

          // Formatear período
          const periodo =
            tributo.anio && tributo.mes
              ? `${tributo.anio}${tributo.mes.padStart(2, "0")}`
              : "-";

          return {
            idtributo: tributo.idtributos,
            fecha_registro: fechaFormateada,
            periodo: periodo,
            razonsocial: tributo.cliente_prov?.razonsocial || "-",
            cod_tributo: tributo.tipo_trib?.idtipo_trib || "-",
            determinado: tributo.importe_reg || 0,
            pagado: tributo.importe_pc || 0,
            pendiente: tributo.importe_pend,
            dias_atrasados: `${diasAtrasados} días`,
            interes: interes,
            deuda_actual: deudaActual,
            esta_pagado: pendiente <= 0 ? "Sí" : "No",
            estado:
              tributo.estado === "0"
                ? "Pendiente"
                : tributo.estado === "1"
                ? "Cancelado"
                : tributo.estado === "A"
                ? "Anulado"
                : "Desconocido",
            observaciones: tributo.obs || "-",
          };
        }) || [];
      const selectedColumns = {
        idtributo: "Nro Reg.",
        fecha_registro: "Fecha Registrada",
        periodo: "Periodo",
        razonsocial: "Razón Social",
        cod_tributo: "Cod. Tributo",
        determinado: "Imp. Determinado",
        pagado: "Imp. Pagado",
        pendiente: "Pendiente",
        dias_atrasados: "Atrasado",
        interes: "Interes",
        deuda_actual: "Deuda Actual",
        observaciones: "Obs.",
      };

      excelExport({
        data: exportData, // Usamos los datos devueltos por fetchAllDataCliente
        imageUrl: "",
        fileName: "reporte_tributos.xlsx",
        title: "Reporte de Tributos",
        columnsToShow: selectedColumns,
      })();
    } catch (error) {
      console.error("Error exporting data:", error);
      Swal.fire("Error", "No se pudo exportar los datos", "error");
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, page: 0 }));
  };

  return (
    <Box sx={{ p: 0 }}>
      <Stack
        sx={{ mb: 3 }}
        flexDirection="row"
        flexWrap={"wrap"}
        // spacing={4}
        alignItems={"start"}
        justifyContent={"space-between"}
        gap={4}
      >
        <Stack>
          <Typography variant="h4" gutterBottom>
            Filtro de Tributos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona y filtra los tributos de tus clientes
          </Typography>
        </Stack>
        <SelectCliente
          selected={selectedCliente}
          setSelected={setSelectedCliente}
        />
      </Stack>

      {/* Filtros */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <SelectTipoTrib
          selected={selectedTipoTrib}
          setSelected={setSelectedTipoTrib}
        />
        <SelectAnio selected={selectedAnio} setSelected={setSelectedAnio} />
        <SelectMes selected={selectedMes} setSelected={setSelectedMes} />
        <SelectEstadoTrib
          selected={selectedEstado}
          setSelected={setSelectedEstado}
        />

        <Button
          variant="contained"
          // startIcon={<FileExcelFilled />}
          onClick={handleExportExcel}
          sx={{ ml: "auto", minWidth: 0 }}
          color="success"
        >
          <FileExcelFilled />
        </Button>
        <Button
          variant="contained"
          startIcon={<FileExcelFilled />}
          onClick={() => {
            setEditedTributo(null);
            setOpenAddModal(true);
          }}
        >
          Registrar Tributo
        </Button>
      </Box>

      {/* Tabla */}
      <CustomTable
        columns={columns}
        data={tributos}
        paginationModel={pagination}
        setPaginationModel={(model) => {
          setPagination(model);
        }}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idtributos}
      />

      {/* Drawer Registrar/Editar Tributo */}
      <DrawerComponent
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        title={
          editedTributo ? "Editar / Eliminar Tributo" : "Registrar Tributo"
        }
        width={480}
        content={
          <TributoForm
            tributoEdit={editedTributo}
            handleCloseModal={() => setOpenAddModal(false)}
            onSaved={() => {
              fetchDataTributos(
                pagination.page + 1,
                pagination.pageSize,
                selectedCliente,
                selectedTipoTrib,
                selectedAnio,
                selectedMes,
                selectedEstado
              );
            }}
          />
        }
      />
      <ModalComponent
        open={openPagosModal}
        handleClose={() => {
          setOpenPagosModal(false);
          updateTableTributos();
        }}
        title="Pagos del Tributo"
        content={
          tributoPagos ? (
            <PagosModal
              open={openPagosModal}
              onClose={() => setOpenPagosModal(false)}
              tributo={tributoPagos}
            />
          ) : null
        }
        width={"700px"}
      />
    </Box>
  );
};

export default TributosFilter;
