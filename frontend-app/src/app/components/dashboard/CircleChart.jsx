"use client";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";

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

  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.success.main,
    theme.palette.success.light,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.error.light,
  ];

  const finalColors = colors.length > 0 ? colors : defaultColors;

  const options = {
    chart: { type },
    labels,
    colors: finalColors,
    legend: { position: legendPosition },
    dataLabels: { enabled: true },
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
