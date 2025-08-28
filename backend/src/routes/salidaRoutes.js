const express = require("express");
const salidaController = require("../controllers/salidaController");
const router = express.Router();

// Rutas para el modelo Salida
router.get("/", salidaController.getAll);
router.get("/:idsalida", salidaController.getById);
router.post("/", salidaController.create);
router.put("/:idsalida", salidaController.update);
router.delete("/:idsalida", salidaController.delete);

module.exports = router;
