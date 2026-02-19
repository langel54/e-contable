"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  Badge,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  PostAdd,
  DriveFileRenameOutline,
  PersonAdd,
  Edit,
  Person,
  EditCalendar,
} from "@mui/icons-material";
import ModalComponent from "@/app/components/ModalComponent";
import CustomTable from "@/app/components/CustonTable";
import NotasFilters from "./components/NotasFilters";
import NotaForm from "./NotaForm";
import { getNotas } from "@/app/services/notasServices";
import { getClientesProvs } from "@/app/services/clienteProvService";
import dayjs from "dayjs";
import "../../components/date-picker/date-picker.css";
import NotasClienteAutocomplete from "./components/NotasClienteAutocomplete";

export default function NotasList() {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editNotaData, setEditNotaData] = useState(null);

  // Filtros
  const [clientes, setClientes] = useState([]);
  const [clienteFilter, setClienteFilter] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Tabla y datos
  const [notasData, setNotasData] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar clientes para filtro
  useEffect(() => {
    getClientesProvs(1, 1000, "", 1).then((res) => {
      setClientes(res.clientesProvs || []);
    });
  }, []);

  // Cargar notas con filtros
  useEffect(() => {
    async function fetchNotas() {
      setLoading(true);
      try {
        const filters = {};

        if (clienteFilter) {
          filters.cliente = clienteFilter;
        }

        if (startDate) {
          filters.fechaInicio = dayjs(startDate).format("YYYY-MM-DD");
        }

        if (endDate) {
          filters.fechaFin = dayjs(endDate).format("YYYY-MM-DD");
        }

        const data = await getNotas(
          pagination.page + 1,
          pagination.pageSize,
          filters
        );

        setNotasData(data.notas || []);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error("Error al cargar notas:", error);
        setNotasData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    fetchNotas();
  }, [pagination.page, pagination.pageSize, clienteFilter, startDate, endDate]);

  const updateTable = async () => {
    const filters = {
      fechaInicio: startDate,
      fechaFin: endDate,
      cliente: clienteFilter,
    };
    const data = await getNotas(
      pagination.page + 1,
      pagination.pageSize,
      filters
    );

    setNotasData(data.notas || []);
    setTotal(data.pagination?.total || 0);
  };

  // Acciones
  const handleCloseFormModal = () => {
    setOpenFormModal(false);
    setEditNotaData(null);
    updateTable();
  };

  const handleSaved = () => {
    // Recargar datos
    setPagination((prev) => ({ ...prev }));
  };
  const handleResetFilter = () => {
    setClienteFilter("");
    setDateRange([null, null]);
  };

  // Columnas para CustomTable
  const columns = [
    { field: "idnotas", headerName: "N°", flex: 0.5 },
    // {
    //   field: "n_fecha",
    //   headerName: "Registrado",
    //   width: 140,
    //   valueGetter: (params) =>
    //     params ? dayjs(params).format("DD-MM-YYYY") : "",
    // },
    {
      field: "fecha_ed",
      headerName: "Editado",
      width: 140,
      valueGetter: (params) =>
        params ? dayjs(params).format("DD-MM-YYYY") : "",
    },
    {
      field: "cliente_prov",
      headerName: "Empresa / Cliente",
      flex: 2,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Avatar
            sx={{ width: 24, height: 24, bgcolor: "info.main" }}
            variant="circular"
          >
            <Person fontSize="small" />
          </Avatar>
          <Typography noWrap fontWeight={500}>
            {params.row?.cliente_prov?.razonsocial || "—"}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "ncreador",
      headerName: "Creado por",
      flex: 1.2,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack spacing={0}>
            <Typography fontSize={13} fontWeight={500}>
              {params.row.ncreador || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.n_fecha
                ? dayjs(params.row.n_fecha).format("DD/MM/YYYY")
                : ""}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      field: "neditor",
      headerName: "Editado por",
      flex: 1.2,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack spacing={0}>
            <Typography fontSize={13} fontWeight={500}>
              {params.row.neditor || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.fecha_ed
                ? dayjs(params.row.fecha_ed).format("DD/MM/YYYY")
                : ""}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    // { field: "neditor", headerName: "Editó", width: 120 },
    // {
    //   field: "contenido",
    //   headerName: "Contenido",
    //   flex: 2,
    //   renderCell: (params) => (
    //     <span
    //       dangerouslySetInnerHTML={{
    //         __html: params.row.contenido?.slice(0, 100),
    //       }}
    //     />
    //   ),
    // },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 100,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          color="error"
          size="small"
          variant="outlined"
          onClick={() => {
            setEditNotaData(params.row);
            setOpenFormModal(true);
          }}
        >
          <EditCalendar fontSize="small" /> Editar
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Stack
        sx={{ pb: 2 }}
        direction="row"
        spacing={2}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography variant="h4" gutterBottom>
            Notas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Apuntes y notas por cliente
          </Typography>
        </Stack>
        <Button
          size="medium"
          color="success"
          variant="contained"
          onClick={() => setOpenFormModal(true)}
          startIcon={<PostAdd fontSize="inherit" />}
        >
          Nueva Nota
        </Button>
      </Stack>
      <Divider />
      <NotasClienteAutocomplete
        value={clienteFilter}
        onChange={setClienteFilter}
        sx={{ minWidth: 280, pb: 2 }}
      />
      {/* <NotasFilters
        clientes={clientes}
        clienteFilter={clienteFilter}
        setClienteFilter={setClienteFilter}
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        handleResetFilter={handleResetFilter}
      /> */}
      <CustomTable
        columns={columns}
        data={notasData || []}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.idnotas}
      />
      <ModalComponent
        icon={
          editNotaData ? (
            <DriveFileRenameOutline color="success" />
          ) : (
            <PostAdd color="success" />
          )
        }
        open={openFormModal}
        content={
          <NotaForm
            initialData={editNotaData}
            onClose={handleCloseFormModal}
            onSaved={handleSaved}
          />
        }
        handleClose={handleCloseFormModal}
        title={editNotaData ? "Editar Nota" : "Registrar una Nota"}
        width="700px"
      />
    </Box>
  );
}
