const prisma = require("../config/database");

const egresosClienteService = {
  // Obtener egresos (salidas) por cliente y año
  async getByClientAndYear(idclienteprov, year) {
    // Obtener salidas del cliente para el año especificado
    const salidas = await prisma.salida.findMany({
      where: {
        idclienteprov: idclienteprov,
        anio: year,
        idestado: { not: 2 }, // Excluir anulados
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

    // Transformar salidas a un formato común
    const transacciones = salidas.map((salida) => ({
      id: salida.idsalida,
      tipo: "EGRESO",
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
    }));

    // Ordenar por fecha descendente
    transacciones.sort((a, b) => {
      const fechaA = a.fecha ? new Date(a.fecha) : new Date(0);
      const fechaB = b.fecha ? new Date(b.fecha) : new Date(0);
      return fechaB - fechaA;
    });

    // Calcular total anual de egresos
    const totalEgresos = salidas.reduce(
      (sum, sal) => sum + (sal.importe || 0),
      0
    );

    return {
      transacciones,
      totalEgresos,
      cliente: salidas[0]?.cliente_prov || null,
    };
  },
};

module.exports = egresosClienteService;

