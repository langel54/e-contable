const prisma = require("../config/database");

const ingresoService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit, startDate, endDate, concept, period, year, status) {
    const whereConditions = {
      AND: [],
    };

    if (startDate && endDate) {
      whereConditions.AND.push({
        fecha: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      });
    }
    if (concept) {
      whereConditions.AND.push({ idconcepto: concept });
    }
    if (period && year) {
      whereConditions.AND.push({
        idperiodo: period,
        anio: year,
      });
    }
    if (status) {
      whereConditions.AND.push({
        idestado: status,
      });
    }

    const ingresos = await prisma.ingreso.findMany({
      skip,
      take: limit,

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
          select: { idclienteprov: true, razonsocial: true },
        },
        concepto: {
          select: { idconcepto: true, nombre_concepto: true },
        },
        periodo: {
          select: { idperiodo: true, nom_periodo: true },
        },
        tipo_doc: {
          select: { idtipo_doc: true, descripcion: true },
        },
        tipo_op: {
          select: { idtipo_op: true, nombre_op: true },
        },
        estado: {
          select: { idestado: true, nom_estado: true },
        },
        caja_mes: {
          select: { codcaja_m: true, saldo_mes: true },
        },
      },
      where: whereConditions,
      orderBy: {
        idingreso: "desc",
      },
    });

    const total = await prisma.ingreso.count({ where: whereConditions });
    return { ingresos, total };
  },

  // Obtener un registro por su ID
  async getById(idingreso) {
    const ingreso = await prisma.ingreso.findUnique({
      where: { idingreso },
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
          select: { idclienteprov: true, razonsocial: true },
        },
        concepto: true,
        periodo: true,
        tipo_doc: true,
        tipo_op: true,
        estado: true,
        caja_mes: true,
      },
    });
    if (!ingreso) {
      const error = new Error("Ingreso no encontrado");
      error.type = "not_found";
      throw error;
    }
    return ingreso;
  },

  // Crear un nuevo registro
  async create(data) {
    // Validación de campos obligatorios
    if (!data.idclienteprov) {
      const error = new Error("El campo 'idclienteprov' es obligatorio.");
      error.type = "validation";
      throw error;
    }
    if (!data.idconcepto) {
      const error = new Error("El campo 'idconcepto' es obligatorio.");
      error.type = "validation";
      throw error;
    }
    if (!data.anio) {
      const error = new Error("El campo 'anio' es obligatorio.");
      error.type = "validation";
      throw error;
    }
    if (!data.importe) {
      const error = new Error("El campo 'importe' es obligatorio.");
      error.type = "validation";
      throw error;
    }
    return await prisma.ingreso.create({
      data,
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
          select: { idclienteprov: true, razonsocial: true },
        },
      },
    });
  },

  // Actualizar un registro existente
  async update(idingreso, data) {
    const ingreso = await prisma.ingreso.findUnique({ where: { idingreso } });
    if (!ingreso) {
      const error = new Error("Ingreso no encontrado");
      error.type = "not_found";
      throw error;
    }
    return await prisma.ingreso.update({
      where: { idingreso },
      data: {
        fecha: data.fecha,
        idtipo_op: data.idtipo_op,
        idtipo_doc: data.idtipo_doc,
        serie_doc: data.serie_doc,
        num_doc: data.num_doc,
        idclienteprov: data.idclienteprov,
        idconcepto: data.idconcepto,
        idperiodo: data.idperiodo,
        anio: data.anio,
        importe: data.importe,
        idestado: data.idestado,
        observacion: data.observacion,
        registra: data.registra,
        codcaja_m: data.codcaja_m,
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
          select: { idclienteprov: true, razonsocial: true },
        },
      },
    });
  },

  // Eliminar un registro
  async delete(idingreso) {
    const ingreso = await prisma.ingreso.findUnique({ where: { idingreso } });
    if (!ingreso) {
      const error = new Error("Ingreso no encontrado");
      error.type = "not_found";
      throw error;
    }
    return await prisma.ingreso.update({
      where: { idingreso },
      data: { estado: { connect: { idestado: 2 } } },
    });
  },

  // Reporte Anual
  async getAnnualReport(year) {
    const ingresos = await prisma.ingreso.findMany({
      where: {
        anio: year,
        idestado: 1, // Strictly status 1 (CANCELADO/PAGADO)
      },
      select: {
        idingreso: true,
        idperiodo: true,
        importe: true,
        idclienteprov: true,
        cliente_prov: {
          select: { razonsocial: true },
        },
      },
    });

    const reportMap = new Map();

    ingresos.forEach((ingreso) => {
      const { idclienteprov, idperiodo, importe, cliente_prov } = ingreso;

      if (!reportMap.has(idclienteprov)) {
        reportMap.set(idclienteprov, {
          id: idclienteprov,
          razon_social: cliente_prov?.razonsocial || "Sin Nombre",
          cant_pagos: 0,
          ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0,
          jul: 0, ago: 0, set: 0, oct: 0, nov: 0, dic: 0,
          anual: 0
        });
      }

      const clientData = reportMap.get(idclienteprov);
      clientData.cant_pagos += 1;
      clientData.anual += importe || 0;

      // Mapping idperiodo to month fields (Assuming 1-12)
      const monthMap = {
        1: 'ene', 2: 'feb', 3: 'mar', 4: 'abr', 5: 'may', 6: 'jun',
        7: 'jul', 8: 'ago', 9: 'set', 10: 'oct', 11: 'nov', 12: 'dic'
      };

      const monthKey = monthMap[idperiodo];
      if (monthKey) {
        clientData[monthKey] += importe || 0;
      }
    });

    return Array.from(reportMap.values());
  },
};

module.exports = ingresoService;
