const prisma = require("../config/database");

const clienteProvService = {
  async getAll(skip, limit, search, status) {
    const [clientesProvs, total] = await Promise.all([
      prisma.clienteProv.findMany({
        skip,
        take: Number(limit),
        where: {
          AND: [
            {
              OR: [
                {
                  razonsocial: {
                    contains: search,
                  },
                },
                {
                  ruc: {
                    contains: search,
                  },
                },
              ],
            },
            {
              estado: status,
            },
          ],
        },
        orderBy: {
          nro: "desc",
        },
      }),
      prisma.clienteProv.count({
        where: {
          AND: [
            {
              OR: [
                {
                  razonsocial: {
                    contains: search,
                  },
                },
                {
                  ruc: {
                    contains: search,
                  },
                },
              ],
            },
            {
              estado: status,
            },
          ],
        },
      }),
    ]);

    return { clientesProvs, total };
  },
  async getAllFilter(skip, limit, digito, regimen, status, planilla) {
    const whereConditions = {
      AND: [],
    };

    if (digito) {
      whereConditions.AND.push({ u_digito: digito });
    }

    if (regimen) {
      whereConditions.AND.push({ regimen: { nregimen: regimen } });
    }

    if (status) {
      whereConditions.AND.push({ estado: status });
    }
    if (planilla === "true") {
      whereConditions.AND.push({
        planilla_elect: "SI",
      });
    }
    const [clientesProvs, total] = await Promise.all([
      prisma.clienteProv.findMany({
        skip,
        take: Number(limit),
        where: whereConditions,
      }),
      prisma.clienteProv.count({
        where: whereConditions,
      }),
    ]);

    return { clientesProvs, total };
  },

  async getById(id) {
    return prisma.clienteProv.findUnique({
      where: { idclienteprov: id }, //0-000
      include: {
        regimen: true,
        rubro: true,
        facturador: true,
      },
    });
  },

  async create(data) {
    // Verificar si ya existe un cliente con el mismo RUC
    const existingClient = await prisma.clienteProv.findFirst({
      where: {
        ruc: data.ruc,
      },
    });

    // Si existe un cliente con el mismo RUC, lanzar error con los datos
    if (existingClient) {
      const estadoData = await prisma.estado.findFirst({
        where: { idestado: existingClient.estado },
      });
      throw new Error(`Ya existe un cliente con el RUC ${data.ruc}. 
        ID ClienteProv: ${existingClient.idclienteprov}, 
        Razón Social: ${existingClient.razonsocial}, 
        Estado: ${estadoData.descripcion}`);
    }

    // Obtener el último número de 'nro' en la base de datos
    const lastNro = await prisma.clienteProv.findFirst({
      orderBy: { nro: "desc" },
    });
    const nextNro = lastNro ? lastNro.nro + 1 : 1;

    if (!data.u_digito) {
      throw new Error("El campo 'u_digito' es obligatorio.");
    }

    // Filtrar registros por `u_digito` y obtener el mayor número asociado
    const lastRecord = await prisma.clienteProv.findFirst({
      where: {
        idclienteprov: {
          startsWith: `${data.u_digito}-`, // Buscar IDs que comiencen con el `u_digito`
        },
      },
      orderBy: { idclienteprov: "desc" }, // Ordenar por ID en orden descendente
    });

    // Extraer el número actual del último ID
    const lastNumber = lastRecord
      ? parseInt(lastRecord.idclienteprov.split("-")[1], 10) // Obtener la parte numérica después del "-"
      : 0;

    // Generar el nuevo ID
    const newId = `${data.u_digito}-${String(lastNumber + 1).padStart(3, "0")}`;

    const newData = {
      ...data,
      nro: nextNro,
      idclienteprov: newId,
      declarado: data.declarado ?? "0", // Si declarado no está definido, asignar 0
      dni: data.dni?.toString(),
    };

    return prisma.clienteProv.create({
      data: newData,
    });
  },

  async update(id, data) {
    return prisma.clienteProv.update({
      where: { idclienteprov: id },
      data,
      include: {
        regimen: true,
        rubro: true,
        facturador: true,
      },
    });
  },

  async delete(id) {
    return prisma.clienteProv.delete({
      where: { idclienteprov: id },
    });
  },

  async validateRuc(ruc, action, idclienteprov = null) {
    try {
      const whereClause =
        action === "update"
          ? { ruc, NOT: { idclienteprov } } // Evita validar contra el mismo registro
          : { ruc };

      const client = await prisma.clienteProv.findFirst({
        where: whereClause,
        select: {
          estado: true,
          razonsocial: true,
          idclienteprov: true,
        },
      });

      if (client) {
        return {
          exists: true,
          message: `Ya existe un cliente con el RUC ${ruc}.`,
          details: {
            idClienteProv: client.idclienteprov,
            razonSocial: client.razonsocial,
            estadoDescripcion: client.estado || "Sin descripción",
          },
        };
      }

      return { exists: false };
    } catch (error) {
      console.error("Error en validateRuc:", error);
      throw new Error("Error en la validación del RUC");
    }
  },

  async updateDeclarado(estado) {
    try {
      const updated = await prisma.clienteProv.updateMany({
        data: {
          declarado: estado,
        },
      });
      return updated;
    } catch (error) {
      throw new Error(
        "Error al actualizar el estado declarado: " + error.message
      );
    }
  },
};

module.exports = clienteProvService;
