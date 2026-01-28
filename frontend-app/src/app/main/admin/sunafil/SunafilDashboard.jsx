import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Tooltip,
  IconButton,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Refresh, Notifications, Add, Delete, CheckCircle } from "@mui/icons-material";
import CustomTable from "@/app/components/CustonTable";
import sunafilServices from "@/app/services/sunafilServices";
import { getClientesProvs } from "@/app/services/clienteProvService";
import ModalComponent from "@/app/components/ModalComponent";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import Swal from "sweetalert2";

const SunafilDashboard = () => {
  const [monitoredClients, setMonitoredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedClientToAdd, setSelectedClientToAdd] = useState(null);

  // Estados para el modal de mensajes/alertas
  const [openMessagesModal, setOpenMessagesModal] = useState(false);
  const [selectedClientMessages, setSelectedClientMessages] = useState([]);
  const [selectedClientName, setSelectedClientName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sunafilServices.getMonitoredClients();
      setMonitoredClients(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "No se pudo cargar la información de monitoreo SUNAFIL", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkAsRead = async (idclienteprov, mensajeId) => {
    try {
        await sunafilServices.markAsRead(mensajeId);
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
      title: "¿Marcar todas como verificadas?",
      text: "Se eliminarán todas las alertas pendientes actuales para este cliente.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, todas",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await sunafilServices.markAllAsRead(selectedClientId);
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
      await sunafilServices.toggleMonitoring(selectedClientToAdd.idclienteprov, true);
      setOpenModal(false);
      setSelectedClientToAdd(null);
      fetchData();
      Swal.fire("Éxito", "Cliente añadido al monitoreo SUNAFIL", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo añadir el cliente", "error");
    }
  };

  const handleRemoveClient = async (id) => {
    const result = await Swal.fire({
      title: "¿Quitar del monitoreo?",
      text: "Se detendrá la verificación para este cliente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await sunafilServices.toggleMonitoring(id, false);
        fetchData();
      } catch (error) {
        Swal.fire("Error", "No se pudo quitar el cliente", "error");
      }
    }
  };

  const handleVerifyAll = async () => {
    try {
      setRefreshing(true);
      await sunafilServices.verifyAll();
      Swal.fire("Iniciado", "La verificación masiva SUNAFIL ha comenzado.", "info");
    } catch (error) {
      Swal.fire("Error", "No se pudo iniciar la verificación", "error");
    } finally {
      setRefreshing(false);
    }
  };

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
        const hasItems = unreadMessages && unreadMessages.length > 0;
        const count = cantidad_no_leidos !== undefined ? cantidad_no_leidos : 0;
        
        if (count > 0) {
          return (
            <Chip 
              icon={<Notifications />} 
              label={`${count} alertas`} 
              color="error" 
              variant="outlined" 
              size="small" 
              onClick={() => handleOpenMessages(params.row)}
              sx={{ cursor: 'pointer' }}
            />
          );
        } else {
          return <Chip label="Al día" color="success" variant="outlined" size="small" />;
        }
      }
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      align: "center",
      renderCell: (params) => (
        <IconButton size="small" color="error" onClick={() => handleRemoveClient(params.row.idclienteprov)}>
          <Delete fontSize="small" />
        </IconButton>
      )
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="100">
            Monitoreo SUNAFIL
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Gestión de clientes monitoreados y verificación de alertas de Sunafil
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
            startIcon={refreshing ? <CircularProgress size={20} /> : <Notifications />}
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

      <CustomTable
        columns={columns}
        data={monitoredClients}
        loading={loading}
        getRowId={(row) => row.idclienteprov}
        paginationModel={{ page: 0, pageSize: 15 }}
        paginationMode="client"
      />

      <ModalComponent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        title="Añadir Cliente al Monitoreo SUNAFIL"
        width="500px"
        icon={<Add />}
        content={
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2">
              Seleccione un cliente para comenzar a monitorear sus alertas de Sunafil.
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
        title={`Alertas Pendientes - ${selectedClientName}`}
        width="800px"
        icon={<Notifications />}
        content={
          <Stack spacing={3} sx={{ mt: 1 }}>
            {selectedClientMessages.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 48, color: 'success.light', mb: 2, opacity: 0.5 }} />
                <Typography variant="body1" color="textSecondary">
                  No hay alertas pendientes para este cliente.
                </Typography>
              </Box>
            ) : (
              <>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" color="textSecondary">
                        Se muestran {selectedClientMessages.length} alertas sin verificar.
                    </Typography>
                    <Button 
                        size="small" 
                        variant="outlined" 
                        color="success" 
                        startIcon={<CheckCircle />}
                        onClick={handleMarkAllAsRead}
                    >
                        Verificar Todas
                    </Button>
                </Stack>
                
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400, borderRadius: 2 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Descripción</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }} align="center" width={100}>Cantidad</TableCell>
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
                          <TableCell align="center">
                            <Chip 
                                label={msg.tag || "0"} 
                                size="small" 
                                color={parseInt(msg.tag) > 0 ? "error" : "default"}
                                variant="filled" 
                                sx={{ fontWeight: 'bold' }}
                            />
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

export default SunafilDashboard;
