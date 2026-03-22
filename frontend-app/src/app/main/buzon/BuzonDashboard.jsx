import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Tooltip,
  IconButton,
  Chip,
  Switch,
  CircularProgress,
  Zoom,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Refresh, Mail, Add, Delete, CheckCircle, Launch } from "@mui/icons-material";
import SunatIcon from "@/app/components/SunatIcon";
import { 
  accessSunatTramites
  //  accessSunatDeclaracionesPagos 
  } from "@/app/services/sunServices";
import { openSunatOrSunafilInNewTab } from "@/app/services/sunatOpenInTab";
import CustomTable from "@/app/components/CustonTable";
import buzonServices from "@/app/services/buzonServices";
import { getClientesProvs } from "@/app/services/clienteProvService";
import ModalComponent from "@/app/components/ModalComponent";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import Swal from "sweetalert2";

const BuzonDashboard = () => {
  const [monitoredClients, setMonitoredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedClientToAdd, setSelectedClientToAdd] = useState(null);

  // Estados para el modal de mensajes
  const [openMessagesModal, setOpenMessagesModal] = useState(false);
  const [selectedClientMessages, setSelectedClientMessages] = useState([]);
  const [selectedClientName, setSelectedClientName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);

  // Progreso de verificación masiva (total, done, inProgress)
  const [verifyProgress, setVerifyProgress] = useState({ total: 0, done: 0, inProgress: false });
  const pollIntervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener clientes que ya están en monitoreo con sus mensajes
      const data = await buzonServices.getMonitoredClients();
      setMonitoredClients(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "No se pudo cargar la información de monitoreo", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkAsRead = async (idclienteprov, mensajeId) => {
    try {
        await buzonServices.markAsRead(mensajeId);
        const updatedMessages = selectedClientMessages.filter(m => m.mensajeId !== mensajeId);
        setSelectedClientMessages(updatedMessages);
        fetchData();
    } catch (error) {
        Swal.fire("Error", "No se pudo marcar como verificado", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!selectedClientId) return;
    
    const result = await Swal.fire({
      title: "¿Marcar todos como verificados?",
      text: "Se eliminarán todos los mensajes pendientes actuales para este cliente.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, todos",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await buzonServices.markAllAsRead(selectedClientId);
        setSelectedClientMessages([]);
        fetchData();
      } catch (error) {
        Swal.fire("Error", "No se pudo marcar todo como verificado", "error");
      }
    }
  };

  const handleOpenMessages = (client) => {
    setSelectedClientMessages(client.unreadMessages || []);
    setSelectedClientName(client.razonsocial);
    setSelectedClientId(client.idclienteprov);
    setOpenMessagesModal(true);
  };

  const handleAddClient = async () => {
    if (!selectedClientToAdd) return;
    try {
      await buzonServices.toggleMonitoring(selectedClientToAdd.idclienteprov, true);
      setOpenModal(false);
      setSelectedClientToAdd(null);
      fetchData();
      Swal.fire("Éxito", "Cliente añadido al monitoreo", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo añadir el cliente", "error");
    }
  };

  const handleRemoveClient = async (id) => {
    const result = await Swal.fire({
      title: "¿Quitar del monitoreo?",
      text: "Se detendrá la verificación diaria para este cliente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await buzonServices.toggleMonitoring(id, false);
        fetchData();
      } catch (error) {
        Swal.fire("Error", "No se pudo quitar el cliente", "error");
      }
    }
  };

  const handleVerifyAll = async () => {
    try {
      setRefreshing(true);
      setVerifyProgress({ total: 0, done: 0, inProgress: true });
      await buzonServices.verifyAll();
      Swal.fire("Iniciado", "La verificación masiva ha comenzado en segundo plano.", "info");

      const poll = async () => {
        try {
          const p = await buzonServices.getVerifyProgress();
          setVerifyProgress(p);
          if (p.inProgress) {
            pollIntervalRef.current = setTimeout(poll, 1500);
          } else {
            setRefreshing(false);
            fetchData();
          }
        } catch {
          pollIntervalRef.current = setTimeout(poll, 1500);
        }
      };
      poll();
    } catch (error) {
      Swal.fire("Error", "No se pudo iniciar la verificación", "error");
      setRefreshing(false);
      setVerifyProgress({ total: 0, done: 0, inProgress: false });
    }
  };

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearTimeout(pollIntervalRef.current);
    };
  }, []);

  const columns = [
    {
      field: "idclienteprov",
      headerName: "ID",
      width: 60,
    },
    {
      field: "razonsocial",
      headerName: "Cliente",
      flex: 1.5,
      renderCell: (params) => {
        const { razonsocial, unreadMessages } = params.row;
        const hasMessages = unreadMessages && unreadMessages.length > 0;

        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography 
                variant="body2" 
                sx={{ 
                    fontWeight: hasMessages ? 600 : 400, 
                    cursor: hasMessages ? 'pointer' : 'default',
                    color: hasMessages ? 'primary.main' : 'inherit',
                    textDecoration: hasMessages ? 'underline' : 'none'
                }}
                onClick={() => hasMessages && handleOpenMessages(params.row)}
            >
                {razonsocial}
            </Typography>
            {hasMessages && (
              <Chip 
                label={unreadMessages.length} 
                size="small" 
                color="error" 
                sx={{ height: 16, fontSize: 10 }} 
                onClick={() => handleOpenMessages(params.row)}
              />
            )}
          </Stack>
        );
      }
    },
    {
      field: "ruc",
      headerName: "RUC",
      width: 120,
    },
    {
      field: "ultima_revision",
      headerName: "Última Revisión",
      width: 180,
      renderCell: (params) => {
        const { ultima_revision } = params.row;
        return ultima_revision ? (
          <Typography variant="caption">
            {new Date(ultima_revision).toLocaleString()}
          </Typography>
        ) : (
          <Typography variant="caption" color="textSecondary">
            NUNCA
          </Typography>
        );
      }
    },
    {
      field: "status",
      headerName: "Estado",
      width: 150,
      renderCell: (params) => {
        const { cantidad_no_leidos, unreadMessages } = params.row;
        // Priorizar el campo calculado en el backend, o el length de la lista local
        const count = cantidad_no_leidos !== undefined ? cantidad_no_leidos : (unreadMessages?.length || 0);
        
        return count > 0 ? (
          <Chip 
            icon={<Mail />} 
            label={`${count} pendientes`} 
            color="error" 
            variant="outlined" 
            size="small" 
            onClick={() => handleOpenMessages(params.row)}
            sx={{ cursor: 'pointer' }}
          />
        ) : (
          <Chip label="Al día" color="success" variant="outlined" size="small" />
        );
      }
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Trámites SUNAT">
            <IconButton 
              size="small" 
              color="primary" 
              onClick={async () => {
                const data = {
                  ruc: params.row.ruc,
                  usuario: params.row.c_usuario,
                  password: params.row.c_passw
                };
                const res = await accessSunatTramites(data);
                if (res.url) openSunatOrSunafilInNewTab(res.url, "sunat");
              }}
            >
              <SunatIcon size={20} />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Declaraciones y Pagos">
            <IconButton 
              size="small" 
              color="secondary" 
              onClick={async () => {
                const data = {
                  ruc: params.row.ruc,
                  usuario: params.row.c_usuario,
                  password: params.row.c_passw
                };
                const res = await accessSunatDeclaracionesPagos(data);
                if (res.url) openSunatOrSunafilInNewTab(res.url, "sunat");
              }}
            >
              <SunatIcon size={20} />
            </IconButton>
          </Tooltip> */}
          <IconButton size="small" color="error" onClick={() => handleRemoveClient(params.row.idclienteprov)}>
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Monitoreo Buzón SOL
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión de clientes monitoreados y verificación de notificaciones
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<Add />}
            onClick={() => setOpenModal(true)}
            variant="outlined"
            color="primary"
          >
            Añadir Cliente
          </Button>
          <Button
            startIcon={refreshing ? <CircularProgress size={20} /> : <Mail />}
            onClick={handleVerifyAll}
            variant="contained"
            color="primary"
            disabled={refreshing || loading}
          >
            Verificar Todos
          </Button>
          <IconButton onClick={fetchData} disabled={loading}>
            <Refresh />
          </IconButton>
        </Stack>
      </Stack>

      {refreshing && (
        <Alert
          severity="info"
          icon={<CircularProgress size={20} />}
          sx={{ mb: 2 }}
        >
          <Stack spacing={1}>
            <Typography variant="body2" fontWeight={500}>
              {verifyProgress.total > 0
                ? `Verificando buzón: ${verifyProgress.done} de ${verifyProgress.total} clientes (faltan ${verifyProgress.total - verifyProgress.done})`
                : "Verificando buzón en segundo plano…"}
            </Typography>
            <LinearProgress
              color="primary"
              value={verifyProgress.total > 0 ? (verifyProgress.done / verifyProgress.total) * 100 : 0}
              variant={verifyProgress.total > 0 ? "determinate" : "indeterminate"}
            />
          </Stack>
        </Alert>
      )}

      <CustomTable
        columns={columns}
        data={monitoredClients}
        loading={loading || refreshing}
        getRowId={(row) => row.idclienteprov}
        paginationModel={{ page: 0, pageSize: 15 }}
        paginationMode="client"
      />

      <ModalComponent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        title="Añadir Cliente al Monitoreo"
        width="500px"
        icon={<Add />}
        content={
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2">
              Seleccione un cliente de la lista general para comenzar a monitorear su Buzón SOL de forma diaria.
            </Typography>
            <InfiniteSelect
              fetchData={async ({ page, pageSize, search }) => getClientesProvs(page, pageSize, search, 1)}
              transformResponse={(res) => ({
                items: res.clientesProvs || [],
                total: res.pagination?.total || 0,
              })}
              getOptionLabel={(option) => option.razonsocial}
              getOptionValue={(option) => option.idclienteprov}
              label="Buscar Cliente"
              onChange={setSelectedClientToAdd}
              renderOption={(props, option) => (
                <li {...props} key={option.idclienteprov}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{option.razonsocial}</Typography>
                    <Typography variant="caption" color="textSecondary">RUC: {option.ruc}</Typography>
                  </Box>
                </li>
              )}
            />
            <Stack direction="row" spacing={2} justifyContent="end">
              <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
              <Button 
                variant="contained" 
                onClick={handleAddClient}
                disabled={!selectedClientToAdd}
              >
                Confirmar
              </Button>
            </Stack>
          </Stack>
        }
      />

      <ModalComponent
        open={openMessagesModal}
        handleClose={() => setOpenMessagesModal(false)}
        title={`Mensajes Pendientes - ${selectedClientName}`}
        width="800px"
        icon={<Mail />}
        content={
          <Stack spacing={3} sx={{ mt: 1 }}>
            {selectedClientMessages.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 48, color: 'success.light', mb: 2, opacity: 0.5 }} />
                <Typography variant="body1" color="textSecondary">
                  No hay mensajes pendientes para este cliente.
                </Typography>
              </Box>
            ) : (
              <>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" color="textSecondary">
                        Se muestran {selectedClientMessages.length} mensajes sin verificar.
                    </Typography>
                    <Button 
                        size="small" 
                        variant="outlined" 
                        color="success" 
                        startIcon={<CheckCircle />}
                        onClick={handleMarkAllAsRead}
                    >
                        Verificar Todos
                    </Button>
                </Stack>
                
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400, borderRadius: 2 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Asunto</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }} width={180}>Fecha / Etiqueta</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }} align="center" width={100}>Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedClientMessages.map((msg) => (
                        <TableRow key={msg.mensajeId} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {msg.asunto}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                                <Typography variant="caption" sx={{ display: 'block' }}>
                                    {new Date(msg.fecha).toLocaleString()}
                                </Typography>
                                {msg.tag && (
                                    <Chip 
                                        label={msg.tag} 
                                        size="extra-small" 
                                        variant="filled" 
                                        sx={{ height: 16, fontSize: '9px', alignSelf: 'start', borderRadius: 1 }} 
                                    />
                                )}
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Marcar como verificado">
                              <IconButton 
                                  size="small"
                                  color="success"
                                  onClick={() => handleMarkAsRead(null, msg.mensajeId)}
                                  sx={{ '&:hover': { bgcolor: 'success.light', color: 'white' } }}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            <Stack direction="row" justifyContent="end">
              <Button onClick={() => setOpenMessagesModal(false)} variant="contained" color="inherit">
                Cerrar
              </Button>
            </Stack>
          </Stack>
        }
      />
    </Box>
  );
};

export default BuzonDashboard;
