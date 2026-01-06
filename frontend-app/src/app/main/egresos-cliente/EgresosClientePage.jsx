"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getEgresosCliente } from "@/app/services/egresosClienteService";
import { pdfEgresosClienteService } from "@/app/services/pdfServices";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import { getClientesProvs } from "@/app/services/clienteProvService";
import dayjs from "dayjs";

// Componente de autocompletado de cliente reutilizable
const ClienteAutocomplete = ({ value, onChange, sx }) => {
  const transformResponse = (response) => ({
    items: response.clientesProvs || [],
    total: response.pagination?.total || 0,
  });

  const fetchClients = async ({ page, pageSize, search }) => {
    return getClientesProvs(page, pageSize, search, 1);
  };

  return (
    <InfiniteSelect
      fetchData={fetchClients}
      transformResponse={transformResponse}
      getOptionLabel={(option) => option.razonsocial}
      getOptionValue={(option) => option.idclienteprov}
      label="Buscar Cliente"
      placeholder="Buscar cliente..."
      value={value}
      onChange={onChange}
      renderOption={(props, option) => (
        <li {...props} key={option.idclienteprov}>
          <div style={{ padding: "8px 0" }}>
            <div style={{ fontWeight: 500 }}>{option.razonsocial}</div>
            <div style={{ fontSize: "0.8em", opacity: 0.6 }}>
              RUC: {option.ruc || option.dni}
            </div>
          </div>
        </li>
      )}
      sx={sx || { minWidth: 280 }}
    />
  );
};

const EgresosClientePage = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [transacciones, setTransacciones] = useState([]);
  const [totalEgresos, setTotalEgresos] = useState(0);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleYearChange = (date) => {
    if (date) {
      setSelectedYear(date.getFullYear());
    }
  };

  const handleSearch = async () => {
    if (!selectedClient) {
      setError("Por favor seleccione un cliente");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await getEgresosCliente(
        selectedClient.idclienteprov,
        selectedYear
      );
      setTransacciones(result.transacciones || []);
      setTotalEgresos(result.totalEgresos || 0);
    } catch (err) {
      console.error("Error fetching egresos:", err);
      setError("Error al obtener los egresos. Por favor intente nuevamente.");
      setTransacciones([]);
      setTotalEgresos(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!selectedClient) {
      setError("Por favor seleccione un cliente");
      return;
    }

    try {
      setLoading(true);
      const pdfBlob = await pdfEgresosClienteService(
        selectedClient.idclienteprov,
        selectedYear
      );
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Egresos-Cliente-${selectedClient.idclienteprov}-${selectedYear}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      setError("Error al generar el PDF. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return dayjs(date).format("DD-MM-YYYY");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: "100vh" }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="700" color="primary.main" sx={{ mb: 3 }}>
          EGRESOS POR CLIENTE
        </Typography>

        {/* Search Filters */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
          <Box sx={{ flex: 1, minWidth: { xs: "100%", md: "400px" } }}>
            <ClienteAutocomplete
              value={selectedClient}
              onChange={setSelectedClient}
              sx={{ width: "100%" }}
            />
          </Box>

          <Box sx={{ minWidth: { xs: "100%", md: "150px" } }}>
            <DatePicker
              selected={new Date(selectedYear, 0, 1)}
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
              customInput={
                <TextField
                  fullWidth
                  size="small"
                  label="Año"
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              }
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading || !selectedClient}
            sx={{ minWidth: { xs: "100%", md: "150px" }, height: "40px" }}
          >
            Consultar
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Results Section */}
      {hasSearched && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight="600">
              Resultados para: {selectedYear}
            </Typography>
            <Button
              variant="contained"
              color="error"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={transacciones.length === 0}
            >
              IMPRIMIR
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : transacciones.length > 0 ? (
            <>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Nro
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Egreso
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Fecha
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Tipo de pago
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        ID cliente
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Razón Social
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Por Concepto
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Periodo
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Año
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}
                      >
                        Importe (S/.)
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Estado
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Observacion
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        Registra
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "error.main", color: "error.contrastText", fontWeight: "bold" }}>
                        CAJA
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transacciones.map((transaccion, index) => (
                      <TableRow
                        key={`egreso-${transaccion.id}`}
                        hover
                        sx={{
                          backgroundColor: "warning.lighter",
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{transaccion.id}</TableCell>
                        <TableCell>{formatDate(transaccion.fecha)}</TableCell>
                        <TableCell>{transaccion.tipo_pago || "-"}</TableCell>
                        <TableCell>{transaccion.id_cliente || "-"}</TableCell>
                        <TableCell>{transaccion.razon_social || "-"}</TableCell>
                        <TableCell>{transaccion.concepto || "-"}</TableCell>
                        <TableCell>{transaccion.periodo || "-"}</TableCell>
                        <TableCell>{transaccion.anio || "-"}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(transaccion.importe)}
                        </TableCell>
                        <TableCell>{transaccion.estado || "-"}</TableCell>
                        <TableCell>{transaccion.observacion || "-"}</TableCell>
                        <TableCell>{transaccion.registra || "-"}</TableCell>
                        <TableCell>{transaccion.caja || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Total Anual */}
              <Card
                elevation={0}
                sx={{
                  mt: 3,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'error.darker' : 'error.lighter',
                  border: (theme) => `1px solid ${theme.palette.error.light}`,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold" color="error.dark">
                      Total Anual de Egresos:
                    </Typography>
                    <Typography variant="h5" fontWeight="800" color="error.main">
                      {formatCurrency(totalEgresos)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </>
          ) : (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No se encontraron egresos para el cliente seleccionado en el año {selectedYear}.
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default EgresosClientePage;

