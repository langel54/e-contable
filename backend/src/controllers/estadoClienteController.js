const estadoClienteService = require("../services/estadoClienteService");

const estadoClienteController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    const { skip = 0, limit = 10 } = req.query;
    try {
      const { estadoClientes, total } = await estadoClienteService.getAll(
        Number(skip),
        Number(limit)
      );
      res.status(200).json({ estadoClientes, total });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener los estados de cliente" });
    }
  },

  // Obtener un registro por su ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const estadoCliente = await estadoClienteService.getById(Number(id));
      if (!estadoCliente) {
        return res.status(404).json({ error: "Estado Cliente no encontrado" });
      }
      res.status(200).json(estadoCliente);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el estado de cliente" });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    const { descripcion } = req.body;
    try {
      const newEstadoCliente = await estadoClienteService.create({
        descripcion,
      });
      res.status(201).json(newEstadoCliente);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el estado de cliente" });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { id } = req.params;
    const { descripcion } = req.body;
    try {
      const updatedEstadoCliente = await estadoClienteService.update(
        Number(id),
        { descripcion }
      );
      if (!updatedEstadoCliente) {
        return res.status(404).json({ error: "Estado Cliente no encontrado" });
      }
      res.status(200).json(updatedEstadoCliente);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al actualizar el estado de cliente" });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedEstadoCliente = await estadoClienteService.delete(
        Number(id)
      );
      if (!deletedEstadoCliente) {
        return res.status(404).json({ error: "Estado Cliente no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el estado de cliente" });
    }
  },
};

module.exports = estadoClienteController;
