const express = require("express");
const vencimientosController = require("../controllers/vencimientosController");
const router = express.Router();

router.get("/", vencimientosController.getAll);
router.get("/:id", vencimientosController.getById);
router.get("/periodo/:anio/:mes", vencimientosController.getByPeriodo);
router.post("/", vencimientosController.create);
router.put("/:id", vencimientosController.update);
router.delete("/:id", vencimientosController.delete);

module.exports = router;
