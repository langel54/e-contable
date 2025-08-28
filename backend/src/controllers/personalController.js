const personalService = require("../services/personalServices");

const personalController = {
  // Obtener todos los registros
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { personals, total } = await personalService.getAllPersonals(
        skip,
        limit
      );

      res.json({
        personals,
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

  // Obtener un registro por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const personal = await personalService.getPersonalById(Number(id));

      if (!personal) {
        return res.status(404).json({ message: "Personal no encontrado" });
      }

      res.json(personal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    try {
      const { nombres, apellidos, direccion, telefono, personalcol } = req.body;
      const newPersonal = await personalService.createPersonal({
        nombres,
        apellidos,
        direccion,
        telefono,
        personalcol,
      });

      res.status(201).json(newPersonal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombres, apellidos, direccion, telefono, personalcol } = req.body;

      const updatedPersonal = await personalService.updatePersonal(Number(id), {
        nombres,
        apellidos,
        direccion,
        telefono,
        personalcol,
      });

      if (!updatedPersonal) {
        return res.status(404).json({ message: "Personal no encontrado" });
      }

      res.json(updatedPersonal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedPersonal = await personalService.deletePersonal(Number(id));

      if (!deletedPersonal) {
        return res.status(404).json({ message: "Personal no encontrado" });
      }

      res.json({ message: "Personal eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = personalController;
