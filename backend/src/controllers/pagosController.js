const pagosService = require("../services/pagosService");

const pagosController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { pagos, total } = await pagosService.getAll(skip, limit);

      res.json({
        pagos,
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
      const pago = await pagosService.getById(parseInt(req.params.id));
      if (!pago) {
        return res.status(404).json({ message: "Pago no encontrado" });
      }
      res.json(pago);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getByTributo(req, res) {
    try {
      const pagos = await pagosService.getByTributo(
        parseInt(req.params.idtributos)
      );
      res.json(pagos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const pago = await pagosService.create(req.body);
      res.status(201).json(pago);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const pago = await pagosService.update(parseInt(req.params.id), req.body);
      if (!pago) {
        return res.status(404).json({ message: "Pago no encontrado" });
      }
      res.json(pago);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await pagosService.delete(parseInt(req.params.id));
      if (!result) {
        return res.status(404).json({ message: "Pago no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = pagosController;
