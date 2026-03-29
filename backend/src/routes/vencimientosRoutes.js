const express = require("express");
const router = express.Router();
const vencimientosController = require("../controllers/vencimientosController");
const authMiddleware = require("../middlewares/authMiddleware");

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);
// CORS se controla globalmente en app.js con cors(corsOptions); checkOrigin no es necesario aquí.

// GET /api/vencimientos - Obtener vencimientos con filtros
router.get("/", vencimientosController.getVencimientos);

// GET /api/vencimientos/all - Obtener todos los vencimientos con paginación
router.get("/all", vencimientosController.getAllVencimientos);

// GET /api/vencimientos/:id - Obtener vencimiento por ID
router.get("/:id", vencimientosController.getVencimientoById);

// POST /api/vencimientos - Crear nuevo vencimiento
router.post("/", vencimientosController.createVencimiento);

// PUT /api/vencimientos/:id - Actualizar vencimiento
router.put("/:id", vencimientosController.updateVencimiento);

// DELETE /api/vencimientos/:id - Eliminar vencimiento
router.delete("/:id", vencimientosController.deleteVencimiento);

module.exports = router;
