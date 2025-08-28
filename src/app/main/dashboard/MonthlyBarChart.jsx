"use client";
import { useEffect, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

// third-party
import dynamic from "next/dynamic"; // Importación dinámica

// chart options
const barChartOptions = {
  chart: {
    type: "bar",
    height: 365,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "45%",
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  grid: {
    show: false,
  },
};

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function MonthlyBarChart() {
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.light;

  // Usamos una constante para `series` ya que no cambia
  const series = [
    {
      data: [80, 95, 70, 42, 65, 55, 78],
    },
  ];

  // Usamos el estado solo para `options`
  const [options, setOptions] = useState(barChartOptions);
  const [isClient, setIsClient] = useState(false); // Estado para verificar si estamos en el cliente

  // Configuramos la opción solo después de que el componente se haya montado en el cliente
  useEffect(() => {
    setIsClient(true); // Activamos el estado del cliente una vez que se ha montado el componente
  }, []);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [info],
      xaxis: {
        labels: {
          style: {
            colors: Array(7).fill(secondary), // Simplificado para los 7 días de la semana
          },
        },
      },
    }));
  }, [info, secondary]); // Solo las dependencias necesarias

  // Cargamos el componente ReactApexChart solo en el cliente
  if (!isClient) {
    return null; // No renderizamos nada en el servidor
  }

  const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });

  return (
    <Box id="chart" sx={{ bgcolor: "transparent" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={365}
      />
    </Box>
  );
}
