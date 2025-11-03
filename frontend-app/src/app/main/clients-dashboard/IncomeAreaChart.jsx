"use client";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const defaultChartOptions = {
  chart: {
    height: 450,
    type: "area",
    toolbar: { show: false },
  },
  dataLabels: { enabled: true },
  stroke: { curve: "smooth", width: 2 },
  grid: { strokeDashArray: 0 },
};

export default function AreaChart({
  seriesData = [],
  categories = [],
  colors,
}) {
  const theme = useTheme();
  const { text, divider, primary } = theme.palette;

  // 🔹 Estado para evitar render antes de montar
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Esperar a que el componente se monte

  const options = {
    ...defaultChartOptions,
    colors: colors || [primary.main, primary[700]],
    xaxis: {
      categories,
      labels: {
        style: { colors: Array(categories.length).fill(text.secondary) },
      },
      axisBorder: { show: true, color: divider },
      tickAmount: categories.length - 1,
    },
    yaxis: {
      labels: { style: { colors: [text.secondary] } },
    },
    grid: { borderColor: divider },
  };

  return (
    <ReactApexChart
      options={options}
      series={seriesData}
      type="bar"
      height={450}
    />
  );
}

AreaChart.propTypes = {
  seriesData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
};
