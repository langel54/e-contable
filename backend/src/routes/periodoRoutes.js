const express = require("express");
const periodoController = require("../controllers/periodoController");
const router = express.Router();

// Rutas para el modelo Periodo
router.get("/", periodoController.getAll);
router.get("/:idperiodo", periodoController.getById);
router.post("/", periodoController.create);
router.put("/:idperiodo", periodoController.update);
router.delete("/:idperiodo", periodoController.delete);

module.exports = router;
