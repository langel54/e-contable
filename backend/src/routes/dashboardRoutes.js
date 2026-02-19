const { Router } = require("express");
const {
  getClientesKPIs,
  getClientesGraficos,
  // getClientesTablas,
  getTributosKPIs,
  getTributosGraficos,
  // getTributosTablas,
  getCajaKPIs,
  getCajaGraficos,
  getCajaTablas,
} = require("../controllers/dashboardController.js");
const { checkAuth } = require("../middlewares/authMiddleware.js");
const { checkOrigin } = require("../middlewares/checkOrigin.js");

const router = Router();

// // Middleware para todas las rutas
// router.use(checkAuth);
// router.use(checkOrigin);

// Rutas de Clientes
router.get("/dashboard/clientes/kpis", getClientesKPIs);
router.get("/dashboard/clientes/graficos", getClientesGraficos);
// router.get("/dashboard/clientes/tablas", getClientesTablas);

// Rutas de Tributos
router.get("/dashboard/tributos/kpis", getTributosKPIs);
router.get("/dashboard/tributos/graficos", getTributosGraficos);
// router.get("/dashboard/tributos/tablas", getTributosTablas);

// Rutas de Caja
router.get("/dashboard/caja/kpis", getCajaKPIs);
router.get("/dashboard/caja/graficos", getCajaGraficos);
router.get("/dashboard/caja/tablas", getCajaTablas);

module.exports = router;
