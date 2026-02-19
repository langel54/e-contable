const prisma = require("../config/database");
const { handleHttpError } = require("../utils/handleError.js");

// Sección Clientes
const getClientesKPIs = async (req, res) => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // ❗ Antes estaba 12 * 30 días = 360 días
    // ✅ real: últimos 30 días
    const last30Days = new Date(
      currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );

    const now = new Date();
    const firstDayYMD = `${now.getFullYear()}-01-01`;

    // // ✅ clientes nuevos con fecha string convertida
    // const result = await prisma.$queryRaw`
    //   SELECT COUNT(*) as count
    //   FROM clienteProv
    //   WHERE estado = '1'
    //     AND fecha_ingreso <> ''
    //     AND fecha_ingreso <> '0000-00-00'
    //     AND STR_TO_DATE(fecha_ingreso, '%Y-%m-%d') >=${firstDayYMD}
    // `;
    // console.log("🚀 ~ getClientesKPIs ~ result:", result);

    const [
      totalClientes,
      totalClientesActivos,
      totalClientesSuspendidos,
      totalClientesBajaTemp,
      totalClientesBajaDef,
      clientesNuevosAnio,
      clientesPlanillaElect,
      clientesConActividad,
    ] = await Promise.all([
      prisma.clienteProv.count(),

      prisma.clienteProv.count({ where: { estado: "1" } }),
      prisma.clienteProv.count({ where: { estado: "2" } }),
      prisma.clienteProv.count({ where: { estado: "3" } }),
      prisma.clienteProv.count({ where: { estado: "4" } }),
      prisma.clienteProv.count({
        where: {
          estado: "1",
          fecha_ingreso: {
            gte: firstDayYMD, // "greater than or equal" al primer día del año
          },
        },
      }),
      prisma.clienteProv.count({
        where: {
          estado: "1",
          planilla_elect: "SI",
        },
      }),

      prisma.ingreso.findMany({
        where: {
          fecha: { gte: last30Days },
          idestado: 1,
        },
        select: { idclienteprov: true },
        distinct: ["idclienteprov"],
      }),
    ]);

    // const clientesNuevosMes = Number(result[0]?.count ?? 0);

    // ✅ clientes sin actividad
    const clientesSinActividad = await prisma.clienteProv.count({
      where: {
        estado: "1",
        idclienteprov: {
          notIn: clientesConActividad.map((c) => c.idclienteprov),
        },
      },
    });

    // ✅ Porcentaje limpio
    const pct = (parte, total) =>
      total > 0 ? ((parte / total) * 100).toFixed(2) : "0.00";

    res.status(200).json({
      totalClientes,
      clientesActivos: {
        total: totalClientesActivos,
        porcentaje: pct(totalClientesActivos, totalClientes),
      },
      clientesSuspendidos: {
        total: totalClientesSuspendidos,
        porcentaje: pct(totalClientesSuspendidos, totalClientes),
      },
      clientesBajaTemp: {
        total: totalClientesBajaTemp,
        porcentaje: pct(totalClientesBajaTemp, totalClientes),
      },
      clientesBajaDef: {
        total: totalClientesBajaDef,
        porcentaje: pct(totalClientesBajaDef, totalClientes),
      },
      clientesNuevosAnio: {
        total: clientesNuevosAnio,
        porcentaje: pct(clientesNuevosAnio, totalClientesActivos),
      },
      clientesPlanillaElect: {
        total: clientesPlanillaElect,
        porcentaje: pct(clientesPlanillaElect, totalClientesActivos),
      },
      clientesSinActividad: {
        total: clientesSinActividad,
        porcentaje: pct(clientesSinActividad, totalClientesActivos),
      },
    });
  } catch (error) {
    console.error("Error en getClientesKPIs:", error);
    handleHttpError(res, "ERROR_GET_CLIENTES_KPIS", 500);
  }
};

