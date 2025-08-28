const express = require("express");
const cajaMesController = require("../controllers/cajaMesController");
const router = express.Router();

// Rutas para el modelo CajaMes
router.get("/", cajaMesController.getAll);
router.get("/:codcaja_m", cajaMesController.getByCod);
router.post("/", cajaMesController.create);
router.put("/:codcaja_m", cajaMesController.update);
router.delete("/:codcaja_m", cajaMesController.delete);

module.exports = router;
