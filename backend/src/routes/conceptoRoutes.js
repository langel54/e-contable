const express = require("express");
const conceptoController = require("../controllers/conceptoController");

const router = express.Router();

// Rutas CRUD para Concepto
router.get("/", conceptoController.getAll); // Obtener todos los registros
router.get("/:id", conceptoController.getById); // Obtener un registro por ID
router.post("/", conceptoController.create); // Crear un nuevo registro
router.put("/:id", conceptoController.update); // Actualizar un registro existente
router.delete("/:id", conceptoController.delete); // Eliminar un registro

module.exports = router;
