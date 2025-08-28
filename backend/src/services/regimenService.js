const prisma = require("../config/database");

const regimenService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const regimenes = await prisma.regimen.findMany({
      skip,
      take: limit,
      select: {
        nregimen: true,
        idregimen: true,
        cliente_prov: true, // Incluye los datos relacionados con ClienteProv
      },
    });

    const total = await prisma.regimen.count();
    return { regimenes, total };
  },

  // Obtener un registro por su ID
  async getById(id) {
    return await prisma.regimen.findUnique({
      where: { nregimen: id },
      select: {
        nregimen: true,
        idregimen: true,
        cliente_prov: true, // Incluye los datos relacionados con ClienteProv
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.regimen.create({
      data,
      select: {
        nregimen: true,
        idregimen: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(id, data) {
    const regimen = await prisma.regimen.findUnique({
      where: { nregimen: id },
    });
    if (!regimen) return null;

    return await prisma.regimen.update({
      where: { nregimen: id },
      data,
      select: {
        nregimen: true,
        idregimen: true,
      },
    });
  },

  // Eliminar un registro
  async delete(id) {
    const regimen = await prisma.regimen.findUnique({
      where: { nregimen: id },
    });
    if (!regimen) return null;

    return await prisma.regimen.delete({ where: { nregimen: id } });
  },
};

module.exports = regimenService;
