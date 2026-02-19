"use client";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function CircleChart({ slot, labels = [], series = [] }) {
  const theme = useTheme();

  const muiColors = [
    // theme.palette.success.main,
    theme.palette.success.light,
    // theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.error.light,
    // theme.palette.secondary.main,
    theme.palette.info.light,
    // theme.palette.error.main,
    theme.palette.error.light,
    // theme.palette.warning.main,
    theme.palette.warning.light,
  ];

  const options = {
    chart: { type: "pie" },
    labels: labels,
    colors: muiColors, // 🔹 colores base
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
  };

  return (
    <ReactApexChart options={options} series={series} type="pie" height={400} />
  );
}

CircleChart.propTypes = { slot: PropTypes.string };
