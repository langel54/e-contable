const prisma = require("../config/database");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};
const userService = {
  // Obtener usuarios con paginación
  async getAllUsers(skip, limit, search) {
    // Usamos el término de búsqueda tanto para 'usuario' como para 'nombres' en la relación 'personal'
    const users = await prisma.usuario.findMany({
      skip,
      take: limit,
      where: {
        OR: [
          // Usamos OR para que la búsqueda pueda aplicarse a 'usuario' o a 'nombres' de la relación 'personal'
          {
            usuario: {
              contains: search,
              // mode: "insensitive", // Sin distinguir entre mayúsculas/minúsculas
            },
          },
          {
            personal: {
              nombres: {
                contains: search,
              },
            },
          },
        ],
      },
      select: {
        id_usuario: true,
        usuario: true,
        id_personal: true,
        id_tipo: true,
        personal: {
          select: {
            nombres: true,
            apellidos: true,
            direccion: true,
            telefono: true,
          },
        },
        tipo_usuario: {
          select: {
            descripcion: true,
          },
        },
      },
      orderBy: {
        id_usuario: "desc", // Ordenar por ID de usuario ascendente
      },
    });

    // Contar los usuarios que coinciden con el término de búsqueda
    const total = await prisma.usuario.count({
      where: {
        OR: [
          {
            usuario: {
              contains: search,
              // mode: "insensitive",
            },
          },
          {
            personal: {
              nombres: {
                contains: search,
              },
            },
          },
        ],
      },
    });

    return { users, total };
  },

  async getUserById(id) {
    return await prisma.usuario.findUnique({
      where: { id_usuario: Number(id) },
      select: {
        id_usuario: true,
        usuario: true,
        id_personal: true,
        id_tipo: true,
        personal: {
          select: {
            nombres: true,
            apellidos: true,
            direccion: true,
            telefono: true,
          },
        },
        tipo_usuario: {
          select: {
            descripcion: true,
          },
        },
      },
    });
  },

  // Crear un nuevo usuario
  async createUser(data) {
    const {
      nombres,
      apellidos,
      direccion,
      telefono,
      usuario,
      password,
      id_tipo,
    } = data;

    return prisma.$transaction(async (tx) => {
      const existingUser = await tx.usuario.findUnique({
        where: { usuario },
      });

      if (existingUser) {
        throw new Error("El nombre de usuario ya está en uso");
      }
      // Crear registro en Personal
      const personal = await tx.personal.create({
        data: {
          nombres,
          apellidos,
          direccion,
          telefono,
        },
      });

      // Crear registro en Usuario
      const newUser = await tx.usuario.create({
        data: {
          usuario,
          password: await hashPassword(password),
          id_personal: personal.id_personal,
          id_tipo: parseInt(id_tipo),
        },
      });

      return { personal, usuario: newUser };
    });
  },
  async updateUser(id, data) {
    const {
      nombres,
      apellidos,
      direccion,
      telefono,
      usuario,
      password,
      id_tipo,
    } = data;

    return prisma.$transaction(async (tx) => {
      const currentUser = await tx.usuario.findUnique({
        where: { id_usuario: Number(id) },
        include: { personal: true },
      });
      if (!currentUser) {
        return { message: "No exite el usuario", status: 500 };
      } else if (currentUser.usuario !== usuario) {
        const existingUser = await tx.usuario.findUnique({
          where: { usuario },
        });

        if (existingUser) {
          return { message: "Usuario ya esta siendo usado", status: 501 };
        }
      }

      // Actualizar personal
      await tx.personal.update({
        where: { id_personal: currentUser.id_personal },
        data: {
          nombres,
          apellidos,
          direccion,
          telefono,
        },
      });

      // Actualizar usuario
      await tx.usuario.update({
        where: { id_usuario: Number(id) },
        data: {
          usuario,
          ...(password && { password: await hashPassword(password) }), // Solo actualiza la contraseña si se proporciona
          id_tipo: parseInt(id_tipo),
        },
        include: {
          personal: true,
          tipo_usuario: true,
        },
      });

      return { message: "Actualizado con exito", status: 201 };
    });
  },
  async deleteUser(id) {
    const existingUser = await prisma.usuario.findUnique({
      where: { id_usuario: Number(id) },
    });

    if (!existingUser) {
      return { message: "No exite el usuario", status: 500 };
    }

    return await prisma.usuario.delete({
      where: { id_usuario: Number(id) },
    });
  },
};

module.exports = userService;