const getClientesGraficos = async (req, res) => {
  console.log("🚀 ~ getClientesGraficos ~ req.query:", req.query);
  try {
    const hoy = new Date();
    const year = hoy.getFullYear();

    const inicioDeAno = `${year}-01-01`;
    const finDeAno = `${year}-12-31`;

    // === 1) Totales por régimen (solo activos) ===
    const clientesPorRegimen = await prisma.clienteProv.groupBy({
      by: ["nregimen"],
      where: { estado: "1" },
      _count: { idclienteprov: true },
      orderBy: {
        _count: { idclienteprov: "desc" },
      },
    });

    // === 2) Clientes ingresados por mes (solo activos del año actual) ===
    const clientesPorMesRaw = await prisma.clienteProv.findMany({
      select: { fecha_ingreso: true },
      where: {
        estado: "1",
        fecha_ingreso: {
          gte: inicioDeAno,
          lte: finDeAno,
        },
      },
      orderBy: { fecha_ingreso: "asc" },
    });

    // Agrupar con JS y completar meses vacíos con 0
    const meses = Array.from({ length: 12 }, (_, i) => {
      const mes = String(i + 1).padStart(2, "0");
      return { mes: `${year}-${mes}`, total: 0 };
    });

    clientesPorMesRaw.forEach((item) => {
      if (!item.fecha_ingreso) return;
      const fecha = new Date(item.fecha_ingreso);
      const mesIndex = fecha.getMonth(); // 0 - 11
      meses[mesIndex].total++;
    });

    res.status(200).json({
      // ok: true,
      clientesPorRegimen,
      clientesPorMes: meses,
    });
  } catch (error) {
    console.error("Error en getClientesKPIs:", error);
    handleHttpError(res, "ERROR_GET_CLIENTES_KPIS", 500);
  }
};

const getClientesTablas = async (req, res) => {
  try {
    // Clientes con monto total facturado y último ingreso
    const clientesFacturacion = await prisma.ingreso.groupBy({
      by: ["idclienteprov"],
      _sum: {
        importe: true, // Corregido de 'total' a 'importe'
      },
      _max: {
        fecha: true,
      },
      where: {
        idestado: 1,
      },
    });

    // Ranking de clientes por número de operaciones
    const clientesOperaciones = await prisma.ingreso.groupBy({
      by: ["idclienteprov"],
      _count: {
        idingreso: true,
      },
      orderBy: {
        _count: {
          idingreso: "desc",
        },
      },
      where: {
        idestado: 1, // Aseguramos filtrar por ingresos válidos
      },
    });

    // Obtener información de clientes
    const clientesIds = [
      ...new Set([
        ...clientesFacturacion.map((c) => c.idclienteprov),
        ...clientesOperaciones.map((c) => c.idclienteprov),
      ]),
    ];

    const clientesInfo = await prisma.clienteProv.findMany({
      where: {
        idclienteprov: {
          in: clientesIds,
        },
      },
    });

    // Combinar información
    const clientesDetallado = clientesFacturacion.map((cliente) => ({
      ...cliente,
      operaciones:
        clientesOperaciones.find(
          (c) => c.idclienteprov === cliente.idclienteprov
        )?._count.idingreso || 0,
      clienteInfo: clientesInfo.find(
        (c) => c.idclienteprov === cliente.idclienteprov
      ),
    }));

    res.send({
      clientesDetallado,
    });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_CLIENTES_TABLAS", 500);
  }
};

