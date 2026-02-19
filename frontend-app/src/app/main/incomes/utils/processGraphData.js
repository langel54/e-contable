export function prepareChartDataWithMes(items = [], seriesName = "Serie") {
  // Normaliza distintos formatos que puede traer `saldosMensuales`:
  // - [{ fecha: '2025-11-01', saldo: -12.34 }, ...]
  // - [{ mes: 'enero', saldo: -12.34 }, ...]
  // - [{ idperiodo: 2, saldo: -5300.08 }, ...]
  // - [{ _sum: { importe: 123 }, idperiodo: 2, anio: 2023 }, ...]
  if (!Array.isArray(items)) items = [];

  const monthOrder = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  };

  const safeNum = (v) => {
    if (v == null || Number.isNaN(Number(v))) return 0;
    return Number(Number(v).toFixed(2));
  };

  // Detect shape
  const hasFecha = items.some((it) => it && (it.fecha || it._sum?.fecha));
  const hasMes = items.some((it) => it && typeof it.mes === "string");
  const hasIdPeriodo = items.some((it) => it && it.idperiodo != null);

  if (hasFecha) {
    // Date-based (daily) series
    const categories = items
      .map((item) => new Date(item.fecha || item._sum?.fecha))
      .filter((d) => !isNaN(d))
      .map((date) =>
        date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" })
      );

    const data = items.map((item) => {
      const val = item._sum?.importe ?? item.saldo ?? item.importe ?? 0;
      return safeNum(val);
    });

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

  if (hasMes) {
    // Month-name based series (e.g., "enero", "febrero")
    const mesesPresentes = Array.from(
      new Set(items.map((it) => (it.mes || "").toString().toLowerCase()))
    ).filter(Boolean);

    // sort by monthOrder
    mesesPresentes.sort((a, b) => (monthOrder[a] || 99) - (monthOrder[b] || 99));

    const categories = mesesPresentes.map((m) =>
      // keep original capitalization from source if needed
      m
    );

    const data = mesesPresentes.map((m) => {
      const match = items.find((it) => (it.mes || "").toString().toLowerCase() === m);
      const val = match?._sum?.importe ?? match?.importe ?? match?.saldo ?? 0;
      return safeNum(val);
    });

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

  if (hasIdPeriodo) {
    // Group by idperiodo (useful when backend returns aggregates by period)
    const ids = Array.from(new Set(items.map((it) => it.idperiodo))).sort(
      (a, b) => a - b
    );

    const categories = ids.map((i) => String(i));

    const data = ids.map((id) => {
      const match = items.find((it) => it.idperiodo === id);
      const val = match?._sum?.importe ?? match?.importe ?? match?.saldo ?? 0;
      return safeNum(val);
    });

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

  // Fallback: try to coerce any numeric fields
  const categories = items.map((_, i) => String(i + 1));
  const data = items.map((it) => safeNum(it?._sum?.importe ?? it?.importe ?? it?.saldo ?? 0));

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
  // Build chart data from different possible backend shapes.
  // Supported inputs:
  // - [{ fecha: '2025-11-01', _sum: { importe: 123 } }, ...]  (daily)
  // - [{ mes: 'enero', importe: 15395 }, ...] (month-name)
  // - [{ idperiodo: 2, _sum: { importe: 18725 } }, ...] (period id)

  const monthOrder = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  };

  const safeNum = (v) => {
    if (v == null || Number.isNaN(Number(v))) return 0;
    return Number(Number(v).toFixed(2));
  };

  const flat = (arr) => (Array.isArray(arr) ? arr : []);

  const iArr = flat(ingresosMensuales);
  const sArr = flat(salidasMensuales);

  const detect = (arr) => ({
    hasFecha: arr.some((it) => it && (it.fecha || it._sum?.fecha)),
    hasMes: arr.some((it) => it && typeof it.mes === "string"),
    hasId: arr.some((it) => it && it.idperiodo != null),
  });

  const dI = detect(iArr);
  const dS = detect(sArr);

  // Prefer fecha if either has it
  if (dI.hasFecha || dS.hasFecha) {
    const fechasSet = new Set([
      ...iArr.map((i) => i.fecha || i._sum?.fecha),
      ...sArr.map((s) => s.fecha || s._sum?.fecha),
    ]);

    const fechas = Array.from(fechasSet)
      .filter(Boolean)
      .map((f) => new Date(f))
      .filter((d) => !isNaN(d))
      .sort((a, b) => a - b);

    const categories = fechas.map((date) =>
      date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" })
    );

    const keyFrom = (item) => item.fecha || item._sum?.fecha;

    const mapI = Object.fromEntries(
      iArr.map((it) => [keyFrom(it), safeNum(it._sum?.importe ?? it.importe ?? 0)])
    );
    const mapS = Object.fromEntries(
      sArr.map((it) => [keyFrom(it), safeNum(it._sum?.importe ?? it.importe ?? 0)])
    );

    const series = [
      { name: "Ingresos", data: fechas.map((f) => mapI[f.toISOString()] ?? mapI[f] ?? 0) },
      { name: "Salidas", data: fechas.map((f) => mapS[f.toISOString()] ?? mapS[f] ?? 0) },
    ];

    return { categories, series };
  }

  // If month names present -> use month order
  if (dI.hasMes || dS.hasMes) {
    const meses = Array.from(
      new Set([...(iArr.map((it) => (it.mes || "").toString().toLowerCase())), ...(sArr.map((it) => (it.mes || "").toString().toLowerCase()))])
    ).filter(Boolean);

    meses.sort((a, b) => (monthOrder[a] || 99) - (monthOrder[b] || 99));

    const categories = meses.map((m) => m);

    const mapByMes = (arr) =>
      Object.fromEntries(arr.map((it) => [ (it.mes || "").toString().toLowerCase(), safeNum(it._sum?.importe ?? it.importe ?? 0) ]));

    const mapI = mapByMes(iArr);
    const mapS = mapByMes(sArr);

    const series = [
      { name: "Ingresos", data: meses.map((m) => mapI[m] ?? 0) },
      { name: "Salidas", data: meses.map((m) => mapS[m] ?? 0) },
    ];

    return { categories, series };
  }

  // If idperiodo present -> use numeric period ids as categories
  if (dI.hasId || dS.hasId) {
    const ids = Array.from(new Set([...(iArr.map((it) => it.idperiodo)), ...(sArr.map((it) => it.idperiodo))])).filter(Boolean).sort((a,b)=>a-b);

    const categories = ids.map((id) => String(id));

    const mapById = (arr) => Object.fromEntries(arr.map((it) => [it.idperiodo, safeNum(it._sum?.importe ?? it.importe ?? it.saldo ?? 0)]));

    const mapI = mapById(iArr);
    const mapS = mapById(sArr);

    const series = [
      { name: "Ingresos", data: ids.map((id) => mapI[id] ?? 0) },
      { name: "Salidas", data: ids.map((id) => mapS[id] ?? 0) },
    ];

    return { categories, series };
  }

  // Fallback: try to align by index
  const maxLen = Math.max(iArr.length, sArr.length);
  const categories = Array.from({ length: maxLen }, (_, i) => String(i + 1));
  const series = [
    { name: "Ingresos", data: Array.from({ length: maxLen }, (_, i) => safeNum(iArr[i]?._sum?.importe ?? iArr[i]?.importe ?? 0)) },
    { name: "Salidas", data: Array.from({ length: maxLen }, (_, i) => safeNum(sArr[i]?._sum?.importe ?? sArr[i]?.importe ?? 0)) },
  ];

  return { categories, series };
}

// Devuelve series con las 12 meses del año (Enero..Diciembre) rellenando 0 cuando falta
export function buildMonthlyFullYear(ingresosMensuales = [], salidasMensuales = []) {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const monthKey = (m) => (m || "").toString().toLowerCase();
  const mMap = (arr) =>
    Object.fromEntries(
      (Array.isArray(arr) ? arr : []).map((it) => [monthKey(it.mes), Number(it._sum?.importe ?? it.importe ?? it.saldo ?? 0)])
    );

  const mi = mMap(ingresosMensuales);
  const ms = mMap(salidasMensuales);

  const series = [
    { name: "Ingresos", data: months.map((m) => Number(mi[monthKey(m)] ?? 0)) },
    { name: "Salidas", data: months.map((m) => Number(ms[monthKey(m)] ?? 0)) },
  ];

  return { categories: months, series };
}

// Alias útil para gráficos de barras apiladas (ya devuelve categories + series)
export function buildStackedSeries(ingresosMensuales = [], salidasMensuales = [], options = {}) {
  // Si los datos vienen con 'mes' usaremos buildMonthlyFullYear para asegurar 12 meses,
  // si vienen con fechas o idperiodo delegamos a buildChartMes
  const hasMes = (Array.isArray(ingresosMensuales) && ingresosMensuales.some((it) => it && typeof it.mes === 'string')) ||
                 (Array.isArray(salidasMensuales) && salidasMensuales.some((it) => it && typeof it.mes === 'string'));

  if (hasMes) {
    return buildMonthlyFullYear(ingresosMensuales, salidasMensuales);
  }

  return buildChartMes(ingresosMensuales, salidasMensuales);
}
