const prisma = require("../config/database");

const facturadorService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const facturadores = await prisma.facturador.findMany({
      skip,
      take: limit,
      select: {
        idfacturador: true,
        n_facturador: true,
        f_obs: true,
        // cliente_prov: true, // Incluye datos relacionados con ClienteProv
      },
    });

    const total = await prisma.facturador.count();
    return { facturadores, total };
  },

  // Obtener un registro por su ID
  async getById(id) {
    return await prisma.facturador.findUnique({
      where: { idfacturador: id },
      select: {
        idfacturador: true,
        n_facturador: true,
        f_obs: true,
        cliente_prov: true, // Incluye datos relacionados con ClienteProv
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.facturador.create({
      data,
      select: {
        idfacturador: true,
        n_facturador: true,
        f_obs: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(id, data) {
    const facturador = await prisma.facturador.findUnique({
      where: { idfacturador: id },
    });
    if (!facturador) return null;

    return await prisma.facturador.update({
      where: { idfacturador: id },
      data,
      select: {
        idfacturador: true,
        n_facturador: true,
        f_obs: true,
      },
    });
  },

  // Eliminar un registro
  async delete(id) {
    const facturador = await prisma.facturador.findUnique({
      where: { idfacturador: id },
    });
    if (!facturador) return null;

    return await prisma.facturador.delete({ where: { idfacturador: id } });
  },
};

module.exports = facturadorService;
