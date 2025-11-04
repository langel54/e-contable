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

// Mock de servicios mientras se crea el backend
const getDashboardCajaKPIs = async () => {
  console.log("Fetching Caja KPIs...");
  // En un futuro, esto vendría de frontend-app/src/app/services/dashboardService.js
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          totalIngresos: { total: 125000, porcentaje: 60 },
          totalEgresos: { total: 85000, porcentaje: 40 },
          saldoMes: { total: 40000, isLoss: false },
          ingresosMes: { total: 15000, porcentaje: 75 },
          egresosMes: { total: 5000, porcentaje: 25 },
        }),
      500
    )
  );
};

const getDashboardCajaGraficos = async () => {
  console.log("Fetching Caja Graficos...");
  // En un futuro, esto vendría de frontend-app/src/app/services/dashboardService.js
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          movimientosPorMes: [
            { mes: "Ene", ingresos: 12000, egresos: 7000 },
            { mes: "Feb", ingresos: 18000, egresos: 9000 },
            { mes: "Mar", ingresos: 15000, egresos: 11000 },
            { mes: "Abr", ingresos: 22000, egresos: 13000 },
            { mes: "May", ingresos: 19000, egresos: 15000 },
            { mes: "Jun", ingresos: 25000, egresos: 10000 },
          ],
        }),
      500
    )
  );
};

const CashDashboardPage = () => {
  const theme = useTheme();
  const [kpis, setKpis] = useState({});
  const [chartData, setChartData] = useState({
    seriesData: [],
    categories: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiData = await getDashboardCajaKPIs();
        setKpis(kpiData);

        const graphData = await getDashboardCajaGraficos();
        const categories = graphData.movimientosPorMes.map((d) => d.mes);
        const seriesData = [
          {
            name: "Ingresos",
            data: graphData.movimientosPorMes.map((d) => d.ingresos),
          },
          {
            name: "Egresos",
            data: graphData.movimientosPorMes.map((d) => d.egresos),
          },
        ];
        setChartData({ seriesData, categories });
      } catch (error) {
        console.error("Error fetching cash dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);

  const [mode, setMode] = useState("fecha");
  const [selectedAnio, setSelectedAnio] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState("");

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
    <AuthGuard allowedRoles={[1]}>
      <Grid container rowSpacing={2} columnSpacing={2} marginTop={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{
            width: "100%",
            border: "solid 1px " + theme.palette.secondary.light,
            padding: 1,
            borderRadius: 2,
            marginLeft: 2,
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

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <AnalyticEcommerce
            title="Ingresos Totales"
            count={formatCurrency(kpis.totalIngresos?.total)}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <AnalyticEcommerce
            title="Egresos Totales"
            count={formatCurrency(kpis.totalEgresos?.total)}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <AnalyticEcommerce
            title="Saldo del Mes"
            count={formatCurrency(kpis.saldoMes?.total)}
            color={kpis.saldoMes?.isLoss ? "error" : "primary"}
            isLoss={kpis.saldoMes?.isLoss}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <MainCard>
            <Typography variant="h5">Movimientos por Mes</Typography>
            <AreaChart
              seriesData={chartData.seriesData}
              categories={chartData.categories}
              height={350}
              type="bar"
            //   colors={["red","green"]}
            />
          </MainCard>
        </Grid>

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
