const express = require("express");
const personalController = require("../controllers/personalController");

const router = express.Router();

// Definir rutas
router.get("/", personalController.getAll);
router.get("/:id", personalController.getById);
router.post("/", personalController.create);
router.put("/:id", personalController.update);
router.delete("/:id", personalController.delete);

module.exports = router;
