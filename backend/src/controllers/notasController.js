const notasService = require("../services/notasService");

const notasController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { notas, total } = await notasService.getAll(skip, Number(limit));

      res.json({
        notas,
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
    const { idnotas } = req.params;
    try {
      const nota = await notasService.getById(Number(idnotas));
      if (!nota) {
        return res.status(404).json({ message: "Nota no encontrada" });
      }
      res.json(nota);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    try {
      const nuevaNota = await notasService.create(req.body);
      res.status(201).json(nuevaNota);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { idnotas } = req.params;
    try {
      const notaActualizada = await notasService.update(
        Number(idnotas),
        req.body
      );
      if (!notaActualizada) {
        return res.status(404).json({ message: "Nota no encontrada" });
      }
      res.json(notaActualizada);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { idnotas } = req.params;
    try {
      const deleted = await notasService.delete(Number(idnotas));
      if (!deleted) {
        return res.status(404).json({ message: "Nota no encontrada" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = notasController;
