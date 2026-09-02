"use client";
import React, { useState, useMemo, useCallback } from "react";
import CustomTable from "@/app/components/CustonTable";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import YearPickerField from "@/app/components/YearPickerField";
import { getEstadoCuenta } from "@/app/services/estadoCuentaService";
import { getEgresosCliente } from "@/app/services/egresosClienteService";
import { pdfEstadoCuentaService, pdfEgresosClienteService } from "@/app/services/pdfServices";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import { getClientesProvs } from "@/app/services/clienteProvService";
import dayjs from "dayjs";
import PageLayout from "@/app/ui-components/layout/PageLayout";
import MainCard from "@/app/ui-components/MainCard";
import FilterToolbar, { FilterField } from "@/app/ui-components/layout/FilterToolbar";
import { FILTER_LAYOUT, VIEW_LAYOUT } from "@/app/ui-components/layout/layoutConstants";

const ClienteAutocomplete = ({ value, onChange }) => {
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
      sx={{ width: "100%" }}
    />
  );
};

const EstadoCuentaPage = () => {
  const [viewMode, setViewMode] = useState("INGRESOS");
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

  const isIngresos = viewMode === "INGRESOS";
  const accentColor = isIngresos ? "primary" : "error";

  const handleYearChange = useCallback((date) => {
    if (date) {
      setSelectedYear(date.getFullYear());
    }
  }, []);

  const handleModeChange = useCallback((event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
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
      if (isIngresos) {
        result = await getEstadoCuenta(
          selectedClient.idclienteprov,
          selectedYear,
          "INGRESO"
        );
        setTotalAmount(result.totalIngresos ?? result.totalAnual ?? 0);
      } else {
        result = await getEgresosCliente(
          selectedClient.idclienteprov,
          selectedYear
        );
        setTotalAmount(result.totalEgresos || 0);
      }
      const transaccionesWithIndex = (result.transacciones || []).map((t, index) => ({
        ...t,
        nro: index + 1,
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
  }, [selectedClient, selectedYear, viewMode, isIngresos]);

  const handlePrint = useCallback(async () => {
    if (!selectedClient) {
      setError("Por favor seleccione un cliente");
      return;
    }

    try {
      setLoading(true);
      let pdfBlob;
      let filename;

      if (isIngresos) {
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
  }, [selectedClient, selectedYear, isIngresos]);

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

  const totalLabel = isIngresos ? "Total Anual de Ingresos:" : "Total Anual de Egresos:";

  const columns = useMemo(() => {
    const baseColumns = [
      { field: "nro", headerName: "Nro", width: 70 },
      {
        field: "fecha",
        headerName: "Fecha",
        width: 120,
        valueFormatter: (value) => formatDate(value),
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
        valueFormatter: (value) => formatCurrency(value),
      },
      { field: "estado", headerName: "Estado", width: 120 },
      { field: "observacion", headerName: "Observacion", width: 200 },
      { field: "registra", headerName: "Registra", width: 120 },
      { field: "caja", headerName: "CAJA", width: 100 },
    ];

    if (!isIngresos) {
      baseColumns.splice(1, 0, { field: "id", headerName: "Egreso", width: 90 });
    }

    return baseColumns;
  }, [isIngresos]);

  const getRowId = useCallback(
    (row) => (isIngresos ? `${row.tipo}-${row.id}` : row.id),
    [isIngresos]
  );

  return (
    <PageLayout
      title={isIngresos ? "Ingresos por cliente" : "Egresos por cliente"}
      subtitle="Consulta de cuenta corriente por cliente y año"
      action={
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleModeChange}
          aria-label="modo de vista"
          size="small"
          sx={{
            width: { xs: "100%", sm: "auto" },
            display: "flex",
            "& .MuiToggleButton-root": {
              flex: { xs: 1, sm: "none" },
              py: 0.75,
            },
          }}
        >
          <ToggleButton value="INGRESOS" aria-label="ingresos">
            <TrendingUpIcon sx={{ mr: 0.75, fontSize: 20 }} />
            Ingresos
          </ToggleButton>
          <ToggleButton value="EGRESOS" aria-label="egresos">
            <TrendingDownIcon sx={{ mr: 0.75, fontSize: 20 }} />
            Egresos
          </ToggleButton>
        </ToggleButtonGroup>
      }
    >
      <MainCard contentSX={FILTER_LAYOUT.cardContent}>
        <FilterToolbar>
          <FilterField grow>
            <ClienteAutocomplete value={selectedClient} onChange={setSelectedClient} />
          </FilterField>
          <FilterField>
            <YearPickerField
              selected={selectedYear}
              onChange={handleYearChange}
            />
          </FilterField>
          <FilterField>
            <Button
              fullWidth
              variant="contained"
              color={accentColor}
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading || !selectedClient}
            >
              Consultar
            </Button>
          </FilterField>
        </FilterToolbar>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </MainCard>

      {hasSearched && (
        <MainCard
          contentSX={FILTER_LAYOUT.cardContent}
          sx={{ mt: VIEW_LAYOUT.sectionGap }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Resultados — {selectedYear}
            </Typography>
            <Button
              variant="contained"
              color={accentColor}
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={transacciones.length === 0 || loading}
              sx={{ width: { xs: "100%", sm: "auto" }, flexShrink: 0 }}
            >
              Imprimir
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress color={accentColor} />
            </Box>
          ) : transacciones.length > 0 ? (
            <>
              <Box sx={{ minHeight: VIEW_LAYOUT.tableMinHeight, width: "100%", minWidth: 0 }}>
                <CustomTable
                  columns={columns}
                  data={transacciones}
                  paginationModel={paginationModel}
                  setPaginationModel={setPaginationModel}
                  loading={loading}
                  getRowId={getRowId}
                  paginationMode="client"
                />
              </Box>

              <Card
                elevation={0}
                sx={{
                  mt: VIEW_LAYOUT.sectionGap,
                  border: 1,
                  borderColor: `${accentColor}.light`,
                  borderRadius: 1.5,
                }}
              >
                <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                  >
                    <Typography variant="subtitle1" fontWeight={700} color={`${accentColor}.dark`}>
                      {totalLabel}
                    </Typography>
                    <Typography variant="h6" fontWeight={800} color={`${accentColor}.main`}>
                      {formatCurrency(totalAmount)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="body1" color="text.secondary">
                No se encontraron {viewMode.toLowerCase()} para el cliente seleccionado en el año{" "}
                {selectedYear}.
              </Typography>
            </Box>
          )}
        </MainCard>
      )}
    </PageLayout>
  );
};

export default EstadoCuentaPage;
