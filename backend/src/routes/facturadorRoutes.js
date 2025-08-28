const express = require("express");
const facturadorController = require("../controllers/facturadorController");
const router = express.Router();

// Rutas para el modelo Facturador
router.get("/", facturadorController.getAll);
router.get("/:idfacturador", facturadorController.getById);
router.post("/", facturadorController.create);
router.put("/:idfacturador", facturadorController.update);
router.delete("/:idfacturador", facturadorController.delete);

module.exports = router;
