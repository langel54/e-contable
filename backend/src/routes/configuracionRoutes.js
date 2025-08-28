const express = require("express");
const configuracionController = require("../controllers/configuracionController");
const router = express.Router();

router.get("/", configuracionController.getAll);
router.get("/current", configuracionController.getCurrentConfig);
router.get("/:id", configuracionController.getById);
router.post("/", configuracionController.create);
router.put("/:id", configuracionController.update);
router.delete("/:id", configuracionController.delete);

module.exports = router;