// Sección Tributos
const getTributosGraficos = async (req, res) => {
  try {
    const { anio, mes } = req.query; // Filtros opcionales desde el frontend
    const where = {};

    if (anio) where.anio = anio;
    if (mes) where.mes = mes;

    // 📊 1️⃣ Evolución mensual (últimos 12 meses o del año filtrado)
    const tributosMensuales = await prisma.tributos.groupBy({
      by: ["anio", "mes"],
      _sum: { importe_pc: true, importe_reg: true, importe_pend: true },
      where,
      orderBy: [{ anio: "asc" }, { mes: "asc" }],
    });

    const graficoMensual = tributosMensuales.map((t) => ({
      mes: `${t.mes}-${t.anio}`,
      pagado: t._sum.importe_pc || 0,
      registrado: t._sum.importe_reg || 0,
      pendiente: t._sum.importe_pend || 0,
    }));

    // 📈 2️⃣ Distribución por tipo de tributo
    const porTipo = await prisma.tributos.groupBy({
      by: ["idtipo_trib"],
      _sum: { importe_pc: true },
      where,
    });

    // Obtener nombres de tipo_trib
    const tipos = await prisma.tipoTrib.findMany({
      select: { idtipo_trib: true, descripcion_t: true },
    });

    const graficoPorTipo = porTipo.map((t) => {
      const tipo = tipos.find((tp) => tp.idtipo_trib === t.idtipo_trib);
      return {
        tipo: tipo ? tipo.descripcion_t : t.idtipo_trib,
        total: t._sum.importe_pc || 0,
      };
    });

    // 🟢 3️⃣ Distribución por estado (para gráficos tipo doughnut)
    const porEstado = await prisma.tributos.groupBy({
      by: ["estado"],
      _count: { _all: true },
      where,
    });

    const graficoPorEstado = porEstado.map((e) => ({
      estado: e.estado,
      cantidad: e._count._all,
    }));

    // 📤 4️⃣ Enviar datos listos para los gráficos
    res.json({
      graficoMensual,
      graficoPorTipo,
      graficoPorEstado,
    });
  } catch (error) {
    console.error("❌ Error en getTributosGraficos:", error);
    handleHttpError(res, "ERROR_GET_TRIBUTOS_GRAFICOS", 500);
  }
};

const getTributosKPIs = async (req, res) => {
  try {
    const { anio, mes } = req.query; // vienen desde el frontend
    const where = {};

    if (anio) where.anio = anio;
    if (mes) where.mes = mes;

    // 1️⃣ Total de registros
    const totalTributos = await prisma.tributos.count({ where });

    // 2️⃣ Totales y promedios en paralelo (mejor rendimiento)
    const [totalImporteReg, totalImportePag, totalImportePend, promedioPago] =
      await Promise.all([
        prisma.tributos.aggregate({ _sum: { importe_reg: true }, where }),
        prisma.tributos.aggregate({ _sum: { importe_pc: true }, where }),
        prisma.tributos.aggregate({ _sum: { importe_pend: true }, where }),
        prisma.tributos.aggregate({
          _avg: { importe_pc: true },
          where: { ...where, importe_pc: { gt: 0 } },
        }),
      ]);

    const totalReg = totalImporteReg._sum.importe_reg || 0;
    const totalPag = totalImportePag._sum.importe_pc || 0;
    const totalPend = totalImportePend._sum.importe_pend || 0;

    // 3️⃣ Porcentajes
    const porcentajePagado = totalReg > 0 ? (totalPag / totalReg) * 100 : 0;
    const porcentajePendiente = totalReg > 0 ? (totalPend / totalReg) * 100 : 0;

    // 4️⃣ Conteo por estado (P=Pagado, E=En proceso, N=No pagado, etc.)
    const estados = await prisma.tributos.groupBy({
      by: ["estado"],
      _count: { _all: true },
      where,
    });

    const estadoCounts = estados.reduce((acc, e) => {
      acc[e.estado] = e._count._all;
      return acc;
    }, {});

    // 5️⃣ Enviar respuesta lista para los gráficos
    res.json({
      totalTributos,
      totalImporteReg: totalReg,
      totalImportePag: totalPag,
      totalImportePend: totalPend,
      promedioPago: promedioPago._avg.importe_pc || 0,
      porcentajePagado: porcentajePagado.toFixed(2),
      porcentajePendiente: porcentajePendiente.toFixed(2),
      estados: estadoCounts,
    });
  } catch (error) {
    console.error("❌ Error en getTributosGraficos:", error);
    handleHttpError(res, "ERROR_GET_TRIBUTOS_GRAFICOS", 500);
  }
};

