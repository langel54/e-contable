"use client";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const AreaChart = ({
  seriesData = [],
  categories = [],
  colors,
  type = "area",
  height = 450,
  horizontalLineAtZero = false, // ✅ nueva propiedad
}) => {
  const theme = useTheme();
  const { text, divider, info, warning, error } = theme.palette;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const safeCategories = Array.isArray(categories) ? categories : [];

  const options = {
    chart: {
      type,
      toolbar: { show: true },
    },

    // ⭐ DATA LABELS ACTIVADOS PARA TODOS LOS TIPOS
    // dataLabels: {
    //   enabled: true,
    //   style: {
    //     fontSize: "11px",
    //     colors: [text.primary],
    //   },
    //   offsetY: type === "bar" ? -8 : -5,
    // },

    // ⭐ CONFIG ESPECÍFICA SEGÚN EL TIPO
    ...(type === "line" && {
      stroke: { curve: "smooth", width: 3 },
      fill: { opacity: 1 },
    }),

    ...(type === "area" && {
      stroke: { curve: "smooth", width: 2 },
      fill: { type: "gradient", gradient: { opacityFrom: 0.5, opacityTo: 0 } },
    }),

    ...(type === "bar" && {
      plotOptions: {
        bar: {
          borderRadius: 4,
          dataLabels: { position: "top" },
          columnWidth: "45%",
        },
      },
    }),

    colors: colors || [info.light, warning.main],

    xaxis: {
      categories: safeCategories,
      labels: {
        style: { colors: safeCategories.map(() => text.secondary) },
      },
      axisBorder: { show: true, color: divider },
      tickAmount: safeCategories.length > 1 ? safeCategories.length - 1 : 0,
    },

    yaxis: {
      labels: { style: { colors: [text.secondary] } },
    },

    grid: {
      borderColor: divider,
    },
    
    // ⭐ CONFIGURACIÓN DEL TOOLTIP
    tooltip: {
      theme: theme.palette.mode, // 'dark' o 'light'
      style: {
        fontSize: '12px',
        fontFamily: theme.typography.fontFamily,
      },
      background: {
       enabled: true,
       foreColor: theme.palette.text.primary,
      },
      marker: {
        show: true,
      },
      // Aseguramos contraste fix si el automode falla
      ...(theme.palette.mode === 'dark' && {
        cssClass: 'apexcharts-tooltip-dark-custom', // Opcional si queremos CSS específico
        style: {
          color: '#f8fafc' // Slate 50
        }
      })
    },

    // ✅ Agregar línea horizontal en 0 si la propiedad está activada
    annotations: horizontalLineAtZero
      ? {
          yaxis: [
            {
              y: 0,
              borderColor: error.main || "#FF0000", // roja
              strokeDashArray: 0,
              label: {
                borderColor: error.main || "#FF0000",
                style: { color: "#fff", background: error.main || "#FF0000" },
                text: "0",
              },
            },
          ],
        }
      : {},
  };

  return (
    <ReactApexChart
      options={options}
      series={seriesData}
      type={type}
      height={height}
    />
  );
};

AreaChart.propTypes = {
  seriesData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.oneOf(["area", "line", "bar"]),
  height: PropTypes.number,
};

export default AreaChart;
