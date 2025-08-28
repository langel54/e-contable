const express = require("express");
const pagosController = require("../controllers/pagosController");
const router = express.Router();

router.get("/", pagosController.getAll);
router.get("/:id", pagosController.getById);
router.get("/tributo/:idtributos", pagosController.getByTributo);
router.post("/", pagosController.create);
router.put("/:id", pagosController.update);
router.delete("/:id", pagosController.delete);

module.exports = router;
