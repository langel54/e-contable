const express = require("express");
const notasController = require("../controllers/notasController");
const router = express.Router();

// Rutas para el modelo Notas
router.get("/", notasController.getAll);
router.get("/:idnotas", notasController.getById);
router.post("/", notasController.create);
router.put("/:idnotas", notasController.update);
router.delete("/:idnotas", notasController.delete);

module.exports = router;
