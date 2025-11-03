import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import AuthGuard from "../menu/AuthGuard";
import AnalyticEcommerce from "@/app/ui-components/cards/statistics/AnalyticEcommerce";
import MainCard from "@/app/ui-components/MainCard";
import MonthlyBarChart from "../dashboard/MonthlyBarChart";
import UniqueVisitorCard from "./UniqueVisitorCard";
import { useEffect, useState } from "react";
import {
  getDashboardClientesGraficos,
  getDashboardClientesKPIs,
} from "@/app/services/dashboardService";
import CircleChart from "./CircleChart";
import IncomeAreaChart from "./IncomeAreaChart";

const ClientsDashboardPage = () => {
  const theme = useTheme();
  const { info } = theme.palette;
  const [totalClients, setTotalClients] = useState(0);
  const [activeClients, setActiveClients] = useState(0);
  const [suspendClients, setSuspendClients] = useState(0);
  const [tempDownClients, setTempDownClients] = useState(0);
  const [defDownClients, setDefDownClients] = useState(0);
  const [newClients, setNewClients] = useState(0);
  const [planillaClients, setPlanillaClients] = useState(0);
  const [inactivityClients, setInactivityClients] = useState(0);

  const [graficosDataRegimen, setGraficosDataRegimen] = useState({
    seriesData: [],
    categories: [],
  });
  const [graficosDataMes, setGraficosDataMes] = useState({
    seriesData: [],
    categories: [],
  });

  // Función para soportar paths anidados tipo "_count.idclienteprov"
  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? 0;
  }

  function transformChartData(data, countKey, seriesName = "Datos", labelKey) {
    if (!Array.isArray(data)) return { seriesData: [], categories: [] };

    const categories = data.map((item) => item?.[labelKey] || "Sin nombre");
    const seriesData = [
      {
        name: seriesName,
        data: data.map((item) => getNestedValue(item, countKey)),
      },
    ];

    return { seriesData, categories };
  }

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const response = await getDashboardClientesKPIs();
        setTotalClients(response.totalClientes ?? 0);
        setActiveClients(response.clientesActivos ?? 0);
        setSuspendClients(response.clientesSuspendidos ?? 0);
        setTempDownClients(response.clientesBajaTemp ?? 0);
        setDefDownClients(response.clientesBajaDef ?? 0);
        setNewClients(response.clientesNuevosAnio ?? 0);
        setPlanillaClients(response.clientesPlanillaElect ?? 0);
        setInactivityClients(response.clientesSinActividad ?? 0);

        const graficos = await getDashboardClientesGraficos();

        const regData = transformChartData(
          graficos.clientesPorRegimen,
          "_count.idclienteprov", // path anidado
          "Clientes",
          "nregimen" // coincide con la API
        );
        setGraficosDataRegimen(regData);

        const mesData = transformChartData(
          graficos.clientesPorMes,
          "total",
          "Clientes",
          "mes"
        );
        setGraficosDataMes(mesData);
      } catch (error) {
        console.error("Error fetching clients data:", error);
      }
    };

    fetchClientsData();
  }, []);

  return (
    <>
      <AuthGuard allowedRoles={[1]}>
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          {/* row 1 */}
          <Grid item xs={12} sx={{ mb: -2.25 }}>
            <Typography variant="h5" fontWeight={600}>
              Dashboard - Información de Clientes
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <AnalyticEcommerce
              title="Total"
              count={totalClients}
              percentage={"100"}
              extra="Clientes registrados en el sistema"
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <AnalyticEcommerce
              title="Nuevos Clientes"
              count={newClients.total}
              percentage={newClients.porcentaje}
              extra="Clientes registrados este año"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <AnalyticEcommerce
              title="Con Planilla Electrónica"
              count={planillaClients.total}
              percentage={planillaClients.porcentaje}
              extra="Declaran planilla electrónica"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce
              title="Clientes Activos"
              count={activeClients.total}
              percentage={activeClients.porcentaje}
              extra="Clientes con actividad reciente"
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce
              title="Clientes Suspendidos"
              count={suspendClients.total}
              percentage={suspendClients.porcentaje}
              extra="Actividades suspendidas "
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce
              title="Clientes Baja Temporal"
              count={tempDownClients.total}
              percentage={tempDownClients.porcentaje}
              extra="Baja temporal registrados"
              color="INFO"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce
              title="Clientes Baja Definitiva"
              count={defDownClients.total}
              percentage={defDownClients.porcentaje}
              extra="Baja Definitiva registrados"
              color="error"
            />
          </Grid>

          <Grid
            item
            md={8}
            sx={{ display: { sm: "none", md: "block", lg: "none" } }}
          />

          {/* row 2 */}
          <Grid item xs={12} md={7} lg={8}>
            <UniqueVisitorCard
              categories={graficosDataRegimen.categories}
              seriesData={graficosDataRegimen.seriesData}
            />
          </Grid>
          <Grid item xs={12} md={5} lg={4}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Clientes según estado</Typography>
              </Grid>
              <Grid item />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
              <Box sx={{ p: 3, pb: 0 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" color="text.secondary">
                    Distribución
                  </Typography>
                  <Typography variant="h4" fontWeight={100}>
                    Total: {totalClients}{" "}
                  </Typography>
                </Stack>
              </Box>
              <CircleChart
                series={[
                  activeClients.total,
                  suspendClients.total,
                  tempDownClients.total,
                  defDownClients.total,
                ]}
                labels={[
                  "Activos",
                  "Suspendidos",
                  "Baja Temporal",
                  "Baja Definitiva",
                ]}
              />
            </MainCard>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Clientes nuevos por mes</Typography>
              </Grid>
              <Grid item />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
              {/* <Box sx={{ p: 3, pb: 0 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" color="text.secondary">
                    Distribución
                  </Typography>
                  <Typography variant="h4" fontWeight={100}>
                    Total: {totalClients}{" "}
                  </Typography>
                </Stack>
              </Box> */}
              <IncomeAreaChart
                seriesData={graficosDataMes.seriesData}
                categories={graficosDataMes.categories}
                colors={[info.main, info.dark]}
              />
            </MainCard>
          </Grid>
        </Grid>
      </AuthGuard>
    </>
  );
};
export default ClientsDashboardPage;
