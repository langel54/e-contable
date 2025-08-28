const express = require("express");
const tipoOperacionController = require("../controllers/tipoOperacionController");
const router = express.Router();

// Rutas para el modelo TipoOperacion
router.get("/", tipoOperacionController.getAll);
router.get("/:idtipo_op", tipoOperacionController.getById);
router.post("/", tipoOperacionController.create);
router.put("/:idtipo_op", tipoOperacionController.update);
router.delete("/:idtipo_op", tipoOperacionController.delete);

module.exports = router;
