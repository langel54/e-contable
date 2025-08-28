const tributosService = require("../services/tributosService");

const tributosController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { tributos, total } = await tributosService.getAll(skip, limit);

      res.json({
        tributos,
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
      const tributo = await tributosService.getById(parseInt(req.params.id));
      if (!tributo) {
        return res.status(404).json({ message: "Tributo no encontrado" });
      }
      res.json(tributo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getByCliente(req, res) {
    try {
      const tributos = await tributosService.getByCliente(
        req.params.idclienteprov
      );
      res.json(tributos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const tributo = await tributosService.create(req.body);
      res.status(201).json(tributo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const tributo = await tributosService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!tributo) {
        return res.status(404).json({ message: "Tributo no encontrado" });
      }
      res.json(tributo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await tributosService.delete(parseInt(req.params.id));
      if (!result) {
        return res.status(404).json({ message: "Tributo no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = tributosController;
