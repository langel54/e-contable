const express = require("express");
const tributosController = require("../controllers/tributosController");
const router = express.Router();

router.get("/", tributosController.getAll);
router.get("/:id", tributosController.getById);
router.post("/", tributosController.create);
router.put("/:id", tributosController.update);
router.delete("/:id", tributosController.delete);
router.get("/cliente/:idclienteprov", tributosController.getByCliente);

module.exports = router;
