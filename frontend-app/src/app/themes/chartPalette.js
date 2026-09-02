// ==============================|| TEMA - PALETA COHERENTE PARA GRÁFICOS ||============================== //

/** Colores de series alineados con la paleta MUI (dashboards, tortas, barras). */
export function getChartSeriesColors(theme, count) {
  const { primary, success, warning, info, error } = theme.palette;
  const palette = [
    primary.main,
    "#06b6d4",
    success.main,
    warning.main,
    error.main,
    primary.dark,
    info.light,
    "#a78bfa",
  ];
  if (!count || count >= palette.length) return palette;
  return palette.slice(0, count);
}

/** Opciones base de ApexCharts enlazadas al tema activo. */
export function getApexThemeOptions(theme) {
  const { text, divider, mode } = theme.palette;
  return {
    theme: { mode },
    chart: {
      fontFamily: theme.typography.fontFamily,
      foreColor: text.secondary,
      toolbar: { show: true, tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } },
    },
    grid: {
      borderColor: divider,
      strokeDashArray: 4,
      padding: { left: 8, right: 8 },
    },
    legend: {
      labels: { colors: text.secondary },
      fontFamily: theme.typography.fontFamily,
      fontWeight: 500,
      markers: { radius: 6 },
    },
    dataLabels: {
      style: {
        fontSize: "11px",
        fontFamily: theme.typography.fontFamily,
        fontWeight: 600,
        colors: [text.primary],
      },
    },
    tooltip: {
      theme: mode,
      style: {
        fontSize: "12px",
        fontFamily: theme.typography.fontFamily,
      },
    },
    xaxis: {
      labels: { style: { colors: text.secondary, fontFamily: theme.typography.fontFamily } },
      axisBorder: { color: divider },
      axisTicks: { color: divider },
    },
    yaxis: {
      labels: { style: { colors: text.secondary, fontFamily: theme.typography.fontFamily } },
    },
  };
}
