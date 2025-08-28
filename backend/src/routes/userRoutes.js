const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  validateId,
  validatePagination,
} = require("../middlewares/validationMiddleware");
// const authMiddleware = require("../middlewares/authMiddleware");

// Rutas de usuarios
router.get("/", validatePagination, userController.getAll);
router.get("/:id", validateId, userController.getById);
router.post("/", userController.create);
router.put("/:id", validateId, userController.update);
router.delete("/:id", validateId, userController.delete);

module.exports = router;
