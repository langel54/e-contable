const tipoTribService = require("../services/tipoTributoService");

const tipoTribController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { tipoTribs, total } = await tipoTribService.getAll(
        skip,
        Number(limit)
      );

      res.json({
        tipoTribs,
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
      const { id } = req.params;
      const tipoTrib = await tipoTribService.getById(id);

      if (!tipoTrib) {
        return res.status(404).json({ message: "TipoTrib no encontrado" });
      }

      res.json(tipoTrib);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const { idtipo_trib, descripcion_t } = req.body;

      const newTipoTrib = await tipoTribService.create({
        idtipo_trib,
        descripcion_t,
      });

      res.status(201).json(newTipoTrib);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { descripcion_t } = req.body;

      const updatedTipoTrib = await tipoTribService.update(id, {
        descripcion_t,
      });

      if (!updatedTipoTrib) {
        return res.status(404).json({ message: "TipoTrib no encontrado" });
      }

      res.json(updatedTipoTrib);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deletedTipoTrib = await tipoTribService.delete(id);

      if (!deletedTipoTrib) {
        return res.status(404).json({ message: "TipoTrib no encontrado" });
      }

      res.json({ message: "TipoTrib eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = tipoTribController;
