const prisma = require("../config/database");

const periodoService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const periodos = await prisma.periodo.findMany({
      // skip,
      // take: limit,
      select: {
        idperiodo: true,
        nom_periodo: true,
        // ingreso: true, // Relación con Ingreso
        // salida: true, // Relación con Salida
      },
    });

    const total = await prisma.periodo.count();
    return { periodos, total };
  },

  // Obtener un registro por su ID
  async getById(id) {
    return await prisma.periodo.findUnique({
      where: { idperiodo: id },
      select: {
        idperiodo: true,
        nom_periodo: true,
        ingreso: true, // Relación con Ingreso
        salida: true, // Relación con Salida
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.periodo.create({
      data,
      select: {
        idperiodo: true,
        nom_periodo: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(id, data) {
    const periodo = await prisma.periodo.findUnique({
      where: { idperiodo: id },
    });
    if (!periodo) return null;

    return await prisma.periodo.update({
      where: { idperiodo: id },
      data,
      select: {
        idperiodo: true,
        nom_periodo: true,
      },
    });
  },

  // Eliminar un registro
  async delete(id) {
    const periodo = await prisma.periodo.findUnique({
      where: { idperiodo: id },
    });
    if (!periodo) return null;

    return await prisma.periodo.delete({ where: { idperiodo: id } });
  },
};

module.exports = periodoService;
