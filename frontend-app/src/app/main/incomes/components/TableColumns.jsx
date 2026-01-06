import {
  DeleteSweep,
  DriveFileRenameOutline,
  ReceiptLong,
} from "@mui/icons-material";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import EstadoChip from "@/app/components/EstadoChip";

export const getColumns = ({
  setEditIncomeData,
  setOpenFormModal,
  handleOpenPDFModal,
  openDeleteModal,
}) => {
  return [
    { field: "idingreso", headerName: "ID", width: 80 },
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
                  color: (theme) => theme.palette.mode === 'dark' ? 'info.light' : 'info.dark',
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
        <Stack direction={"row"} spacing={"2"}>
          <Tooltip title="Editar" arrow placement="top">
            <IconButton
              color="info"
              size="small"
              onClick={() => {
                setEditIncomeData(params.row);
                setOpenFormModal(true);
              }}
              style={{ marginRight: 8 }}
            >
              <DriveFileRenameOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title="Anular" arrow placement="top">
            <IconButton
              color="error"
              size="small"
              style={{ marginRight: 8 }}
              onClick={() => {
                if (typeof openDeleteModal === "function") {
                  openDeleteModal(params.row.idingreso);
                }
              }}
            >
              <DeleteSweep />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver / Imprimir" arrow placement="top">
            <IconButton
              color="success"
              size="small"
              onClick={() => handleOpenPDFModal(params.row)}
            >
              <ReceiptLong />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
};
