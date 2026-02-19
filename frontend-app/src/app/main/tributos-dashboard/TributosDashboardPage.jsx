import { Grid, Typography, useTheme, TextField, Stack, FormControl, InputLabel } from "@mui/material";
import AuthGuard from "../menu/AuthGuard";
import AnalyticEcommerce from "@/app/ui-components/cards/statistics/AnalyticEcommerce";
import MainCard from "@/app/ui-components/MainCard";
import { useEffect, useState } from "react";
import { getDashboardTributosKPIs, getDashboardTributosGraficos } from "@/app/services/dashboardService";
import AreaChart from "@/app/components/dashboard/AreaChart";
import CircleChart from "../clients-dashboard/CircleChart"; 
import { Box } from "@mui/system";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MonthPicker from "../caja-dashboard/MonthPicker";
import dayjs from "dayjs";

const TributosDashboardPage = () => {
  const theme = useTheme();

  // Filters State
  const [selectedAnio, setSelectedAnio] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1); // Current month (1-based)
  
  // States for KPIs
  const [kpis, setKpis] = useState({
    totalTributos: 0,
    totalImporteReg: 0,
    totalImportePag: 0,
    totalImportePend: 0,
    promedioPago: 0,
    porcentajePagado: 0,
    porcentajePendiente: 0,
    estados: {}
  });

  // States for Charts
  const [chartData, setChartData] = useState({
    monthlySeries: [],
    monthlyCategories: [],
    byTypeSeries: [],
    byTypeCategories: [],
    byStatusSeries: [],
    byStatusLabels: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filters = {
          anio: selectedAnio,
          mes: selectedMonth || undefined
        };

        // Fetch KPIs
        const kpiData = await getDashboardTributosKPIs(filters);
        setKpis(kpiData);

        // Fetch Graphics
        const graficosData = await getDashboardTributosGraficos(filters);
        
        // Process Monthly Evolution (Chart 1 - Area)
        const monthlyCategories = graficosData.graficoMensual?.map(item => item.mes) || [];
        const monthlySeries = [
          { name: 'Registrado', data: graficosData.graficoMensual?.map(item => item.registrado) || [] },
          { name: 'Pagado', data: graficosData.graficoMensual?.map(item => item.pagado) || [] },
          { name: 'Pendiente', data: graficosData.graficoMensual?.map(item => item.pendiente) || [] }
        ];

        // Process By Type (Chart 2 - Bar)
        const byTypeCategories = graficosData.graficoPorTipo?.map(item => item.tipo) || [];
        const byTypeSeries = [{
            name: 'Total Pagado',
            data: graficosData.graficoPorTipo?.map(item => item.total) || []
        }];

        // Process By Status (Chart 3 - Circle)
        const byStatusLabels = graficosData.graficoPorEstado?.map(item => {
             // Map status codes to names if needed, backend sends names?
             // Assuming backend sends codes or short names, we might want to map 0->Pend, 1->Pag, etc
             const statusMap = { '0': 'Pendiente', '1': 'Pagado', 'A': 'Anulado' };
             return statusMap[item.estado] || item.estado;
        }) || [];
        const byStatusSeries = graficosData.graficoPorEstado?.map(item => item.cantidad) || [];


        setChartData({
            monthlySeries,
            monthlyCategories,
            byTypeSeries,
            byTypeCategories,
            byStatusSeries,
            byStatusLabels
        });

      } catch (error) {
        console.error("Error loading tributos dashboard:", error);
      }
    };

    fetchData();
  }, [selectedAnio, selectedMonth]);

  const handleYearChange = (date) => {
    const year = date.getFullYear();
    setSelectedAnio(year);
  };

  const renderYearContent = (year, date) => (
    <span
      style={{ color: year === new Date().getFullYear() ? "red" : "inherit" }}
    >
      {year}
    </span>
  );

  return (
    <AuthGuard ids={[1, 6]}>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{
              width: "100%",
              border: '1px solid',
              borderColor: 'divider',
              padding: 1.5,
              borderRadius: 3,
              backgroundColor: 'transparent',
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Dashboard - Tributos
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="medium" sx={{ width: 150 }}>
                  <DatePicker
                  selected={selectedAnio ? new Date(selectedAnio, 0, 1) : null}
                  onChange={handleYearChange}
                  showYearPicker
                  dateFormat="yyyy"
                  renderYearContent={renderYearContent}
                  customInput={
                      <TextField
                      label="Año"
                      value={selectedAnio || ""}
                      InputProps={{ readOnly: true }}
                      size="small"
                      />
                  }
                  />
              </FormControl>
              <FormControl fullWidth size="small" sx={{ width: 200 }}>
                  <MonthPicker
                  value={selectedMonth}
                  onChange={(value) => setSelectedMonth(value)}
                  />
              </FormControl>
            </Stack>
          </Stack>
        </Grid>

        {/* KPIs Row 1 */}
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticEcommerce
            title="Total Tributos"
            count={kpis.totalTributos || 0}
            extra="Registros totales"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticEcommerce
            title="Imp. Determinado"
            count={`S/ ${kpis.totalImporteReg?.toLocaleString()}`}
            // percentage={100}
            extra="Total declarado"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticEcommerce
            title="Imp. Pagado"
            count={`S/ ${kpis.totalImportePag?.toLocaleString()}`}
            percentage={kpis.porcentajePagado}
            extra="Del total declarado"
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticEcommerce
            title="Imp. Pendiente"
            count={`S/ ${kpis.totalImportePend?.toLocaleString()}`}
            percentage={kpis.porcentajePendiente}
            isLoss
            extra="Por regularizar"
            color="error"
          />
        </Grid>

        {/* Charts Row */}
        
        {/* Monthly Evolution */}
        <Grid item xs={12} md={8}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Evolución Mensual</Typography>
            </Grid>
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <AreaChart 
                seriesData={chartData.monthlySeries}
                categories={chartData.monthlyCategories}
                colors={[theme.palette.info.main, theme.palette.success.main, theme.palette.error.main]}
                type="area"
                height={350}
            />
          </MainCard>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Estado de Tributos</Typography>
            </Grid>
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <Box sx={{ p: 3, pb: 0 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" color="text.secondary">
                    Distribución
                  </Typography>
                  <Typography variant="h4" fontWeight={100}>
                    Total: {kpis.totalTributos}
                  </Typography>
                </Stack>
            </Box>
            <CircleChart 
                series={chartData.byStatusSeries}
                labels={chartData.byStatusLabels}
                // colors can be auto or passed explicitly if needed
            />
          </MainCard>
        </Grid>


        <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                <Typography variant="h5">Pagos por Tipo de Tributo</Typography>
                </Grid>
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
                <AreaChart 
                    seriesData={chartData.byTypeSeries}
                    categories={chartData.byTypeCategories}
                    type="bar"
                    height={300}
                    horizontalLineAtZero
                    colors={[theme.palette.primary.main]}
                />
            </MainCard>
        </Grid>

      </Grid>
    </AuthGuard>
  );
};

export default TributosDashboardPage;
