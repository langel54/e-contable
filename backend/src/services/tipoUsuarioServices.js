const prisma = require("../config/database");

const tipoUsuarioService = {
  async getAll(skip, limit) {
    const tiposUsuario = await prisma.tipoUsuario.findMany({
      skip,
      take: limit,
      select: {
        id_tipo: true,
        descripcion: true,
        usuario: {
          select: {
            id_usuario: true,
            usuario: true,
          },
        },
      },
    });

    const total = await prisma.tipoUsuario.count();
    return { tiposUsuario, total };
  },

  async getById(id) {
    return await prisma.tipoUsuario.findUnique({
      where: { id_tipo: id },
      select: {
        id_tipo: true,
        descripcion: true,
        usuario: {
          select: {
            id_usuario: true,
            usuario: true,
          },
        },
      },
    });
  },

  async create(data) {
    return await prisma.tipoUsuario.create({
      data,
      select: {
        id_tipo: true,
        descripcion: true,
      },
    });
  },

  async update(id, data) {
    const tipoUsuario = await prisma.tipoUsuario.findUnique({
      where: { id_tipo: id },
    });
    if (!tipoUsuario) return null;

    return await prisma.tipoUsuario.update({
      where: { id_tipo: id },
      data,
      select: {
        id_tipo: true,
        descripcion: true,
      },
    });
  },

  async delete(id) {
    const tipoUsuario = await prisma.tipoUsuario.findUnique({
      where: { id_tipo: id },
    });
    if (!tipoUsuario) return null;

    return await prisma.tipoUsuario.delete({ where: { id_tipo: id } });
  },
};

module.exports = tipoUsuarioService;
