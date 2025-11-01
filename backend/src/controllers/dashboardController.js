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
    const last30Days = new Date(
      currentDate.getTime() - 12 * 30 * 24 * 60 * 60 * 1000
    );

    // --- 1️⃣ Totales básicos ---
    const [totalClientesActivos, clientesNuevosMes, clientesInactivos] =
      await Promise.all([
        prisma.clienteProv.count({ where: { estado: "1" } }),
        prisma.clienteProv.count({
          where: {
            estado: "1",
            fecha_ingreso: { gte: firstDayOfMonth.toISOString().split("T")[0] },
          },
        }),
        prisma.clienteProv.count({ where: { estado: "0" } }),
      ]);

    // --- 2️⃣ Ticket promedio ---
    const ingresosTotal = await prisma.ingreso.aggregate({
      _sum: { importe: true },
      where: { idestado: 1 },
    });

    const ticketPromedio =
      totalClientesActivos > 0
        ? (ingresosTotal._sum.importe || 0) / totalClientesActivos
        : 0;

    // --- 3️⃣ Top 3 clientes por ingresos ---
    const top3Clientes = await prisma.ingreso.groupBy({
      by: ["idclienteprov"],
      _sum: { importe: true },
      orderBy: { _sum: { importe: "desc" } },
      take: 3,
      where: { idestado: 1 },
    });

    const clientesData = await prisma.clienteProv.findMany({
      where: {
        idclienteprov: { in: top3Clientes.map((c) => c.idclienteprov) },
      },
    });

    const top3ClientesDetalle = top3Clientes.map((cliente) => ({
      idclienteprov: cliente.idclienteprov,
      totalImporte: cliente._sum.importe || 0,
      clienteInfo: clientesData.find(
        (c) => c.idclienteprov === cliente.idclienteprov
      ),
    }));

    // --- 4️⃣ Clientes frecuentes (más de 3 ingresos este mes) ---
    const clientesFrecuentes = await prisma.ingreso.groupBy({
      by: ["idclienteprov"],
      where: {
        fecha: { gte: new Date("2025-10-01T00:00:00.000Z") },
        idestado: 1,
      },
      _count: { idclienteprov: true },
      having: {
        idclienteprov: { _count: { gt: 3 } },
      },
    });

    // --- 5️⃣ Clientes sin actividad en los últimos 30 días ---
    const clientesConActividad = await prisma.ingreso.findMany({
      where: { fecha: { gte: last30Days } },
      select: { idclienteprov: true },
      distinct: ["idclienteprov"],
    });

    const clientesSinActividad = await prisma.clienteProv.count({
      where: {
        estado: "1",
        idclienteprov: {
          notIn: clientesConActividad.map((c) => c.idclienteprov),
        },
      },
    });

    // --- 📊 Resultado final ---
    res.status(200).json({
      totalClientesActivos,
      clientesNuevosMes,
      clientesInactivos,
      ticketPromedio,
      top3Clientes: top3ClientesDetalle,
      adicionales: {
        clientesFrecuentes: clientesFrecuentes.length,
        clientesSinActividad,
      },
    });
  } catch (error) {
    console.error("Error en getClientesKPIs:", error);
    handleHttpError(res, "ERROR_GET_CLIENTES_KPIS", 500);
  }
};
const getClientesGraficos = async (req, res) => {
  try {
    // 📊 1. Top 10 clientes por ingresos acumulados
    const top10Clientes = await prisma.ingreso.groupBy({
      by: ["idclienteprov"],
      _sum: { importe: true },
      where: { idestado: 1 },
      orderBy: { _sum: { importe: "desc" } },
      take: 10,
    });

    // Obtener nombres de los clientes del Top 10
    const clientesTopInfo = await prisma.clienteProv.findMany({
      where: {
        idclienteprov: { in: top10Clientes.map((c) => c.idclienteprov) },
      },
      select: { idclienteprov: true, razonsocial: true },
    });

    const top10ConNombres = top10Clientes.map((c) => ({
      idclienteprov: c.idclienteprov,
      razonsocial:
        clientesTopInfo.find((i) => i.idclienteprov === c.idclienteprov)
          ?.razonsocial || "Desconocido",
      total: c._sum.importe || 0,
    }));

    // 🗓️ 2. Ingresos mensuales por cliente (últimos 12 meses)
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 11);
    fechaInicio.setDate(1); // Desde inicio del mes

    const ingresosMensuales = await prisma.ingreso.findMany({
      where: {
        idestado: 1,
        fecha: { gte: fechaInicio },
      },
      select: {
        idclienteprov: true,
        importe: true,
        fecha: true,
      },
      orderBy: { fecha: "asc" },
    });

    // Agregamos nombres también para los ingresos mensuales
    const idsClientesMensuales = [
      ...new Set(ingresosMensuales.map((c) => c.idclienteprov)),
    ];

    const clientesMensualesInfo = await prisma.clienteProv.findMany({
      where: { idclienteprov: { in: idsClientesMensuales } },
      select: { idclienteprov: true, razonsocial: true },
    });

    const ingresosMensualesConNombres = ingresosMensuales.map((i) => ({
      ...i,
      razonsocial:
        clientesMensualesInfo.find((c) => c.idclienteprov === i.idclienteprov)
          ?.razonsocial || "Desconocido",
    }));

    // 🥧 3. Distribución porcentual de ingresos por cliente
    const distribucionIngresos = await prisma.ingreso.groupBy({
      by: ["idclienteprov"],
      _sum: { importe: true },
      where: { idestado: 1 },
    });

    const totalIngresos = distribucionIngresos.reduce(
      (acc, curr) => acc + (curr._sum.importe || 0),
      0
    );

    const clientesDistribucionInfo = await prisma.clienteProv.findMany({
      where: {
        idclienteprov: {
          in: distribucionIngresos.map((c) => c.idclienteprov),
        },
      },
      select: { idclienteprov: true, razonsocial: true },
    });

    const distribucionPorcentual = distribucionIngresos.map((cliente) => ({
      idclienteprov: cliente.idclienteprov,
      razonsocial:
        clientesDistribucionInfo.find(
          (i) => i.idclienteprov === cliente.idclienteprov
        )?.razonsocial || "Desconocido",
      total: cliente._sum.importe || 0,
      porcentaje:
        totalIngresos > 0
          ? ((cliente._sum.importe || 0) / totalIngresos) * 100
          : 0,
    }));

    // ✅ 4. Enviar todo en un solo JSON
    res.json({
      top10Clientes: top10ConNombres,
      ingresosMensuales: ingresosMensualesConNombres,
      distribucionIngresos: distribucionPorcentual,
    });
  } catch (error) {
    console.error("Error en getClientesGraficos:", error);
    handleHttpError(res, "ERROR_GET_CLIENTES_GRAFICOS", 500);
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
    const { modo = "fecha", anio, idperiodo } = req.query;

    // 📅 Validación básica
    if (!anio) {
      return res.status(400).json({ error: "Debe enviar el parámetro 'anio'" });
    }

    const y = parseInt(anio);
    const m = idperiodo ? parseInt(idperiodo) - 1 : null;
    const currentDate = new Date();

    // 🧩 Filtros base
    let whereActual = { idestado: 1 };
    let whereAnterior = { idestado: 1 };
    let whereAnual = { idestado: 1 };

    if (modo === "periodo") {
      // 🔸 Filtro por año y periodo (idperiodo = mes 1-12)
      whereActual.anio = y;
      whereAnual.anio = y;

      if (idperiodo) {
        whereActual.idperiodo = parseInt(idperiodo);
        whereAnterior = {
          idestado: 1,
          anio: y,
          idperiodo: parseInt(idperiodo) - 1 > 0 ? parseInt(idperiodo) - 1 : 12,
        };
      } else {
        whereAnterior = { idestado: 1, anio: y - 1 };
      }
    } else {
      // 🔹 Filtro por fecha (modo = "fecha")
      if (idperiodo) {
        // Si se especifica mes
        const fechaInicio = new Date(y, m, 1);
        const fechaFin = new Date(y, m + 1, 0, 23, 59, 59, 999);
        const fechaInicioPrev = new Date(y, m - 1, 1);
        const fechaFinPrev = new Date(y, m, 0, 23, 59, 59, 999);

        whereActual.fecha = { gte: fechaInicio, lte: fechaFin };
        whereAnterior.fecha = { gte: fechaInicioPrev, lte: fechaFinPrev };
        whereAnual.fecha = { gte: new Date(y, 0, 1), lte: new Date(y, 11, 31) };
      } else {
        // Año completo
        const fechaInicio = new Date(y, 0, 1);
        const fechaFin = new Date(y, 11, 31, 23, 59, 59, 999);
        const fechaInicioPrev = new Date(y - 1, 0, 1);
        const fechaFinPrev = new Date(y - 1, 11, 31, 23, 59, 59, 999);

        whereActual.fecha = { gte: fechaInicio, lte: fechaFin };
        whereAnterior.fecha = { gte: fechaInicioPrev, lte: fechaFinPrev };
        whereAnual.fecha = { gte: fechaInicio, lte: fechaFin };
      }
    }

    // 🧮 Consultas paralelas
    const [
      ingresosActual,
      salidasActual,
      ingresosAnterior,
      salidasAnterior,
      ingresosAnual,
      salidasAnual,
      ingresosTotales,
      salidasTotales,
    ] = await Promise.all([
      prisma.ingreso.aggregate({ _sum: { importe: true }, where: whereActual }),
      prisma.salida.aggregate({ _sum: { importe: true }, where: whereActual }),
      prisma.ingreso.aggregate({
        _sum: { importe: true },
        where: whereAnterior,
      }),
      prisma.salida.aggregate({
        _sum: { importe: true },
        where: whereAnterior,
      }),
      prisma.ingreso.aggregate({ _sum: { importe: true }, where: whereAnual }),
      prisma.salida.aggregate({ _sum: { importe: true }, where: whereAnual }),
      prisma.ingreso.aggregate({
        _sum: { importe: true },
        where: { idestado: 1 },
      }),
      prisma.salida.aggregate({
        _sum: { importe: true },
        where: { idestado: 1 },
      }),
    ]);

    // 💰 Cálculos base
    const ingresoAct = ingresosActual._sum.importe || 0;
    const salidaAct = salidasActual._sum.importe || 0;
    const ingresoAnt = ingresosAnterior._sum.importe || 0;
    const salidaAnt = salidasAnterior._sum.importe || 0;

    const saldoActual = ingresoAct - salidaAct;
    const saldoAnterior = ingresoAnt - salidaAnt;
    const totalIngresos = ingresosTotales._sum.importe || 0;
    const totalSalidas = salidasTotales._sum.importe || 0;
    const cajaAcumuladaAnual =
      (ingresosAnual._sum.importe || 0) - (salidasAnual._sum.importe || 0);

    // 📈 Crecimientos y ratios
    const crecimientoIngresos =
      ingresoAnt !== 0 ? ((ingresoAct - ingresoAnt) / ingresoAnt) * 100 : 0;
    const crecimientoSalidas =
      salidaAnt !== 0 ? ((salidaAct - salidaAnt) / salidaAnt) * 100 : 0;
    const crecimientoNeto =
      saldoAnterior !== 0
        ? ((saldoActual - saldoAnterior) / Math.abs(saldoAnterior)) * 100
        : 0;

    // ⚙️ Promedio diario o eficiencia
    const dias = idperiodo
      ? new Date(y, parseInt(idperiodo), 0).getDate()
      : 365;
    const promedioDiario = saldoActual / dias;

    // 📤 Respuesta formateada (coherente con gráficos)
    res.json({
      modo,
      parametros: { anio: y, idperiodo },
      totales: {
        label: "Caja total actual",
        value: (totalIngresos - totalSalidas).toFixed(2),
      },
      periodoActual: {
        ingresos: { label: "Ingresos", value: ingresoAct },
        salidas: { label: "Salidas", value: salidaAct },
        saldo: { label: "Saldo", value: saldoActual },
        rentabilidad: {
          label: "Rentabilidad (%)",
          value:
            ingresoAct > 0
              ? ((saldoActual / ingresoAct) * 100).toFixed(2)
              : "0.00",
        },
        promedioDiario: {
          label: "Promedio Diario",
          value: promedioDiario.toFixed(2),
        },
      },
      crecimiento: [
        { label: "Ingresos", value: crecimientoIngresos.toFixed(2) },
        { label: "Salidas", value: crecimientoSalidas.toFixed(2) },
        { label: "Saldo Neto", value: crecimientoNeto.toFixed(2) },
      ],
      cajaAcumuladaAnual: {
        label: "Caja Acumulada Anual",
        value: cajaAcumuladaAnual.toFixed(2),
      },
    });
  } catch (error) {
    console.error("❌ Error en getCajaKPIs:", error);
    handleHttpError(res, "ERROR_GET_CAJA_KPIS", 500);
  }
};
/************************
 * | **Campo / Sección**            | **Qué representa**                           | **Gráfico sugerido**                   |
| ------------------------------ | -------------------------------------------- | -------------------------------------- |
| `totales`                      | Caja total (ingresos - salidas global)       | 💰 KPI numérico                        |
| `periodoActual`                | Ingresos, salidas y saldo del periodo actual | 📊 Barras o 📈 Línea                   |
| `periodoActual.rentabilidad`   | % utilidad neta sobre ingresos               | 📟 KPI circular o gauge                |
| `periodoActual.promedioDiario` | Saldo promedio por día                       | 📟 KPI numérico                        |
| `crecimiento`                  | Comparación con periodo anterior             | 📊 Barras o 🔼🔽 Indicadores de cambio |
| `cajaAcumuladaAnual`           | Resultado total acumulado del año            | 📈 Línea de tendencia o 📊 Barras      |

 */




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
      label: item.fecha.toISOString(), // también puedes usar .split("T")[0] si quieres solo la fecha
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
