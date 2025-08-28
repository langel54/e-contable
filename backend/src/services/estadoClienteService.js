const prisma = require("../config/database");

const estadoClienteService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const estadoClientes = await prisma.estadoCliente.findMany({
      // skip,
      // take: limit,
      select: {
        idestadocliente: true,
        descripcion: true,
      },
    });

    const total = await prisma.estadoCliente.count();
    return { estadoClientes, total };
  },

  // Obtener un registro por su ID
  async getById(idestadocliente) {
    return await prisma.estadoCliente.findUnique({
      where: { idestadocliente },
      select: {
        idestadocliente: true,
        descripcion: true,
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.estadoCliente.create({
      data,
      select: {
        idestadocliente: true,
        descripcion: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(idestadocliente, data) {
    const estadoCliente = await prisma.estadoCliente.findUnique({
      where: { idestadocliente },
    });
    if (!estadoCliente) return null;

    return await prisma.estadoCliente.update({
      where: { idestadocliente },
      data,
      select: {
        idestadocliente: true,
        descripcion: true,
      },
    });
  },

  // Eliminar un registro
  async delete(idestadocliente) {
    const estadoCliente = await prisma.estadoCliente.findUnique({
      where: { idestadocliente },
    });
    if (!estadoCliente) return null;

    return await prisma.estadoCliente.delete({
      where: { idestadocliente },
    });
  },
};

module.exports = estadoClienteService;
