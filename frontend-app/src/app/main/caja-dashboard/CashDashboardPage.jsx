"use client";

import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import AuthGuard from "../menu/AuthGuard";
import AnalyticEcommerce from "@/app/ui-components/cards/statistics/AnalyticEcommerce";
import MainCard from "@/app/ui-components/MainCard";
import AreaChart from "@/app/components/dashboard/AreaChart";
import CircleChart from "@/app/components/dashboard/CircleChart";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MonthPicker from "./MonthPicker";
import {
  getDashboardCajaGraficos,
  getDashboardCajaKPIs,
} from "@/app/services/dashboardService";
import { round } from "lodash";
import {
  buildChartMes,
  prepareChartDataWithMes,
} from "../incomes/utils/processGraphData";

// Mock de servicios mientras se crea el backend

const CashDashboardPage = () => {
  const theme = useTheme();
  const [mode, setMode] = useState("fecha");
  const [selectedAnio, setSelectedAnio] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState("10");
  const [kpis, setKpis] = useState({});

  const [chartData, setChartData] = useState({});
  console.log(
    "🚀 ~ CashDashboardPage ~ chartData:",
    chartData.ingresosMensuales
  );

  const fetchData = async () => {
    try {
      const kpiData = await getDashboardCajaKPIs({
        modo: mode,
        anio: selectedAnio,
        idperiodo: selectedMonth,
      });
      //   {
      //     "filtros": {
      //         "anio": 2024,
      //         "mes": 1,
      //         "modo": "fecha"
      //     },
      //     "totalesMes": {
      //         "ingresos": 27205,
      //         "salidas": 31341.7,
      //         "saldo": -4136.700000000001
      //     },
      //     "totalesAnio": {
      //         "ingresos": 199472,
      //         "salidas": 207738.17,
      //         "saldo": -8266.170000000013
      //     },
      //     "variacion": {
      //         "ingresos": -14.11,
      //         "salidas": 21.06,
      //         "saldo": -171.53
      //     }
      // }
      setKpis(kpiData);

      const graphData = await getDashboardCajaGraficos({
        modo: mode,
        anio: selectedAnio,
        idperiodo: selectedMonth,
      });
      setChartData(graphData);
    } catch (error) {
      console.error("Error fetching cash dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // al montar
  }, []);

  useEffect(() => {
    fetchData(); // cada vez que cambian los filtros
  }, [mode, selectedAnio, selectedMonth]);

  const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);

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

  const { categories: categoriesMes, series: seriesMes } = buildChartMes(
    chartData.ingresosMensuales,
    chartData.salidasMensuales
  );

  const resultMesSaldo = prepareChartDataWithMes(chartData.saldosMensuales, "Saldos");

  const {
    categoriesMes: categoriesMesSaldo,
    seriesDataMes: seriesDataMesSaldo,
  } = resultMesSaldo;
  console.log(
    "🚀 ~ CashDashboardPage ~ categoriesMesSaldo:",
    seriesDataMesSaldo
  );

  return (
    <AuthGuard allowedRoles={[1]}>
      <Grid container rowSpacing={2} columnSpacing={2} marginTop={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{
            width: "100%",
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : theme.palette.divider}`,
            padding: 1.5,
            borderRadius: 3,
            marginLeft: 2,
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Dashboard - Información de Caja
          </Typography>
          <FormControl fullWidth size="small" sx={{ maxWidth: 200 }}>
            <InputLabel>Según:</InputLabel>
            <Select
              value={mode}
              label="Modo"
              onChange={(e) => setMode(e.target.value)}
            >
              <MenuItem value="fecha">Fecha</MenuItem>
              <MenuItem value="periodo">Periodo</MenuItem>
            </Select>
          </FormControl>
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
                />
              }
            />
          </FormControl>
          <FormControl fullWidth size="small" sx={{ maxWidth: 200 }}>
            <MonthPicker
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(value)}
            />
          </FormControl>
        </Stack>
        {selectedMonth && kpis?.totalesMes && (
          <>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <AnalyticEcommerce
                title="Ingresos Totales del Mes"
                count={formatCurrency(kpis.totalesMes.ingresos || 0)}
                percentage={kpis.totalesMes.ingresos > 0 ? 100 : 0}
                color="info"
                extra="Total de ingresos del mes"
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4}>
              <AnalyticEcommerce
                title="Egresos Totales del Mes"
                count={formatCurrency(kpis.totalesMes.salidas || 0)}
                percentage={
                  kpis.totalesMes.ingresos != 0
                    ? round(
                        (kpis.totalesMes.salidas / kpis.totalesMes.ingresos) *
                          100
                      )
                    : 0
                }
                color="error"
                extra="Total de egresos del mes"
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4}>
              <AnalyticEcommerce
                title="Saldo del Mes"
                count={formatCurrency(kpis.totalesMes.saldo || 0)}
                percentage={
                  kpis.totalesMes.ingresos != 0
                    ? round(
                        (kpis.totalesMes.saldo / kpis.totalesMes.ingresos) * 100
                      )
                    : 0
                }
                color={kpis.totalesMes.saldo <= 0 ? "error" : "success"}
                isLoss={kpis.totalesMes.saldo <= 0}
                extra="Total de saldo del mes"
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={4} md={4} lg={4}>
          <AnalyticEcommerce
            title="Ingreso Anual"
            count={formatCurrency(kpis.totalesAnio?.ingresos || 0)}
            percentage={100}
            color="info"
            extra={`Total de ingresos del año ${selectedAnio}`}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={4} lg={4}>
          <AnalyticEcommerce
            title="Egreso Anual"
            count={formatCurrency(kpis.totalesAnio?.salidas || 0)}
            percentage={
              kpis.totalesAnio?.ingresos !== 0
                ? round(
                    (kpis.totalesAnio?.salidas / kpis.totalesAnio?.ingresos) *
                      100
                  )
                : 0
            }
            isLoss={kpis.totalesAnio?.salidas > kpis.totalesAnio?.ingresos}
            color="error"
            extra={`Total de egresos del año ${selectedAnio}`}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={4} lg={4}>
          <AnalyticEcommerce
            title="Saldo Anual"
            count={formatCurrency(kpis.totalesAnio?.saldo || 0)}
            percentage={
              kpis.totalesAnio?.ingresos !== 0
                ? round(
                    (kpis.totalesAnio?.saldo / kpis.totalesAnio?.ingresos) * 100
                  )
                : 0
            }
            color={kpis.totalesAnio?.saldo <= 0 ? "error" : "success"}
            isLoss={kpis.totalesAnio?.saldo <= 0}
            extra={`Total de saldo del año ${selectedAnio}`}
          />
        </Grid>

        {(seriesMes && seriesMes.length > 0 && categoriesMes && categoriesMes.length > 0) && (
          <Grid item xs={12} md={12}>
            <MainCard>
              <Typography variant="h5">Movimientos</Typography>
              <AreaChart
                seriesData={seriesMes || []}
                categories={categoriesMes || []}
                height={350}
                type="bar"
                // colors={["red", "green"]}
              />
            </MainCard>
          </Grid>
        )}
        {(seriesDataMesSaldo && seriesDataMesSaldo.length > 0 && categoriesMesSaldo && categoriesMesSaldo.length > 0) && (
          <Grid item xs={12} md={12}>
            <MainCard>
              <Typography variant="h5">Saldos</Typography>
              <AreaChart
                seriesData={seriesDataMesSaldo || []}
                categories={categoriesMesSaldo || []}
                height={350}
                type="line"
                colors={["red"]}
                horizontalLineAtZero={true}
              />
            </MainCard>
          </Grid>
        )}
        <Grid item xs={12} md={4}>
          <MainCard>
            <Typography variant="h5">Distribución del Mes</Typography>
            <CircleChart
              series={[
                kpis.ingresosMes?.total || 0,
                kpis.egresosMes?.total || 0,
              ]}
              labels={["Ingresos", "Egresos"]}
              height={350}
              //   colors={[theme.palette.success.main, theme.palette.error.main]}
            />
          </MainCard>
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default CashDashboardPage;
