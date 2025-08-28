const prisma = require("../config/database");

const tipoOperacionService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const tiposOperacion = await prisma.tipoOperacion.findMany({
      // skip,
      // take: limit,
      select: {
        idtipo_op: true,
        nombre_op: true,
      },
    });

    const total = await prisma.tipoOperacion.count();
    return { tiposOperacion, total };
  },

  // Obtener un registro por su ID
  async getById(idtipo_op) {
    return await prisma.tipoOperacion.findUnique({
      where: { idtipo_op },
      select: {
        idtipo_op: true,
        nombre_op: true,
        // ingreso: true, // Relación con Ingreso
        // salida: true, // Relación con Salida
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.tipoOperacion.create({
      data,
      select: {
        idtipo_op: true,
        nombre_op: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(idtipo_op, data) {
    const tipoOperacion = await prisma.tipoOperacion.findUnique({
      where: { idtipo_op },
    });
    if (!tipoOperacion) return null;

    return await prisma.tipoOperacion.update({
      where: { idtipo_op },
      data,
      select: {
        idtipo_op: true,
        nombre_op: true,
      },
    });
  },

  // Eliminar un registro
  async delete(idtipo_op) {
    const tipoOperacion = await prisma.tipoOperacion.findUnique({
      where: { idtipo_op },
    });
    if (!tipoOperacion) return null;

    return await prisma.tipoOperacion.delete({ where: { idtipo_op } });
  },
};

module.exports = tipoOperacionService;
