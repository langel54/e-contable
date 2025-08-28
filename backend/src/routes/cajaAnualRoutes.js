const express = require("express");
const cajaAnualController = require("../controllers/cajaAnualController");
const router = express.Router();

// Rutas para el modelo CajaAnual
router.get("/", cajaAnualController.getAll);
router.get("/:codcaja_a", cajaAnualController.getByCod);
router.post("/", cajaAnualController.create);
router.put("/:codcaja_a", cajaAnualController.update);
router.delete("/:codcaja_a", cajaAnualController.delete);

module.exports = router;
