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
      } = req.query;
      const skip = (page - 1) * limit;

      const { clientesProvs, total } = await clienteProvService.getAllFilter(
        skip,
        limit,
        digito,
        regimen,
        status,
        planilla
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
};

module.exports = clienteProvController;
