const prisma = require("../config/database");

const estadoService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const estados = await prisma.estado.findMany({
      skip,
      take: limit,
      select: {
        idestado: true,
        nom_estado: true,
      },
    });

    const total = await prisma.estado.count();
    return { estados, total };
  },

  // Obtener un registro por su ID
  async getById(idestado) {
    return await prisma.estado.findUnique({
      where: { idestado },
      select: {
        idestado: true,
        nom_estado: true,
        // ingreso: true, // Relación con Ingreso
        // salida: true, // Relación con Salida
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.estado.create({
      data,
      select: {
        idestado: true,
        nom_estado: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(idestado, data) {
    const estado = await prisma.estado.findUnique({
      where: { idestado },
    });
    if (!estado) return null;

    return await prisma.estado.update({
      where: { idestado },
      data,
      select: {
        idestado: true,
        nom_estado: true,
      },
    });
  },

  // Eliminar un registro
  async delete(idestado) {
    const estado = await prisma.estado.findUnique({
      where: { idestado },
    });
    if (!estado) return null;

    return await prisma.estado.delete({ where: { idestado } });
  },
};

module.exports = estadoService;
