const express = require("express");
const tipoUsuarioController = require("../controllers/tipoUsuarioController");

const router = express.Router();

// Rutas CRUD para TipoUsuario
router.get("/", tipoUsuarioController.getAll); // Obtener todos los registros
router.get("/:id", tipoUsuarioController.getById); // Obtener un registro por ID
router.post("/", tipoUsuarioController.create); // Crear un nuevo registro
router.put("/:id", tipoUsuarioController.update); // Actualizar un registro existente
router.delete("/:id", tipoUsuarioController.delete); // Eliminar un registro

module.exports = router;
