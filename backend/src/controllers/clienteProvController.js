const clienteProvService = require("../services/clienteProvService");

const clienteProvController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search = "", status = "1" } = req.query;
      const skip = (page - 1) * limit;

      const { clientesProvs, total } = await clienteProvService.getAll(
        skip,
        limit,
        search,
        status
      );

      res.json({
        clientesProvs,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async getAllFilter(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        digito = "",
        regimen = "",
        status = "1",
        planilla = false,
        search = "",
      } = req.query;
      const skip = (page - 1) * limit;

      const { clientesProvs, total } = await clienteProvService.getAllFilter(
        skip,
        limit,
        digito,
        regimen,
        status,
        planilla,
        search
      );

      res.json({
        clientesProvs,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const clienteProv = await clienteProvService.getById(req.params.id);
      res.json(clienteProv);
    } catch (error) {
      if (error.type === "not_found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const clienteProv = await clienteProvService.create(req.body);
      res.status(201).json(clienteProv);
    } catch (error) {
      if (error.type === "validation") {
        return res.status(400).json({ message: error.message });
      }
      if (error.type === "duplicate") {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const clienteProv = await clienteProvService.update(
        req.params.id,
        req.body
      );
      res.json(clienteProv);
    } catch (error) {
      if (error.type === "not_found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.type === "validation") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await clienteProvService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.type === "not_found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },
  async validateRucController(req, res) {
    const { ruc } = req.params;
    const { action, idclienteprov } = req.query;

    try {
      const result = await clienteProvService.validateRuc(
        ruc,
        action,
        idclienteprov
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateDeclaradoController(req, res) {
    try {
      const { declarado } = req.body; // Recibe el estado nuevo desde el cuerpo de la solicitud
      const result = await clienteProvService.updateDeclarado(declarado);
      res.status(200).json({
        message: 'Estado de "declarado" actualizado correctamente',
        result,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async bulkCreate(req, res) {
    try {
      const payload = Array.isArray(req.body) ? req.body : req.body?.data ?? [];
      if (payload.length === 0) {
        return res.status(400).json({ message: "Se requiere un array de registros." });
      }
      const MAX_PER_REQUEST = 15;
      if (payload.length > MAX_PER_REQUEST) {
        return res.status(400).json({
          message: `Máximo ${MAX_PER_REQUEST} registros por petición. Envíe lotes más pequeños.`,
        });
      }
      console.log("[bulk] Registros:", payload.length);
      const result = await clienteProvService.bulkCreate(payload);
      console.log("[bulk] Creados:", result.count);
      res.status(201).json(result);
    } catch (error) {
      const msg = error?.message || String(error) || "Error interno en carga masiva";
      console.error("[bulk] Error:", msg);
      res.status(500).json({ message: msg });
    }
  },
  async bulkCreateLarge(req, res) {
    try {
      const payload = Array.isArray(req.body) ? req.body : req.body?.data ?? [];
      if (payload.length === 0) {
        return res.status(400).json({ message: "Se requiere un array de registros." });
      }
      console.log("[bulk-large] Registros:", payload.length);
      const result = await clienteProvService.bulkCreateLarge(payload);
      console.log("[bulk-large] Creados:", result.count);
      res.status(201).json(result);
    } catch (error) {
      const msg = error?.message || String(error) || "Error interno";
      console.error("[bulk-large] Error:", msg);
      res.status(500).json({ message: msg });
    }
  },
};

module.exports = clienteProvController;
