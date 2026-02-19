const prisma = require("../config/database");

const notasService = {
  // Obtener todos los registros con paginación y filtros
  async getAll(skip, limit, filters = {}) {
    const where = {};

    // Filtro por cliente
    if (filters.cliente) {
      where.idclienteprov = filters.cliente;
    }

    // Filtro por rango de fechas
    if (filters.fechaInicio || filters.fechaFin) {
      where.n_fecha = {};
      if (filters.fechaInicio) {
        where.n_fecha.gte = new Date(filters.fechaInicio);
      }
      if (filters.fechaFin) {
        const fechaFin = new Date(filters.fechaFin);
        fechaFin.setHours(23, 59, 59, 999);
        where.n_fecha.lte = fechaFin;
      }
    }

    // Búsqueda en contenido
    if (filters.search) {
      where.OR = [
        { contenido: { contains: filters.search, mode: "insensitive" } },
        { ncreador: { contains: filters.search, mode: "insensitive" } },
        { neditor: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const notas = await prisma.notas.findMany({
      skip,
      take: limit,
      where,
      orderBy: { n_fecha: "desc" },
      select: {
        idnotas: true,
        n_fecha: true,
        idclienteprov: true,
        contenido: true,
        fecha_ed: true,
        ncreador: true,
        neditor: true,
      },
    });

    // Obtener los clientes relacionados manualmente
    const clienteIds = [
      ...new Set(notas.map((n) => n.idclienteprov).filter(Boolean)),
    ];
    const clientes = await prisma.clienteProv.findMany({
      where: {
        idclienteprov: { in: clienteIds },
      },
      select: {
        idclienteprov: true,
        razonsocial: true,
        ruc: true,
      },
    });

    // Mapear clientes a un objeto para acceso rápido
    const clientesMap = {};
    clientes.forEach((cliente) => {
      clientesMap[cliente.idclienteprov] = cliente;
    });

    // Agregar la información del cliente a cada nota
    const notasConCliente = notas.map((nota) => ({
      ...nota,
      cliente_prov: nota.idclienteprov
        ? clientesMap[nota.idclienteprov] || null
        : null,
    }));

    const total = await prisma.notas.count({ where });
    return { notas: notasConCliente, total };
  },

  // Obtener un registro por su ID
  async getById(idnotas) {
    const nota = await prisma.notas.findUnique({
      where: { idnotas },
      select: {
        idnotas: true,
        n_fecha: true,
        idclienteprov: true,
        contenido: true,
        fecha_ed: true,
        ncreador: true,
        neditor: true,
      },
    });

    if (!nota) {
      const error = new Error("Nota no encontrada");
      error.type = "not_found";
      throw error;
    }
    // Obtener el cliente si existe
    if (nota.idclienteprov) {
      const cliente = await prisma.clienteProv.findUnique({
        where: { idclienteprov: nota.idclienteprov },
        select: {
          idclienteprov: true,
          razonsocial: true,
          ruc: true,
        },
      });
      nota.cliente_prov = cliente;
    }

    return nota;
  },

  // Crear un nuevo registro
  async create(data) {
    if (!data.contenido || !data.ncreador) {
      const error = new Error(
        "El contenido y el nombre del creador son obligatorios."
      );
      error.type = "validation";
      throw error;
    }
    if (!data.idclienteprov) {
      const error = new Error("El cliente es obligatorio.");
      error.type = "validation";
      throw error;
    }
    const now = new Date();
    const nota = await prisma.notas.create({
      data: {
        idclienteprov: data.idclienteprov,
        contenido: data.contenido,
        ncreador: data.ncreador,
        n_fecha: now,
        fecha_ed: now,
        neditor: data.ncreador,
      },
      select: {
        idnotas: true,
        n_fecha: true,
        idclienteprov: true,
        contenido: true,
        fecha_ed: true,
        ncreador: true,
        neditor: true,
      },
    });

    // Obtener el cliente
    if (nota.idclienteprov) {
      const cliente = await prisma.clienteProv.findUnique({
        where: { idclienteprov: nota.idclienteprov },
        select: {
          idclienteprov: true,
          razonsocial: true,
          ruc: true,
        },
      });
      nota.cliente_prov = cliente;
    }

    return nota;
  },

  // Actualizar un registro existente
  async update(idnotas, data) {
    const nota = await prisma.notas.findUnique({ where: { idnotas } });
    if (!nota) {
      const error = new Error("Nota no encontrada");
      error.type = "not_found";
      throw error;
    }
    if (!data.contenido || !data.neditor) {
      const error = new Error(
        "El contenido y el nombre del editor son obligatorios."
      );
      error.type = "validation";
      throw error;
    }

    const updateData = {
      contenido: data.contenido,
      fecha_ed: new Date(),
      neditor: data.neditor,
    };

    // Permitir cambiar el cliente si se proporciona
    if (data.idclienteprov) {
      updateData.idclienteprov = data.idclienteprov;
    }

    const notaActualizada = await prisma.notas.update({
      where: { idnotas },
      data: updateData,
      select: {
        idnotas: true,
        n_fecha: true,
        idclienteprov: true,
        contenido: true,
        fecha_ed: true,
        ncreador: true,
        neditor: true,
      },
    });

    // Obtener el cliente
    if (notaActualizada.idclienteprov) {
      const cliente = await prisma.clienteProv.findUnique({
        where: { idclienteprov: notaActualizada.idclienteprov },
        select: {
          idclienteprov: true,
          razonsocial: true,
          ruc: true,
        },
      });
      notaActualizada.cliente_prov = cliente;
    }

    return notaActualizada;
  },

  // Eliminar un registro
  async delete(idnotas) {
    const nota = await prisma.notas.findUnique({ where: { idnotas } });
    if (!nota) {
      const error = new Error("Nota no encontrada");
      error.type = "not_found";
      throw error;
    }
    return await prisma.notas.delete({ where: { idnotas } });
  },
};

module.exports = notasService;
