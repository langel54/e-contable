const express = require("express");
const ingresoController = require("../controllers/ingresoController");
const router = express.Router();

// Rutas para el modelo Ingreso
router.get("/", ingresoController.getAll);
router.get("/:idingreso", ingresoController.getById);
router.post("/", ingresoController.create);
router.put("/:idingreso", ingresoController.update);
router.patch("/:idingreso", ingresoController.delete);

module.exports = router;
