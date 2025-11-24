export function prepareChartDataWithMes(items = [], seriesName = "Serie") {
  if (!Array.isArray(items)) items = [];

  const categories = items.map((item) => {
    const date = new Date(item.fecha);
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
    });
  });

  const data = items.map(
    (item) =>
      Number(item._sum?.importe.toFixed(2)) ||
      Number((item?.saldo).toFixed(2)) ||
      0
  );

  return {
    categoriesMes: categories,
    seriesDataMes: [
      {
        name: seriesName,
        data,
      },
    ],
  };
}
// const resultMesSaldos = prepareChartDataWithMes(
//   chartData.saldosMensuales,
//   "Saldos"
// );

export function buildChartMes(ingresosMensuales = [], salidasMensuales = []) {
  // 1. Obtener todas las fechas sin duplicados
  const fechasSet = new Set([
    ...ingresosMensuales.map((i) => i.fecha),
    ...salidasMensuales.map((s) => s.fecha),
  ]);

  const fechas = Array.from(fechasSet).sort();

  // 2. Convertir a categorías legibles
  const categories = fechas.map((f) =>
    new Date(f).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
    })
  );

  // 3. Alinear importes por fecha
  const mapIngresos = Object.fromEntries(
    ingresosMensuales.map((i) => [i.fecha, i._sum?.importe || 0])
  );
  const mapSalidas = Object.fromEntries(
    salidasMensuales.map((s) => [s.fecha, s._sum?.importe || 0])
  );

  const series = [
    {
      name: "Ingresos",
      data: fechas.map((f) => mapIngresos[f] ?? 0),
    },
    {
      name: "Salidas",
      data: fechas.map((f) => mapSalidas[f] ?? 0),
    },
  ];

  return { categories, series };
}