// Sección Caja
const getCajaKPIs = async (req, res) => {
  try {
    const { anio, mes, modo = "fecha" } = req.query;
    console.log("🚀 ~ getCajaKPIs ~ mes:", mes);

    if (!anio)
      return res.status(400).json({ message: "El campo 'anio' es requerido" });

    const selectedYear = parseInt(anio);
    const selectedMonth = mes ? parseInt(mes) : null;

    // 🧩 Filtros dinámicos
    const wherePeriodo = {
      anio: selectedYear,
      ...(selectedMonth && { idperiodo: selectedMonth }),
    };

    const whereFecha = {
      fecha: {
        gte: new Date(selectedYear, selectedMonth ? selectedMonth - 1 : 0, 1),
        lte: new Date(
          selectedYear,
          selectedMonth ? selectedMonth : 12,
          0,
          23,
          59,
          59
        ),
      },
    };

    const where = modo === "fecha" ? whereFecha : wherePeriodo;

    // ==============================
    // 1️⃣ Totales del mes seleccionado
    // ==============================
    const [ingMes, salMes] = await Promise.all([
      prisma.ingreso.aggregate({ _sum: { importe: true }, where }),
      prisma.salida.aggregate({ _sum: { importe: true }, where }),
    ]);

    const totalIngresosMes = ingMes._sum.importe || 0;
    const totalSalidasMes = salMes._sum.importe || 0;
    const saldoMes = totalIngresosMes - totalSalidasMes;

    // ==============================
    // 2️⃣ Totales del año seleccionado
    // ==============================
    const [ingAnio, salAnio] = await Promise.all([
      prisma.ingreso.aggregate({
        _sum: { importe: true },
        where:
          modo === "fecha"
            ? {
                fecha: {
                  gte: new Date(selectedYear, 0, 1),
                  lte: new Date(selectedYear, 11, 31),
                },
              }
            : { anio: selectedYear },
      }),
      prisma.salida.aggregate({
        _sum: { importe: true },
        where:
          modo === "fecha"
            ? {
                fecha: {
                  gte: new Date(selectedYear, 0, 1),
                  lte: new Date(selectedYear, 11, 31),
                },
              }
            : { anio: selectedYear },
      }),
    ]);

    const totalIngresosAnio = ingAnio._sum.importe || 0;
    const totalSalidasAnio = salAnio._sum.importe || 0;
    const saldoAnio = totalIngresosAnio - totalSalidasAnio;

    // ==============================
    // 3️⃣ Periodo anterior (mes o año)
    // ==============================
    let whereAnterior = {};

    if (modo === "fecha") {
      if (selectedMonth) {
        const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
        const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;

        whereAnterior = {
          fecha: {
            gte: new Date(prevYear, prevMonth - 1, 1),
            lte: new Date(prevYear, prevMonth, 0, 23, 59, 59),
          },
        };
      } else {
        whereAnterior = {
          fecha: {
            gte: new Date(selectedYear - 1, 0, 1),
            lte: new Date(selectedYear - 1, 11, 31),
          },
        };
      }
    } else {
      // modo periodo
      if (selectedMonth) {
        const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
        const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
        whereAnterior = { anio: prevYear, idperiodo: prevMonth };
      } else {
        whereAnterior = { anio: selectedYear - 1 };
      }
    }

    const [ingPrev, salPrev] = await Promise.all([
      prisma.ingreso.aggregate({
        _sum: { importe: true },
        where: whereAnterior,
      }),
      prisma.salida.aggregate({
        _sum: { importe: true },
        where: whereAnterior,
      }),
    ]);

    const prevIngresos = ingPrev._sum.importe || 0;
    const prevSalidas = salPrev._sum.importe || 0;
    const prevSaldo = prevIngresos - prevSalidas;

    // ==============================
    // 4️⃣ Variaciones relativas (%)
    // ==============================
    const variacionIngresos = prevIngresos
      ? ((totalIngresosMes - prevIngresos) / prevIngresos) * 100
      : 0;
    const variacionSalidas = prevSalidas
      ? ((totalSalidasMes - prevSalidas) / prevSalidas) * 100
      : 0;
    const variacionSaldo = prevSaldo
      ? ((saldoMes - prevSaldo) / prevSaldo) * 100
      : 0;

    // ==============================
    // 5️⃣ Respuesta final
    // ==============================
    res.json({
      filtros: { anio: selectedYear, mes: selectedMonth, modo },
      totalesMes: {
        ingresos: totalIngresosMes,
        salidas: totalSalidasMes,
        saldo: saldoMes,
      },
      totalesAnio: {
        ingresos: totalIngresosAnio,
        salidas: totalSalidasAnio,
        saldo: saldoAnio,
      },
      variacion: {
        ingresos: Number(variacionIngresos.toFixed(2)),
        salidas: Number(variacionSalidas.toFixed(2)),
        saldo: Number(variacionSaldo.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("❌ Error en getCajaKPIs:", error);
    handleHttpError(res, "ERROR_GET_CAJA_KPIS", 500);
  }
};


const getCajaGraficos = async (req, res) => {
  try {
    const { modo = "fecha", anio, mes } = req.query;
    const currentDate = new Date();

    // 📅 Mapeo de meses
    const mesesNombres = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    // 🧮 Función para agrupar por mes
    const agruparPorMes = (registros) => {
      const agrupado = Array(12)
        .fill(0)
        .map((_, i) => ({
          mes: mesesNombres[i],
          importe: 0,
        }));

      registros.forEach((r) => {
        const idx =
          modo === "fecha"
            ? new Date(r.fecha).getMonth()
            : (r.idperiodo ?? 0) - 1;
        if (idx >= 0 && idx < 12) agrupado[idx].importe += r._sum.importe || 0;
      });

      return agrupado;
    };

    let ingresos = [];
    let salidas = [];
    let fechaInicio, fechaFin;

    // 🧾 1️⃣ MODO FECHA
    if (modo === "fecha") {
      if (anio && mes) {
        const y = parseInt(anio);
        const m = parseInt(mes) - 1;
        fechaInicio = new Date(y, m, 1);
        fechaFin = new Date(y, m + 1, 0, 23, 59, 59, 999);
      } else if (anio) {
        const y = parseInt(anio);
        fechaInicio = new Date(y, 0, 1);
        fechaFin = new Date(y, 11, 31, 23, 59, 59, 999);
      } else {
        fechaInicio = new Date();
        fechaInicio.setMonth(fechaInicio.getMonth() - 11);
        fechaFin = new Date();
      }

      ingresos = await prisma.ingreso.groupBy({
        by: ["fecha"],
        _sum: { importe: true },
        where: {
          idestado: 1,
          fecha: { gte: fechaInicio, lte: fechaFin },
        },
        orderBy: { fecha: "asc" },
      });
      console.log("🚀 ~ getCajaGraficos ~ ingresos:", ingresos);

      salidas = await prisma.salida.groupBy({
        by: ["fecha"],
        _sum: { importe: true },
        where: {
          idestado: 1,
          fecha: { gte: fechaInicio, lte: fechaFin },
        },
        orderBy: { fecha: "asc" },
      });
    }

    // 🧾 2️⃣ MODO PERIODO
    else if (modo === "periodo") {
      const filtrosBase = { idestado: 1 };
      if (anio) filtrosBase.anio = parseInt(anio);
      if (mes) filtrosBase.idperiodo = parseInt(mes);

      ingresos = await prisma.ingreso.groupBy({
        by: ["idperiodo", "anio"],
        _sum: { importe: true },
        where: filtrosBase,
        orderBy: { idperiodo: "asc" },
      });

      salidas = await prisma.salida.groupBy({
        by: ["idperiodo", "anio"],
        _sum: { importe: true },
        where: filtrosBase,
        orderBy: { idperiodo: "asc" },
      });
    }

    // 🧾 3️⃣ Procesamiento de resultados
    let ingresosMensuales, salidasMensuales, saldosMensuales;

    if (anio && !mes) {
      ingresosMensuales = agruparPorMes(ingresos);
      salidasMensuales = agruparPorMes(salidas);
      saldosMensuales = ingresosMensuales.map((ing, i) => ({
        mes: ing.mes,
        saldo: ing.importe - salidasMensuales[i].importe,
      }));
    } else {
      saldosMensuales = ingresos.map((ingreso) => {
        const salida = salidas.find((s) =>
          modo === "fecha"
            ? s.fecha?.getTime() === ingreso.fecha?.getTime()
            : s.idperiodo === ingreso.idperiodo && s.anio === ingreso.anio
        );
        return {
          fecha: modo === "fecha" ? ingreso.fecha : undefined,
          idperiodo: modo === "periodo" ? ingreso.idperiodo : undefined,
          saldo: (ingreso._sum.importe || 0) - (salida?._sum.importe || 0),
        };
      });

      ingresosMensuales = ingresos;
      salidasMensuales = salidas;
    }

    // 📊 Totales y análisis
    const sumImportes = (arr) =>
      arr.reduce((a, b) => a + (b._sum?.importe || b.importe || 0), 0);

    const totalIngresos = sumImportes(ingresosMensuales);
    const totalSalidas = sumImportes(salidasMensuales);
    const totalSaldo = totalIngresos - totalSalidas;

    const porcentajeAhorro = totalIngresos
      ? ((totalSaldo / totalIngresos) * 100).toFixed(2)
      : 0;

    const ratioGasto = totalIngresos
      ? ((totalSalidas / totalIngresos) * 100).toFixed(2)
      : 0;

    const promedioMensual = {
      ingresos: (totalIngresos / ingresosMensuales.length).toFixed(2),
      salidas: (totalSalidas / salidasMensuales.length).toFixed(2),
      saldo: (totalSaldo / saldosMensuales.length).toFixed(2),
    };

    const crecimientoIngresos = ingresosMensuales.map((item, i, arr) => {
      if (i === 0) return { mes: item.mes, crecimiento: 0 };
      const prev = arr[i - 1]._sum?.importe || arr[i - 1].importe || 0;
      const actual = item._sum?.importe || item.importe || 0;
      const growth = prev ? ((actual - prev) / prev) * 100 : 0;
      return { mes: item.mes, crecimiento: growth.toFixed(2) };
    });

    const eficienciaMensual = ingresosMensuales.map((ing, i) => ({
      mes: ing.mes,
      eficiencia: ing.importe
        ? (
            ((ing.importe - salidasMensuales[i].importe) / ing.importe) *
            100
          ).toFixed(2)
        : 0,
    }));

    // 🧾 Top 5 conceptos (solo si tiene anio)
    let topConceptos = [];
    if (anio) {
      topConceptos = await prisma.ingreso.groupBy({
        by: ["idconcepto"],
        _sum: { importe: true },
        where: {
          idestado: 1,
          ...(modo === "fecha"
            ? { fecha: { gte: fechaInicio, lte: fechaFin } }
            : {
                anio: parseInt(anio),
                ...(mes && { idperiodo: parseInt(mes) }),
              }),
        },

        orderBy: { _sum: { importe: "desc" } },
        take: 5,
      });
    }

    // 🧾 Ejecución mensual actual
    const fechaEjecucion =
      anio && mes ? new Date(anio, mes - 1, 1) : currentDate;
    const firstDayOfMonth = new Date(
      fechaEjecucion.getFullYear(),
      fechaEjecucion.getMonth(),
      1
    );

    const ejecucionMensual = {
      ingresos: await prisma.ingreso.aggregate({
        _sum: { importe: true },
        where:
          modo === "fecha"
            ? { idestado: 1, fecha: { gte: firstDayOfMonth } }
            : {
                idestado: 1,
                anio: parseInt(anio || fechaEjecucion.getFullYear()),
                idperiodo: parseInt(mes || fechaEjecucion.getMonth() + 1),
              },
      }),
      salidas: await prisma.salida.aggregate({
        _sum: { importe: true },
        where:
          modo === "fecha"
            ? { idestado: 1, fecha: { gte: firstDayOfMonth } }
            : {
                idestado: 1,
                anio: parseInt(anio || fechaEjecucion.getFullYear()),
                idperiodo: parseInt(mes || fechaEjecucion.getMonth() + 1),
              },
      }),
    };
    const ingresosFormateados = ingresos.map((item) => ({
      label: item.fecha, // también puedes usar .split("T")[0] si quieres solo la fecha
      value: item._sum.importe ?? 0,
    }));
    // 📤 5️⃣ Respuesta final
    res.send({
      modo,
      parametros: { anio, mes },
      ingresosMensuales,
      salidasMensuales,
      saldosMensuales,
      ejecucionMensual,
      analisis: {
        totales: {
          totalIngresos,
          totalSalidas,
          totalSaldo,
          porcentajeAhorro,
          ratioGasto,
        },
        promediosMensuales: promedioMensual,
        crecimientoIngresos,
        eficienciaMensual,
        topConceptos,
      },
    });
  } catch (e) {
    console.error(e);
    handleHttpError(res, "ERROR_GET_CAJA_GRAFICOS", 500);
  }
};

/*****************llll************* 
 | **Objeto / Propiedad**         | **Contenido principal**                                                     | **Descripción resumida**                                                             | **Gráfico recomendado**                              |
| ------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `modo`                         | `"fecha"` o `"periodo"`                                                     | Indica si los datos se agrupan por fecha (`fecha`) o por periodo (`idperiodo`, mes). | —                                                    |
| `parametros`                   | `{ anio, mes }`                                                             | Parámetros enviados al endpoint para filtrar la información.                         | —                                                    |
| `ingresosMensuales`            | Array de `{ mes/fecha, importe }`                                           | Total de ingresos por fecha o mes según el modo.                                     | 📈 **Línea** o 📊 **Barras**                         |
| `salidasMensuales`             | Array de `{ mes/fecha, importe }`                                           | Total de egresos (salidas) por fecha o mes.                                          | 📈 **Línea** o 📊 **Barras**                         |
| `saldosMensuales`              | Array de `{ mes/fecha, saldo }`                                             | Diferencia entre ingresos y salidas en cada periodo.                                 | 📉 **Área apilada** o 📊 **Barras comparativas**     |
| `ejecucionMensual`             | `{ ingresos: {_sum: {importe}}, salidas: {_sum: {importe}} }`               | Totales de ingresos y salidas del mes actual o periodo activo.                       | 🥧 **Donut** o 📊 **Barras horizontales**            |
| `analisis.totales`             | `{ totalIngresos, totalSalidas, totalSaldo, porcentajeAhorro, ratioGasto }` | Resumen global de resultados financieros.                                            | 📟 **KPI Cards / Indicadores numéricos**             |
| `analisis.promediosMensuales`  | `{ ingresos, salidas, saldo }`                                              | Promedios de ingresos, salidas y saldo por mes.                                      | 📊 **Barras** o 📈 **Líneas**                        |
| `analisis.crecimientoIngresos` | Array de `{ mes, crecimiento }`                                             | Porcentaje de crecimiento o decrecimiento de ingresos mes a mes.                     | 📈 **Línea de tendencia**                            |
| `analisis.eficienciaMensual`   | Array de `{ mes, eficiencia }`                                              | Mide qué tanto se ahorra (saldo/ingreso) cada mes.                                   | 📊 **Barras** o 📈 **Líneas**                        |
| `analisis.topConceptos`        | Array de `{ idconcepto, _sum: {importe} }`                                  | Los 5 conceptos de ingreso con mayor monto acumulado.                                | 🥧 **Gráfico circular** o 📊 **Barras horizontales** |

 */
const getCajaTablas = async (req, res) => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Detalle de ingresos
    const ingresos = await prisma.ingreso.findMany({
      where: {
        idestado: 1,
        fecha: {
          gte: firstDayOfMonth,
        },
      },
      include: {
        cliente_prov: true,
        concepto: true,
      },
      orderBy: {
        fecha: "desc",
      },
    });

    // Detalle de egresos
    const egresos = await prisma.salida.findMany({
      where: {
        idestado: 1,
        fecha: {
          gte: firstDayOfMonth,
        },
      },
      include: {
        cliente_prov: true,
        concepto: true,
      },
      orderBy: {
        fecha: "desc",
      },
    });

    // Resumen mensual por grupo de caja
    // Esta consulta parece incorrecta, ya que cajaMes no tiene un campo 'fecha'
    const resumenCajaMes = await prisma.cajaMes.findMany({
      where: {
        fecha_apertura: { gte: firstDayOfMonth }, // Filtrar por fecha de apertura del mes
      },
      orderBy: { nro: "desc" },
      take: 12, // Por ejemplo, los últimos 12 meses
    });

    res.send({
      ingresos,
      egresos,
      resumenCajaMes,
    });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_CAJA_TABLAS", 500);
  }
};

module.exports = {
  // Clientes
  getClientesKPIs,
  getClientesGraficos,
  getClientesTablas,
  // Tributos
  getTributosKPIs,
  getTributosGraficos,
  // getTributosTablas,
  // Caja
  getCajaKPIs,
  getCajaGraficos,
  getCajaTablas,
};
