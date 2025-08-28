const tipoUsuarioService = require("../services/tipoUsuarioServices");

const tipoUsuarioController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { tiposUsuario, total } = await tipoUsuarioService.getAll(
        skip,
        Number(limit)
      );

      res.json({
        tiposUsuario,
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
      const tipoUsuario = await tipoUsuarioService.getById(Number(id));

      if (!tipoUsuario) {
        return res.status(404).json({ message: "TipoUsuario no encontrado" });
      }

      res.json(tipoUsuario);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const { descripcion } = req.body;

      const newTipoUsuario = await tipoUsuarioService.create({ descripcion });

      res.status(201).json(newTipoUsuario);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { descripcion } = req.body;

      const updatedTipoUsuario = await tipoUsuarioService.update(Number(id), {
        descripcion,
      });

      if (!updatedTipoUsuario) {
        return res.status(404).json({ message: "TipoUsuario no encontrado" });
      }

      res.json(updatedTipoUsuario);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deletedTipoUsuario = await tipoUsuarioService.delete(Number(id));

      if (!deletedTipoUsuario) {
        return res.status(404).json({ message: "TipoUsuario no encontrado" });
      }

      res.json({ message: "TipoUsuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = tipoUsuarioController;
