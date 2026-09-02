const prisma = require("../config/database");

const mapIngreso = (ingreso) => ({
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
});

const mapSalida = (salida) => ({
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
});

const transaccionSelect = {
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
};

const estadoCuentaService = {
  // tipo: "INGRESO" | "SALIDA" | undefined (ambos)
  async getByClientAndYear(idclienteprov, year, tipo) {
    const whereBase = {
      idclienteprov,
      anio: year,
      idestado: { not: 2 },
    };

    const incluirIngresos = !tipo || tipo === "INGRESO";
    const incluirSalidas = !tipo || tipo === "SALIDA";

    let ingresos = [];
    let salidas = [];

    if (incluirIngresos) {
      ingresos = await prisma.ingreso.findMany({
        where: whereBase,
        select: {
          idingreso: true,
          ...transaccionSelect,
        },
        orderBy: { fecha: "desc" },
      });
    }

    if (incluirSalidas) {
      salidas = await prisma.salida.findMany({
        where: whereBase,
        select: {
          idsalida: true,
          ...transaccionSelect,
        },
        orderBy: { fecha: "desc" },
      });
    }

    const transacciones = [
      ...ingresos.map(mapIngreso),
      ...salidas.map(mapSalida),
    ];

    transacciones.sort((a, b) => {
      const fechaA = a.fecha ? new Date(a.fecha) : new Date(0);
      const fechaB = b.fecha ? new Date(b.fecha) : new Date(0);
      return fechaB - fechaA;
    });

    const totalIngresos = ingresos.reduce(
      (sum, ing) => sum + (ing.importe || 0),
      0
    );
    const totalSalidas = salidas.reduce(
      (sum, sal) => sum + (sal.importe || 0),
      0
    );

    let cliente =
      ingresos[0]?.cliente_prov || salidas[0]?.cliente_prov || null;

    if (!cliente) {
      cliente = await prisma.clienteProv.findUnique({
        where: { idclienteprov },
        select: { idclienteprov: true, razonsocial: true },
      });
    }

    const payload = {
      transacciones,
      totalIngresos,
      totalSalidas,
      cliente,
    };

    if (!tipo || (incluirIngresos && incluirSalidas)) {
      payload.totalAnual = totalIngresos - totalSalidas;
    } else if (tipo === "INGRESO") {
      payload.totalAnual = totalIngresos;
    } else if (tipo === "SALIDA") {
      payload.totalAnual = totalSalidas;
      payload.totalEgresos = totalSalidas;
    }

    return payload;
  },
};

module.exports = estadoCuentaService;
