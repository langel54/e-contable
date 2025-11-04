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
    type: "area",
    toolbar: { show: false },
  },
  dataLabels: { enabled: true },
  stroke: { curve: "smooth", width: 2 },
  grid: { strokeDashArray: 0 },
};

const AreaChart = ({
  seriesData = [],
  categories = [],
  colors,
  type = "area",
  height = 450,
}) => {
  const theme = useTheme();
  const { text, divider, primary, warning, info } = theme.palette;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const options = {
    ...defaultChartOptions,
    colors: colors || [info.light, warning.main],
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
// const series = [
//   { name: "Ventas", data: [5, 10, 15, 20, 30, 40] },
//   { name: "Devoluciones", data: [1, 2, 3, 2, 1, 0] },
// ];

// const categories = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];

// return (
//   <AreaChart
//     seriesData={series}
//     categories={categories}
//     type="area"
//     height={350}
//   />
// );
