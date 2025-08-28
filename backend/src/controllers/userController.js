const userService = require("../services/userService");

const userController = {
  // Obtener todos los usuarios
  async getAll(req, res) {
    console.log(req.pagination);
    try {
      const { page = 1, limit = 10, search = "" } = req.pagination || {};
      const skip = (page - 1) * limit;

      const { users, total } = await userService.getAllUsers(
        skip,
        limit,
        search
      );

      res.json({
        users,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtener usuario por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear nuevo usuario
  async create(req, res) {
    console.log(req.body);
    try {
      const {
        nombres,
        apellidos,
        direccion,
        telefono,
        usuario,
        password,
        id_tipo,
      } = req.body;

      // Validación básica (puedes personalizar o usar un middleware)
      if (!nombres || !apellidos || !usuario || !password || !id_tipo) {
        return res.status(400).json({
          error: "Todos los campos requeridos deben ser proporcionados",
        });
      }

      const result = await userService.createUser({
        nombres,
        apellidos,
        direccion,
        telefono,
        usuario,
        password,
        id_tipo,
      });

      res.status(201).json({
        message: "Personal y usuario creados exitosamente",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Ocurrió un error al crear el personal y usuario" });
    }
  },

  // Actualizar usuario
  async update(req, res) {
    console.log(req.body.personal);
    try {
      const { id } = req.params;
      const { usuario, password, id_personal, id_tipo } = req.body;
      const { nombres, apellidos, direccion, telefono } = req.body.personal;

      const updatedUser = await userService.updateUser(id, {
        usuario,
        password,
        id_personal,
        id_tipo,
        nombres,
        apellidos,
        direccion,
        telefono,
      });

      res.status(201).json(updatedUser);
    } catch (error) {
      if (error.message === "El usuario no existe") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar usuario
  async delete(req, res) {
    try {
      const { id } = req.params;

      await userService.deleteUser(id);

      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      if (error.message === "Usuario no encontrado") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
