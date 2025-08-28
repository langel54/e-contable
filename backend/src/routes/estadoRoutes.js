const express = require("express");
const estadoController = require("../controllers/estadoController");
const router = express.Router();

// Rutas para el modelo Estado
router.get("/", estadoController.getAll);
router.get("/:idestado", estadoController.getById);
router.post("/", estadoController.create);
router.put("/:idestado", estadoController.update);
router.delete("/:idestado", estadoController.delete);

module.exports = router;
