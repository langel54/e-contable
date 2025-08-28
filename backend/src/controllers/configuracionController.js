const configuracionService = require("../services/configuracionService");

const configuracionController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { configuraciones, total } = await configuracionService.getAll(
        skip,
        limit
      );

      res.json({
        configuraciones,
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

  async getCurrentConfig(req, res) {
    try {
      const config = await configuracionService.getCurrentConfig();
      if (!config) {
        return res.status(404).json({ message: "No hay configuración activa" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const config = await configuracionService.getById(
        parseInt(req.params.id)
      );
      if (!config) {
        return res.status(404).json({ message: "Configuración no encontrada" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      // Validar los valores de IGV y TIM
      if (req.body.igv < 0 || req.body.tim < 0) {
        return res
          .status(400)
          .json({ message: "IGV y TIM deben ser valores positivos" });
      }

      const config = await configuracionService.create(req.body);
      res.status(201).json(config);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      // Validar los valores de IGV y TIM si se están actualizando
      if (
        (req.body.igv !== undefined && req.body.igv < 0) ||
        (req.body.tim !== undefined && req.body.tim < 0)
      ) {
        return res
          .status(400)
          .json({ message: "IGV y TIM deben ser valores positivos" });
      }

      const config = await configuracionService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!config) {
        return res.status(404).json({ message: "Configuración no encontrada" });
      }
      res.json(config);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await configuracionService.delete(parseInt(req.params.id));
      if (!result) {
        return res.status(404).json({ message: "Configuración no encontrada" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = configuracionController;
