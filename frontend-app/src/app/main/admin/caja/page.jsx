
"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Chip
} from "@mui/material";
import dayjs from "dayjs";
import { PostAdd, Edit, DeleteOutline, AccountBalance, Domain, LockClock } from "@mui/icons-material";
import CustomTable from "@/app/components/CustonTable";
import ModalComponent from "@/app/components/ModalComponent";
import { getCajasAnuales, deleteCajaAnual, closeCajaAnual } from "@/app/services/cajaAnualServices";
import { getCajasMes, deleteCajaMes, closeCajaMes } from "@/app/services/cajaMesServices";
import CajaAnualForm from "./CajaAnualForm";
import CajaMesForm from "./CajaMesForm";
import Swal from "sweetalert2";

const CajaPage = () => {
  // Annual Stae
  const [dataAnual, setDataAnual] = useState([]);
  const [loadingAnual, setLoadingAnual] = useState(false);
  const [pageAnual, setPageAnual] = useState({ page: 0, pageSize: 5 });
  const [totalAnual, setTotalAnual] = useState(0);

  // Month State
  const [dataMes, setDataMes] = useState([]);
  const [loadingMes, setLoadingMes] = useState(false);
  const [pageMes, setPageMes] = useState({ page: 0, pageSize: 12 });
  const [totalMes, setTotalMes] = useState(0);

  // Modals
  const [openAnualModal, setOpenAnualModal] = useState(false);
  const [dataAnualEdit, setDataAnualEdit] = useState(null);

  const [openMesModal, setOpenMesModal] = useState(false);
  const [dataMesEdit, setDataMesEdit] = useState(null);

  const fetchAnual = useCallback(async () => {
    setLoadingAnual(true);
    try {
      const res = await getCajasAnuales(pageAnual.page + 1, pageAnual.pageSize);
      if(res?.cajasAnuales) {
          setDataAnual(res.cajasAnuales);
          setTotalAnual(res.pagination?.total || 0);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingAnual(false); }
  }, [pageAnual]);

  const fetchMes = useCallback(async () => {
    setLoadingMes(true);
    try {
      const res = await getCajasMes(pageMes.page + 1, pageMes.pageSize);
      if(res?.cajasMensuales) {
          setDataMes(res.cajasMensuales);
          setTotalMes(res.pagination?.total || 0);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingMes(false); }
  }, [pageMes]);

  useEffect(() => { fetchAnual(); }, [fetchAnual]);
  useEffect(() => { fetchMes(); }, [fetchMes]);

  const handleCloseAnual = async (row) => {
      const result = await Swal.fire({
          title: '¿Está seguro?',
          text: `¿Desea CERRAR la caja anual ${row.codcaja_a}? Esto calculará el saldo final y no se podrá deshacer.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, cerrar',
          cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
          try {
              await closeCajaAnual(row.codcaja_a);
              fetchAnual();
              Swal.fire('¡Cerrada!', 'La caja anual ha sido cerrada con éxito.', 'success');
          } catch (e) { 
              console.error(e); 
              Swal.fire('Error', 'Hubo un problema al cerrar la caja.', 'error');
          }
      }
  };

  const handleCloseMes = async (row) => {
      const result = await Swal.fire({
          title: '¿Está seguro?',
          text: `¿Desea CERRAR la caja mensual ${row.codcaja_m}? Esto calculará el saldo final.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, cerrar',
          cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
          try {
              await closeCajaMes(row.codcaja_m);
              fetchMes();
              Swal.fire('¡Cerrada!', 'La caja mensual ha sido cerrada con éxito.', 'success');
          } catch (e) { 
              console.error(e); 
              Swal.fire('Error', 'Hubo un problema al cerrar la caja.', 'error');
          }
      }
  };

  const colsAnual = [
    { field: "codcaja_a", headerName: "Caja Anual", width: 120 },
    { field: "fecha_apertura", headerName: "F. Apertura", width: 110, valueFormatter: (value) => value ? dayjs(value).format("DD/MM/YYYY") : "-" },
    { field: "monto_inicial_a", headerName: "M. Inicial", width: 110, type: "number" },
    { field: "ingreso_a", headerName: "Ingresos", width: 110, type: "number" },
    { field: "salida_a", headerName: "Egresos", width: 110, type: "number" },
    { field: "saldo_a", headerName: "Saldo Final", width: 110, type: "number" },
    { field: "fechacierre", headerName: "F. Cierre", width: 110, valueFormatter: (value) => value ? dayjs(value).format("DD/MM/YYYY") : "-" },
    { field: "registra", headerName: "User", width: 90 },
    { field: "estado_c_a", headerName: "Estado", width: 110, renderCell: (p) => {
        const isOpen = p.value === "1" || p.value === "ABIERTO";
        return <Chip label={isOpen ? "Abierta" : "Cerrada"} color={isOpen ? "success" : "default"} size="small" />;
    }},
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      renderCell: (params) => {
        const isOpen = params.row.estado_c_a === "1" || params.row.estado_c_a === "ABIERTO";
        return (
        <Stack direction="row">
             {isOpen && (
                <Tooltip title="Cerrar Caja">
                    <IconButton onClick={() => handleCloseAnual(params.row)} color="warning">
                        <LockClock fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            <Tooltip title="Editar">
                <IconButton onClick={() => { setDataAnualEdit(params.row); setOpenAnualModal(true); }}>
                <Edit fontSize="small" />
                </IconButton>
            </Tooltip>
        </Stack>
      )}
    }
  ];

  const colsMes = [
    { field: "codcaja_m", headerName: "Caja Mensual", width: 120 },
    { field: "fecha_apertura", headerName: "F. Apertura", width: 110, valueFormatter: (value) => value ? dayjs(value).format("DD/MM/YYYY") : "-" },
    { field: "monto_inicial_m", headerName: "M. Inicial", width: 110, type: "number" },
    { field: "ingreso_mes", headerName: "Ingresos", width: 110, type: "number" },
    { field: "salida_mes", headerName: "Egresos", width: 110, type: "number" },
    { field: "saldo_mes", headerName: "Saldo Final", width: 110, type: "number" },
    { field: "fechacierre", headerName: "F. Cierre", width: 110, valueFormatter: (value) => value ? dayjs(value).format("DD/MM/YYYY") : "-" },
    { field: "codcaja_a", headerName: "C. Anual", width: 100 },
    { field: "registra", headerName: "User", width: 90 },
    { field: "estado_c_m", headerName: "Estado", width: 110, renderCell: (p) => {
        const isOpen = p.value === "1" || p.value === "ABIERTO";
        return <Chip label={isOpen ? "Abierta" : "Cerrada"} color={isOpen ? "success" : "default"} size="small" />;
    }},
      {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      renderCell: (params) => {
        const isOpen = params.row.estado_c_m === "1" || params.row.estado_c_m === "ABIERTO";
        return (
        <Stack direction="row">
            {isOpen && (
                <Tooltip title="Cerrar Caja">
                    <IconButton onClick={() => handleCloseMes(params.row)} color="warning">
                        <LockClock fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            <Tooltip title="Editar">
                <IconButton onClick={() => { setDataMesEdit(params.row); setOpenMesModal(true); }}>
                <Edit fontSize="small" />
                </IconButton>
            </Tooltip>
        </Stack>
      )}
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Annual Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={1} alignItems="center">
            <Domain color="primary" />
            <Typography variant="h5">Cajas Anuales</Typography>
        </Stack>
        <Button variant="contained" startIcon={<PostAdd />} onClick={() => { setDataAnualEdit(null); setOpenAnualModal(true); }}>
            Nueva Caja Anual
        </Button>
      </Stack>
      <Paper sx={{ mb: 4, p: 1 }}>
        <CustomTable
            columns={colsAnual}
            data={dataAnual}
            paginationModel={pageAnual}
            setPaginationModel={setPageAnual}
            rowCount={totalAnual}
            loading={loadingAnual}
            getRowId={(row) => row.codcaja_a}
            height={300}
        />
      </Paper>

      {/* Monthly Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={1} alignItems="center">
            <AccountBalance color="secondary" />
            <Typography variant="h5">Cajas Mensuales</Typography>
        </Stack>
         <Button variant="contained" color="secondary" startIcon={<PostAdd />} onClick={() => { setDataMesEdit(null); setOpenMesModal(true); }}>
            Nueva Caja Mensual
        </Button>
      </Stack>
      <Paper sx={{ mb: 2, p: 1 }}>
        <CustomTable
            columns={colsMes}
            data={dataMes}
            paginationModel={pageMes}
            setPaginationModel={setPageMes}
            rowCount={totalMes}
            loading={loadingMes}
            getRowId={(row) => row.codcaja_m}
            height={400}
        />
      </Paper>

      {/* Modals */}
      <ModalComponent
        open={openAnualModal}
        handleClose={() => setOpenAnualModal(false)}
        title={dataAnualEdit ? "Editar Caja Anual" : "Nueva Caja Anual"}
        width="400px"
        content={<CajaAnualForm handleCloseModal={() => setOpenAnualModal(false)} dataToEdit={dataAnualEdit} refreshData={fetchAnual} />}
      />
      <ModalComponent
        open={openMesModal}
        handleClose={() => setOpenMesModal(false)}
        title={dataMesEdit ? "Editar Caja Mensual" : "Nueva Caja Mensual"}
        width="400px"
        content={<CajaMesForm handleCloseModal={() => setOpenMesModal(false)} dataToEdit={dataMesEdit} refreshData={fetchMes} defaultAnio={dataAnual[0]?.codcaja_a} />}
      />

    </Box>
  );
};

export default CajaPage;
