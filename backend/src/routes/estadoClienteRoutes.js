const express = require("express");
const estadoClienteController = require("../controllers/estadoClienteController");

const router = express.Router();

router.get("/", estadoClienteController.getAll); // Obtener todos con paginación
router.get("/:id", estadoClienteController.getById); // Obtener por ID
router.post("/", estadoClienteController.create); // Crear un nuevo registro
router.put("/:id", estadoClienteController.update); // Actualizar un registro
router.delete("/:id", estadoClienteController.delete); // Eliminar un registro

module.exports = router;
