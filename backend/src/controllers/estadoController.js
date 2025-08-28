const estadoService = require("../services/estadoService");

const estadoController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { estados, total } = await estadoService.getAll(
        skip,
        Number(limit)
      );

      res.json({
        estados,
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

  // Obtener un registro por su ID
  async getById(req, res) {
    const { idestado } = req.params;
    try {
      const estado = await estadoService.getById(Number(idestado));
      if (!estado) {
        return res.status(404).json({ message: "Estado no encontrado" });
      }
      res.json(estado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    try {
      const nuevoEstado = await estadoService.create(req.body);
      res.status(201).json(nuevoEstado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { idestado } = req.params;
    try {
      const estadoActualizado = await estadoService.update(
        Number(idestado),
        req.body
      );
      if (!estadoActualizado) {
        return res.status(404).json({ message: "Estado no encontrado" });
      }
      res.json(estadoActualizado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { idestado } = req.params;
    try {
      const deleted = await estadoService.delete(Number(idestado));
      if (!deleted) {
        return res.status(404).json({ message: "Estado no encontrado" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = estadoController;
