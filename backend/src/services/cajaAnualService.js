const prisma = require("../config/database");

const cajaAnualService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const cajasAnuales = await prisma.cajaAnual.findMany({
      skip,
      take: limit,
      select: {
        codcaja_a: true,
        fecha_apertura: true,
        monto_inicial_a: true,
        ingreso_a: true,
        salida_a: true,
        saldo_a: true,
        fechacierre: true,
        registra: true,
        estado_c_a: true,
        caja_mes: true, // Relación con CajaMes
      },
      orderBy: {
        codcaja_a: "desc",
      },
    });

    const total = await prisma.cajaAnual.count();
    return { cajasAnuales, total };
  },

  // Obtener un registro por su código
  async getByCod(codcaja_a) {
    return await prisma.cajaAnual.findUnique({
      where: { codcaja_a },
      select: {
        codcaja_a: true,
        fecha_apertura: true,
        monto_inicial_a: true,
        ingreso_a: true,
        salida_a: true,
        saldo_a: true,
        fechacierre: true,
        registra: true,
        estado_c_a: true,
        caja_mes: true, // Relación con CajaMes
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    // Calcular el siguiente número secuencial (nro)
    const lastRecord = await prisma.cajaAnual.findFirst({
      orderBy: { nro: 'desc' },
      select: { nro: true }
    });
    const nextNro = (lastRecord?.nro || 0) + 1;

    return await prisma.cajaAnual.create({
      data: { ...data, nro: nextNro, fecha_apertura: new Date() },
      select: {
        codcaja_a: true,
        fecha_apertura: true,
        monto_inicial_a: true,
        ingreso_a: true,
        salida_a: true,
        saldo_a: true,
        fechacierre: true,
        registra: true,
        estado_c_a: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(codcaja_a, data) {
    const cajaAnual = await prisma.cajaAnual.findUnique({
      where: { codcaja_a },
    });
    if (!cajaAnual) return null;

    return await prisma.cajaAnual.update({
      where: { codcaja_a },
      data,
      select: {
        codcaja_a: true,
        fecha_apertura: true,
        monto_inicial_a: true,
        ingreso_a: true,
        salida_a: true,
        saldo_a: true,
        fechacierre: true,
        registra: true,
        estado_c_a: true,
      },
    });
  },

  // Eliminar un registro
  async delete(codcaja_a) {
    const cajaAnual = await prisma.cajaAnual.findUnique({
      where: { codcaja_a },
    });
    if (!cajaAnual) return null;

    return await prisma.cajaAnual.delete({ where: { codcaja_a } });
  },

  // Cerrar caja
  async closeCaja(codcaja_a) {
    const caja = await prisma.cajaAnual.findUnique({ where: { codcaja_a } });
    if (!caja) throw new Error("Caja no encontrada");

    // Sumar ingresos (idestado=1) vinculados a esta caja anual vía caja mensual
    const ingresos = await prisma.ingreso.aggregate({
      _sum: { importe: true },
      where: {
        caja_mes: {
          codcaja_a: codcaja_a
        },
        idestado: 1
      }
    });

    // Sumar salidas (idestado=1) vinculadas a esta caja anual vía caja mensual
    const salidas = await prisma.salida.aggregate({
      _sum: { importe: true },
      where: {
        caja_mes: {
          codcaja_a: codcaja_a
        },
        idestado: 1
      }
    });

    const totalIngresos = ingresos._sum.importe || 0;
    const totalSalidas = salidas._sum.importe || 0;
    const saldo = (caja.monto_inicial_a || 0) + totalIngresos - totalSalidas;

    return await prisma.cajaAnual.update({
      where: { codcaja_a },
      data: {
        ingreso_a: totalIngresos,
        salida_a: totalSalidas,
        saldo_a: saldo,
        estado_c_a: "CERRADO",
        fechacierre: new Date(),
      },
    });
  },

  // Obtener saldo de la caja anterior
  async getLastBalance() {
    // Obtener la última caja cerrada por número de registro
    const lastCaja = await prisma.cajaAnual.findFirst({
      where: {
        estado_c_a: "CERRADO"
      },
      orderBy: {
        nro: 'desc'
      }
    });

    return { saldo: lastCaja ? lastCaja.saldo_a : 0 };
  }
};

module.exports = cajaAnualService;
