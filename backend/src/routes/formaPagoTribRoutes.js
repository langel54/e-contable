const express = require("express");
const formaPagoTribController = require("../controllers/formaPagoTribController");
const router = express.Router();

// Rutas para el modelo FormaPagoTrib
router.get("/", formaPagoTribController.getAll);
router.get("/:id", formaPagoTribController.getById);
router.post("/", formaPagoTribController.create);
router.put("/:id", formaPagoTribController.update);
router.delete("/:id", formaPagoTribController.delete);

module.exports = router;
