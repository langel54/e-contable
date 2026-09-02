"use client";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { getApexThemeOptions, getChartSeriesColors } from "@/app/themes/chartPalette";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function CircleChart({ slot, labels = [], series = [] }) {
  const theme = useTheme();

  const apexTheme = getApexThemeOptions(theme);
  const chartColors = getChartSeriesColors(theme, labels.length || series.length);

  const options = {
    ...apexTheme,
    chart: { ...apexTheme.chart, type: "pie" },
    labels,
    colors: chartColors,
    legend: { ...apexTheme.legend, position: "bottom" },
    dataLabels: { ...apexTheme.dataLabels, enabled: true },
  };

  return (
    <ReactApexChart options={options} series={series} type="pie" height={400} />
  );
}

CircleChart.propTypes = { slot: PropTypes.string };
