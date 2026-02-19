"use client";
import React, { useState, useMemo, useCallback } from "react";
import CustomTable from "@/app/components/CustonTable";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getEstadoCuenta } from "@/app/services/estadoCuentaService";
import { getEgresosCliente } from "@/app/services/egresosClienteService";
import { pdfEstadoCuentaService, pdfEgresosClienteService } from "@/app/services/pdfServices";
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

const EstadoCuentaPage = () => {
  const [viewMode, setViewMode] = useState("INGRESOS"); // "INGRESOS" or "EGRESOS"
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [transacciones, setTransacciones] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleYearChange = useCallback((date) => {
    if (date) {
      setSelectedYear(date.getFullYear());
    }
  }, []);

  const handleModeChange = useCallback((event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
      // Clear previous results when changing mode
      setTransacciones([]);
      setTotalAmount(0);
      setHasSearched(false);
      setError(null);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!selectedClient) {
      setError("Por favor seleccione un cliente");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      let result;
      if (viewMode === "INGRESOS") {
        result = await getEstadoCuenta(
          selectedClient.idclienteprov,
          selectedYear
        );
        setTotalAmount(result.totalAnual || 0);
      } else {
        result = await getEgresosCliente(
          selectedClient.idclienteprov,
          selectedYear
        );
        setTotalAmount(result.totalEgresos || 0);
      }
      const transaccionesWithIndex = (result.transacciones || []).map((t, index) => ({
        ...t,
        nro: index + 1
      }));
      setTransacciones(transaccionesWithIndex);
    } catch (err) {
      console.error(`Error fetching ${viewMode.toLowerCase()}:`, err);
      setError(`Error al obtener los ${viewMode.toLowerCase()}. Por favor intente nuevamente.`);
      setTransacciones([]);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  }, [selectedClient, selectedYear, viewMode]);

  const handlePrint = useCallback(async () => {
    if (!selectedClient) {
      setError("Por favor seleccione un cliente");
      return;
    }

    try {
      setLoading(true);
      let pdfBlob;
      let filename;
      
      if (viewMode === "INGRESOS") {
        pdfBlob = await pdfEstadoCuentaService(
          selectedClient.idclienteprov,
          selectedYear
        );
        filename = `Estado-Cuenta-${selectedClient.idclienteprov}-${selectedYear}.pdf`;
      } else {
        pdfBlob = await pdfEgresosClienteService(
          selectedClient.idclienteprov,
          selectedYear
        );
        filename = `Egresos-Cliente-${selectedClient.idclienteprov}-${selectedYear}.pdf`;
      }
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
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
  }, [selectedClient, selectedYear, viewMode]);

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

  // Dynamic styles based on view mode
  const titleText = viewMode === "INGRESOS" ? "INGRESOS POR CLIENTE" : "EGRESOS POR CLIENTE";
  const totalLabel = viewMode === "INGRESOS" ? "Total Anual de Ingresos:" : "Total Anual de Egresos:";
  const cardBorderColor = viewMode === "INGRESOS" ? "primary.light" : "error.light";
  const totalColor = viewMode === "INGRESOS" ? "primary" : "error";

  const columns = useMemo(() => {
    const baseColumns = [
      { 
        field: "nro", 
        headerName: "Nro", 
        width: 70,
      },
      { 
        field: "fecha", 
        headerName: "Fecha", 
        width: 120,
        valueFormatter: (value) => formatDate(value)
      },
      { field: "tipo_pago", headerName: "Tipo de pago", width: 130 },
      { field: "id_cliente", headerName: "ID cliente", width: 120 },
      { field: "razon_social", headerName: "Razón Social", width: 200 },
      { field: "concepto", headerName: "Por Concepto", width: 200 },
      { field: "periodo", headerName: "Periodo", width: 100 },
      { field: "anio", headerName: "Año", width: 80 },
      { 
        field: "importe", 
        headerName: "Importe (S/.)", 
        width: 130,
        type: "number",
        align: "right",
        headerAlign: "right",
        valueGetter: (value, row) => {
           if (viewMode === "INGRESOS" && row.tipo === "SALIDA") return -value;
           return value;
        },
        valueFormatter: (value) => formatCurrency(Math.abs(value))
      },
      { field: "estado", headerName: "Estado", width: 120 },
      { field: "observacion", headerName: "Observacion", width: 200 },
      { field: "registra", headerName: "Registra", width: 120 },
      { field: "caja", headerName: "CAJA", width: 100 },
    ];

    if (viewMode === "EGRESOS") {
        baseColumns.splice(1, 0, { field: "id", headerName: "Egreso", width: 90 });
    }

    return baseColumns;
  }, [viewMode]);

  const getRowId = useCallback((row) => {
    return viewMode === "EGRESOS" ? row.id : `${row.tipo}-${row.id}`;
  }, [viewMode]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: "100vh" }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="700" color={viewMode === "INGRESOS" ? "primary.main" : "error.main"}>
            {titleText}
          </Typography>
          
          {/* Mode Selector */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleModeChange}
            aria-label="modo de vista"
            size="small"
          >
            <ToggleButton value="INGRESOS" aria-label="ingresos">
              <TrendingUpIcon sx={{ mr: 1 }} />
              Ingresos
            </ToggleButton>
            <ToggleButton value="EGRESOS" aria-label="egresos">
              <TrendingDownIcon sx={{ mr: 1 }} />
              Egresos
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

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
                  size="large"
                  label="Año"

                  // sx={{ height: "52px" }}
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              }
            />
          </Box>

          <Button
            variant="contained"
            color={viewMode === "INGRESOS" ? "primary" : "error"}
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
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
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
              color={viewMode === "INGRESOS" ? "primary" : "error"}
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={transacciones.length === 0}
            >
              IMPRIMIR
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress color={viewMode === "INGRESOS" ? "primary" : "error"} />
            </Box>
          ) : transacciones.length > 0 ? (
            <>
              <CustomTable
                columns={columns}
                data={transacciones}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                loading={loading}
                getRowId={getRowId}
                paginationMode="client"
              />

              {/* Total Anual */}
              <Card
                elevation={0}
                sx={{
                  mt: 3,
                  // bgcolor: cardBgColor,
                  border: (theme) => `1px solid ${theme.palette[cardBorderColor]}`,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold" color={`${totalColor}.dark`}>
                      {totalLabel}
                    </Typography>
                    <Typography variant="h5" fontWeight="800" color={`${totalColor}.main`}>
                      {formatCurrency(totalAmount)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </>
          ) : (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No se encontraron {viewMode.toLowerCase()} para el cliente seleccionado en el año {selectedYear}.
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default EstadoCuentaPage;
