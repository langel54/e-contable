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
  async getAllFilter(skip, limit, digito, regimen, status, planilla, search = "") {
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

    // Add search conditions if search term is provided
    if (search) {
      whereConditions.AND.push({
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
    const cliente = await prisma.clienteProv.findUnique({
      where: { idclienteprov: id },
      include: {
        regimen: true,
        rubro: true,
        facturador: true,
      },
    });
    if (!cliente) {
      const error = new Error("Cliente/Proveedor no encontrado");
      error.type = "not_found";
      throw error;
    }
    return cliente;
  },

  async create(data) {
    // Validación de campos obligatorios
    if (!data.ruc) {
      const error = new Error("El campo 'ruc' es obligatorio.");
      error.type = "validation";
      throw error;
    }
    if (!data.u_digito) {
      const error = new Error("El campo 'u_digito' es obligatorio.");
      error.type = "validation";
      throw error;
    }

    // Verificar si ya existe un cliente con el mismo RUC
    const existingClient = await prisma.clienteProv.findFirst({
      where: {
        ruc: data.ruc,
      },
    });
    if (existingClient) {
      const idEstadoNum = parseInt(existingClient.estado, 10);
      const estadoData =
        !Number.isNaN(idEstadoNum) &&
        (await prisma.estado.findFirst({
          where: { idestado: idEstadoNum },
        }));
      const error = new Error(`Ya existe un cliente con el RUC ${data.ruc}. ID: ${existingClient.idclienteprov}, Razón Social: ${existingClient.razonsocial}, Estado: ${estadoData?.nom_estado || existingClient.estado || "Desconocido"}`);
      error.type = "duplicate";
      throw error;
    }

    // Obtener el último número de 'nro' en la base de datos
    const lastNro = await prisma.clienteProv.findFirst({
      orderBy: { nro: "desc" },
    });
    const nextNro = lastNro ? lastNro.nro + 1 : 1;

    // Filtrar registros por `u_digito` y obtener el mayor número asociado
    const lastRecord = await prisma.clienteProv.findFirst({
      where: {
        idclienteprov: {
          startsWith: `${data.u_digito}-`,
        },
      },
      orderBy: { idclienteprov: "desc" },
    });

    // Extraer el número actual del último ID
    const lastNumber = lastRecord
      ? parseInt(lastRecord.idclienteprov.split("-")[1], 10)
      : 0;

    // Generar el nuevo ID
    const newId = `${data.u_digito}-${String(lastNumber + 1).padStart(3, "0")}`;

    // Solo usar nrubro/nregimen si existen (evitar FK)
    const nrubroVal = data.nrubro && String(data.nrubro).trim();
    const nregimenVal = data.nregimen && String(data.nregimen).trim();
    const [rubroExists, regimenExists] = await Promise.all([
      nrubroVal ? prisma.rubro.findUnique({ where: { nrubro: nrubroVal } }).then((r) => !!r) : Promise.resolve(false),
      nregimenVal ? prisma.regimen.findUnique({ where: { nregimen: nregimenVal } }).then((r) => !!r) : Promise.resolve(false),
    ]);

    const montorefNum =
      data.montoref != null && data.montoref !== "" ? parseFloat(data.montoref) : null;

    const newData = {
      ...data,
      nro: nextNro,
      idclienteprov: newId,
      declarado: data.declarado ?? "0",
      dni: data.dni?.toString(),
      idfacturador: data.idfacturador ?? 3,
      estado: data.estado ?? "1",
      f_usuario: data.f_usuario ?? "-",
      f_pass: data.f_pass ?? "",
      telefono: data.telefono != null && data.telefono !== "" ? parseInt(data.telefono, 10) : null,
      nrubro: rubroExists ? nrubroVal : null,
      nregimen: regimenExists ? nregimenVal : null,
      montoref: Number.isNaN(montorefNum) ? null : montorefNum,
    };

    return prisma.clienteProv.create({
      data: newData,
    });
  },

  async update(id, data) {
    // Validar existencia
    const cliente = await prisma.clienteProv.findUnique({ where: { idclienteprov: id } });
    if (!cliente) {
      const error = new Error("Cliente/Proveedor no encontrado");
      error.type = "not_found";
      throw error;
    }
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
    // Validar existencia
    const cliente = await prisma.clienteProv.findUnique({ where: { idclienteprov: id } });
    if (!cliente) {
      const error = new Error("Cliente/Proveedor no encontrado");
      error.type = "not_found";
      throw error;
    }
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
  async bulkCreate(clientsData) {
    return prisma.$transaction(async (tx) => {
      const results = [];
      const errors = [];

      // Obtener el último 'nro' global una vez y llevar cuenta manual para el lote
      const lastNroRecord = await tx.clienteProv.findFirst({
        orderBy: { nro: "desc" },
      });
      let currentNro = lastNroRecord ? lastNroRecord.nro : 0;

      // Valores válidos para FK: nrubro y nregimen deben existir en sus tablas
      const [rubros, regimenes] = await Promise.all([
        tx.rubro.findMany({ select: { nrubro: true } }),
        tx.regimen.findMany({ select: { nregimen: true } }),
      ]);
      const validNrubro = new Set(rubros.map((r) => r.nrubro));
      const validNregimen = new Set(regimenes.map((r) => r.nregimen));

      // Mapa para rastrear el último número por dígito en este lote
      const lastNumbersByDigit = {};

      for (let idx = 0; idx < clientsData.length; idx++) {
        const data = clientsData[idx];
        try {
          // Normalizar a string y trim; Excel puede enviar número o string, y celdas vacías como "" o null
          const rucStr = data.ruc != null ? String(data.ruc).trim() : "";
          const digitoStr = data.u_digito != null ? String(data.u_digito).trim() : "";
          if (!rucStr || !digitoStr) {
            throw new Error(
              `Registro ${idx + 1}: faltan RUC o Último Dígito (RUC: "${rucStr || "(vacío)"}", Último dígito: "${digitoStr || "(vacío)"}"). Revise el Excel o la vista previa.`
            );
          }

          // Clave del mapa siempre string (evita 9 vs "9")
          const digit = digitoStr;
          if (!digit) {
            throw new Error(`Último Dígito inválido para RUC ${data.ruc}.`);
          }

          // Verificar duplicados en la BD (dentro de la transacción)
          const existing = await tx.clienteProv.findFirst({
            where: { ruc: rucStr },
          });

          if (existing) {
            throw new Error(`El RUC ${rucStr} ya existe (ID: ${existing.idclienteprov}).`);
          }

          // Generar ID correlativo por dígito (una sola clave string evita duplicados de PRIMARY)
          if (lastNumbersByDigit[digit] === undefined) {
            const lastRecord = await tx.clienteProv.findFirst({
              where: { idclienteprov: { startsWith: `${digit}-` } },
              orderBy: { idclienteprov: "desc" },
            });
            lastNumbersByDigit[digit] = lastRecord
              ? parseInt(lastRecord.idclienteprov.split("-")[1], 10)
              : 0;
          }

          lastNumbersByDigit[digit]++;
          currentNro++;

          let newId = `${digit}-${String(lastNumbersByDigit[digit]).padStart(3, "0")}`;
          // Evitar colisión con IDs ya creados en este lote (p. ej. por duplicados en el Excel)
          while (results.some((r) => r.idclienteprov === newId)) {
            lastNumbersByDigit[digit]++;
            newId = `${digit}-${String(lastNumbersByDigit[digit]).padStart(3, "0")}`;
          }

          // Solo usar nrubro/nregimen si existen en sus tablas (evitar violación de FK)
          const nrubro = data.nrubro && validNrubro.has(String(data.nrubro).trim()) ? String(data.nrubro).trim() : null;
          const nregimen = data.nregimen && validNregimen.has(String(data.nregimen).trim()) ? String(data.nregimen).trim() : null;
          const montorefNum = data.montoref != null && data.montoref !== "" ? parseFloat(data.montoref) : null;

          // Campos requeridos por Prisma sin valor en Excel: valores por defecto (ruc y u_digito ya normalizados)
          const newClient = await tx.clienteProv.create({
            data: {
              ...data,
              ruc: rucStr,
              u_digito: digit,
              idclienteprov: newId,
              nro: currentNro,
              declarado: data.declarado ?? "0",
              dni: data.dni?.toString(),
              idfacturador: data.idfacturador ?? 3, // Por defecto Soluciones Contables
              estado: data.estado ?? "1",
              f_usuario: data.f_usuario ?? "BULK",   // Usuario de carga masiva
              f_pass: data.f_pass ?? "",             // Clave no aplicable en carga masiva
              telefono: data.telefono != null && data.telefono !== ""
                ? parseInt(data.telefono, 10)
                : null,
              montoref: Number.isNaN(montorefNum) ? null : montorefNum,
              nrubro,
              nregimen,
            },
          });

          results.push(newClient);
        } catch (err) {
          errors.push({ ruc: rucStr, error: err.message });
          // Si queremos que falle todda la transacción ante un error, lanzamos error aquí.
          // Por simplicidad y seguridad de datos, lanzaremos error para que no se cree nada si hay fallos.
          throw err;
        }
      }

      return {
        success: true,
        count: results.length,
        items: results,
      };
    });
  },

  /**
   * Para cargas muy grandes (ej. 1000+): recibe todo el array y lo procesa en lotes
   * internos de BATCH_SIZE. Una sola petición HTTP, menos timeouts y mejor para el cliente.
   */
  async bulkCreateLarge(clientsData, internalBatchSize = 100) {
    if (!clientsData || clientsData.length === 0) {
      return { success: true, count: 0, items: [] };
    }
    let totalCreated = 0;
    const allItems = [];
    for (let i = 0; i < clientsData.length; i += internalBatchSize) {
      const batch = clientsData.slice(i, i + internalBatchSize);
      const result = await this.bulkCreate(batch);
      if (result.success) {
        totalCreated += result.count;
        if (result.items && result.items.length) allItems.push(...result.items);
      }
    }
    return { success: true, count: totalCreated, items: allItems };
  },
};

module.exports = clienteProvService;
