const express = require("express");
const tipoTribController = require("../controllers/tipoTributoController");

const router = express.Router();

// Rutas CRUD para TipoTrib
router.get("/", tipoTribController.getAll); // Obtener todos los registros
router.get("/:id", tipoTribController.getById); // Obtener un registro por ID
router.post("/", tipoTribController.create); // Crear un nuevo registro
router.put("/:id", tipoTribController.update); // Actualizar un registro existente
router.delete("/:id", tipoTribController.delete); // Eliminar un registro

module.exports = router;
