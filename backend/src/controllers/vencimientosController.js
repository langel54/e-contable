const vencimientosService = require("../services/vencimientosService");

const vencimientosController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { vencimientos, total } = await vencimientosService.getAll(
        skip,
        limit
      );

      res.json({
        vencimientos,
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
      const vencimiento = await vencimientosService.getById(
        parseInt(req.params.id)
      );
      if (!vencimiento) {
        return res.status(404).json({ message: "Vencimiento no encontrado" });
      }
      res.json(vencimiento);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getByPeriodo(req, res) {
    try {
      const { anio, mes } = req.params;
      const vencimiento = await vencimientosService.getByPeriodo(anio, mes);
      if (!vencimiento) {
        return res.status(404).json({
          message: "Vencimiento no encontrado para el periodo especificado",
        });
      }
      res.json(vencimiento);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const validationError = await vencimientosService.validateDates(req.body);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      const vencimiento = await vencimientosService.create(req.body);
      res.status(201).json(vencimiento);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const validationError = await vencimientosService.validateDates(req.body);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      const vencimiento = await vencimientosService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!vencimiento) {
        return res.status(404).json({ message: "Vencimiento no encontrado" });
      }
      res.json(vencimiento);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await vencimientosService.delete(parseInt(req.params.id));
      if (!result) {
        return res.status(404).json({ message: "Vencimiento no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = vencimientosController;
