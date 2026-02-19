import {
  DeleteSweep,
  DriveFileRenameOutline,
  ReceiptLong,
} from "@mui/icons-material";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import EstadoChip from "@/app/components/EstadoChip";

export const getColumns = ({
  setEditSalidaData,
  setOpenFormModal,
  handleOpenPDFModal,
  openDeleteModal,
}) => {
  return [
    { field: "idsalida", headerName: "ID", width: 80 },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 180,
      valueGetter: (params) => {
        return dayjs(params).format("DD-MM-YYYY HH:mm");
      },
    },
    {
      field: "cliente_prov",
      headerName: "Cliente/Proveedor",
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction={"column"}>
            <Typography>{params.row.cliente_prov.razonsocial}</Typography>
            <Stack spacing={1} direction={"row"} alignItems={"center"}>
              <EstadoChip
                estado={params.row?.idestado}
                label={params.row.estado.nom_estado}
              />
              <Typography color="secondary" fontSize={"10px"}>
                {params.row.registra} :
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'info.main',
                  fontSize: '10px',
                  fontWeight: 500
                }}
              >
                {params.row.concepto.nombre_concepto}
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: "periodo",
      headerName: "Periodo",
      renderCell: (params) => {
        return (
          <>
            {params.row.periodo.nom_periodo}- {params.row.anio}
          </>
        );
      },
    },
    {
      field: "importe",
      headerName: "Importe",
      width: 120,
      type: "number",
      valueFormatter: (params) => {
        if (params == null) return "-";
        return new Intl.NumberFormat("es-PE", {
          style: "currency",
          currency: "PEN",
          minimumFractionDigits: 2,
        }).format(params);
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 180,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => (
        <Stack direction={"row"} spacing={1}>
          <Tooltip title="Editar" arrow placement="top">
            <IconButton
              size="small"
              onClick={() => {
                setEditSalidaData(params.row);
                setOpenFormModal(true);
              }}
              color="info" // Uses theme.palette.info.main
              sx={{ marginRight: 1 }}
            >
              <DriveFileRenameOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title="Anular" arrow placement="top">
            <IconButton
              size="small"
              color="error" // Uses theme.palette.error.main
              sx={{ marginRight: 1 }}
              onClick={() => {
                if (typeof openDeleteModal === "function") {
                  openDeleteModal(params.row.idsalida);
                }
              }}
            >
              <DeleteSweep />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver / Imprimir" arrow placement="top">
            <IconButton
              size="small"
              onClick={() => handleOpenPDFModal(params.row)}
              color="success" // Uses theme.palette.success.main
            >
              <ReceiptLong />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    // Otros campos relevantes del modelo Salida pueden agregarse aquí
  ];
};
