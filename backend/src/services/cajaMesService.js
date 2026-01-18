const prisma = require("../config/database");

const cajaMesService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const cajasMensuales = await prisma.cajaMes.findMany({
      skip,
      take: limit,
      select: {
        nro: true,
        codcaja_m: true,
        fecha_apertura: true,
        monto_inicial_m: true,
        ingreso_mes: true,
        salida_mes: true,
        saldo_mes: true,
        fechacierre: true,
        codcaja_a: true,
        registra: true,
        estado_c_m: true,
        caja_anual: true, // Relación con CajaAnual
      },
      orderBy: {
        nro: "desc",
      },
    });

    const total = await prisma.cajaMes.count();
    return { cajasMensuales, total };
  },

  // Obtener un registro por su código
  async getByCod(codcaja_m) {
    return await prisma.cajaMes.findUnique({
      where: { codcaja_m },
      select: {
        codcaja_m: true,
        fecha_apertura: true,
        monto_inicial_m: true,
        ingreso_mes: true,
        salida_mes: true,
        saldo_mes: true,
        fechacierre: true,
        codcaja_a: true,
        registra: true,
        estado_c_m: true,
        caja_anual: true, // Relación con CajaAnual
        ingreso: true, // Relación con Ingreso
        salida: true, // Relación con Salida
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    // Calcular el siguiente número secuencial (nro)
    const lastRecord = await prisma.cajaMes.findFirst({
      orderBy: { nro: 'desc' },
      select: { nro: true }
    });
    const nextNro = (lastRecord?.nro || 0) + 1;

    return await prisma.cajaMes.create({
      data: { ...data, nro: nextNro, fecha_apertura: new Date() },
      select: {
        codcaja_m: true,
        fecha_apertura: true,
        monto_inicial_m: true,
        ingreso_mes: true,
        salida_mes: true,
        saldo_mes: true,
        fechacierre: true,
        codcaja_a: true,
        registra: true,
        estado_c_m: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(codcaja_m, data) {
    const cajaMes = await prisma.cajaMes.findUnique({
      where: { codcaja_m },
    });
    if (!cajaMes) return null;

    return await prisma.cajaMes.update({
      where: { codcaja_m },
      data,
      select: {
        codcaja_m: true,
        fecha_apertura: true,
        monto_inicial_m: true,
        ingreso_mes: true,
        salida_mes: true,
        saldo_mes: true,
        fechacierre: true,
        codcaja_a: true,
        registra: true,
        estado_c_m: true,
      },
    });
  },

  // Eliminar un registro
  async delete(codcaja_m) {
    const cajaMes = await prisma.cajaMes.findUnique({
      where: { codcaja_m },
    });
    if (!cajaMes) return null;

    return await prisma.cajaMes.delete({ where: { codcaja_m } });
  },

  // Cerrar caja
  async closeCaja(codcaja_m) {
    const caja = await prisma.cajaMes.findUnique({ where: { codcaja_m } });
    if (!caja) throw new Error("Caja Mensual no encontrada");

    // Sumar ingresos (idestado=1)
    const ingresos = await prisma.ingreso.aggregate({
      _sum: { importe: true },
      where: {
        codcaja_m: codcaja_m,
        idestado: 1
      }
    });

    // Sumar salidas (idestado=1)
    const salidas = await prisma.salida.aggregate({
      _sum: { importe: true },
      where: {
        codcaja_m: codcaja_m,
        idestado: 1
      }
    });

    const totalIngresos = ingresos._sum.importe || 0;
    const totalSalidas = salidas._sum.importe || 0;
    const saldo = (caja.monto_inicial_m || 0) + totalIngresos - totalSalidas;

    return await prisma.cajaMes.update({
      where: { codcaja_m },
      data: {
        ingreso_mes: totalIngresos,
        salida_mes: totalSalidas,
        saldo_mes: saldo,
        estado_c_m: "CERRADO",
        fechacierre: new Date(),
      },
    });
  },

  // Helper to parse "MMMYYYY"
  parseMonthCode(code) {
    const monthMap = { 'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5, 'JUL': 6, 'AGO': 7, 'SET': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11 };
    const monthStr = code.substring(0, 3);
    const yearStr = code.substring(3);
    const month = monthMap[monthStr];
    const year = parseInt(yearStr);
    return { month, year, valid: month !== undefined && !isNaN(year) };
  },

  // Obtener saldo del último registro cerrado
  async getLastBalance() {
    const lastCaja = await prisma.cajaMes.findFirst({
      where: {
        estado_c_m: "CERRADO"
      },
      orderBy: {
        nro: 'desc'
      }
    });

    return { saldo: lastCaja ? lastCaja.saldo_mes : 0 };
  }
};

module.exports = cajaMesService;
