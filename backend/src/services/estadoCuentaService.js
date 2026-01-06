const prisma = require("../config/database");

const estadoCuentaService = {
  // Obtener transacciones (ingresos y salidas) por cliente y año
  async getByClientAndYear(idclienteprov, year) {
    // Obtener ingresos del cliente para el año especificado
    const ingresos = await prisma.ingreso.findMany({
      where: {
        idclienteprov: idclienteprov,
        anio: year,
        idestado: 1, // Solo estados válidos/pagados
      },
      select: {
        idingreso: true,
        fecha: true,
        idtipo_op: true,
        idtipo_doc: true,
        serie_doc: true,
        num_doc: true,
        idclienteprov: true,
        idconcepto: true,
        idperiodo: true,
        anio: true,
        importe: true,
        idestado: true,
        observacion: true,
        registra: true,
        codcaja_m: true,
        cliente_prov: {
          select: {
            idclienteprov: true,
            razonsocial: true,
          },
        },
        concepto: {
          select: {
            idconcepto: true,
            nombre_concepto: true,
          },
        },
        periodo: {
          select: {
            idperiodo: true,
            nom_periodo: true,
          },
        },
        tipo_doc: {
          select: {
            idtipo_doc: true,
            descripcion: true,
          },
        },
        tipo_op: {
          select: {
            idtipo_op: true,
            nombre_op: true,
          },
        },
        estado: {
          select: {
            idestado: true,
            nom_estado: true,
          },
        },
        caja_mes: {
          select: {
            codcaja_m: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    });

    // Obtener salidas del cliente para el año especificado
    const salidas = await prisma.salida.findMany({
      where: {
        idclienteprov: idclienteprov,
        anio: year,
        idestado: 1, // Solo estados válidos/pagados
      },
      select: {
        idsalida: true,
        fecha: true,
        idtipo_op: true,
        idtipo_doc: true,
        serie_doc: true,
        num_doc: true,
        idclienteprov: true,
        idconcepto: true,
        idperiodo: true,
        anio: true,
        importe: true,
        idestado: true,
        observacion: true,
        registra: true,
        codcaja_m: true,
        cliente_prov: {
          select: {
            idclienteprov: true,
            razonsocial: true,
          },
        },
        concepto: {
          select: {
            idconcepto: true,
            nombre_concepto: true,
          },
        },
        periodo: {
          select: {
            idperiodo: true,
            nom_periodo: true,
          },
        },
        tipo_doc: {
          select: {
            idtipo_doc: true,
            descripcion: true,
          },
        },
        tipo_op: {
          select: {
            idtipo_op: true,
            nombre_op: true,
          },
        },
        estado: {
          select: {
            idestado: true,
            nom_estado: true,
          },
        },
        caja_mes: {
          select: {
            codcaja_m: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    });

    // Transformar ingresos y salidas a un formato común
    const transacciones = [
      ...ingresos.map((ingreso) => ({
        id: ingreso.idingreso,
        tipo: "INGRESO",
        fecha: ingreso.fecha,
        tipo_pago: ingreso.tipo_op?.nombre_op || "",
        id_cliente: ingreso.idclienteprov,
        razon_social: ingreso.cliente_prov?.razonsocial || "",
        concepto: ingreso.concepto?.nombre_concepto || "",
        periodo: ingreso.periodo?.nom_periodo || "",
        anio: ingreso.anio,
        importe: ingreso.importe || 0,
        estado: ingreso.estado?.nom_estado || "",
        idestado: ingreso.idestado,
        observacion: ingreso.observacion || "",
        registra: ingreso.registra || "",
        caja: ingreso.caja_mes?.codcaja_m || "",
      })),
      ...salidas.map((salida) => ({
        id: salida.idsalida,
        tipo: "SALIDA",
        fecha: salida.fecha,
        tipo_pago: salida.tipo_op?.nombre_op || "",
        id_cliente: salida.idclienteprov,
        razon_social: salida.cliente_prov?.razonsocial || "",
        concepto: salida.concepto?.nombre_concepto || "",
        periodo: salida.periodo?.nom_periodo || "",
        anio: salida.anio,
        importe: salida.importe || 0,
        estado: salida.estado?.nom_estado || "",
        idestado: salida.idestado,
        observacion: salida.observacion || "",
        registra: salida.registra || "",
        caja: salida.caja_mes?.codcaja_m || "",
      })),
    ];

    // Ordenar por fecha descendente
    transacciones.sort((a, b) => {
      const fechaA = a.fecha ? new Date(a.fecha) : new Date(0);
      const fechaB = b.fecha ? new Date(b.fecha) : new Date(0);
      return fechaB - fechaA;
    });

    // Calcular total anual (ingresos - salidas)
    const totalIngresos = ingresos.reduce(
      (sum, ing) => sum + (ing.importe || 0),
      0
    );
    const totalSalidas = salidas.reduce(
      (sum, sal) => sum + (sal.importe || 0),
      0
    );
    const totalAnual = totalIngresos - totalSalidas;

    return {
      transacciones,
      totalIngresos,
      totalSalidas,
      totalAnual,
      cliente: ingresos[0]?.cliente_prov || salidas[0]?.cliente_prov || null,
    };
  },
};

module.exports = estadoCuentaService;

