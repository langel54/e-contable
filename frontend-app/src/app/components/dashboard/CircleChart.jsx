"use client";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { getApexThemeOptions, getChartSeriesColors } from "@/app/themes/chartPalette";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CircleChart = ({
  labels = [],
  series = [],
  type = "pie",
  height = 350,
  legendPosition = "bottom",
  colors = [],
}) => {
  const theme = useTheme();
  const apexTheme = getApexThemeOptions(theme);
  const finalColors = colors.length > 0 ? colors : getChartSeriesColors(theme, labels.length || series.length);

  const options = {
    ...apexTheme,
    chart: { ...apexTheme.chart, type },
    labels,
    colors: finalColors,
    legend: { ...apexTheme.legend, position: legendPosition },
    dataLabels: { ...apexTheme.dataLabels, enabled: true },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: type === "donut" ? "68%" : undefined,
          labels: {
            show: type === "donut",
            total: {
              show: type === "donut",
              label: "Total",
              fontWeight: 600,
              color: theme.palette.text.secondary,
            },
          },
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type={type}
      height={height}
    />
  );
};

CircleChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string),
  series: PropTypes.arrayOf(PropTypes.number),
  type: PropTypes.oneOf(["pie", "donut"]),
  height: PropTypes.number,
  legendPosition: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  colors: PropTypes.arrayOf(PropTypes.string),
};

export default CircleChart;
{
  /* <CircleChart
            labels={labels}
            series={series}
            type="donut"
            height={300}
            legendPosition="right"
            colors={["#2196f3", "#4caf50", "#ff9800"]}
          /> */
}
