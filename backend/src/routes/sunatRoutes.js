const express = require("express");
const {
  accessSunatHandlerPuppeter,
  accessSunatTramites,
  accessSunatDeclaracionesPagos,
  accessSunatRentaAnual,
} = require("../controllers/sunatController");

const router = express.Router();

// router.post("/access-sunat", accessSunatHandlerPuppeter);  //con puppetteer
router.post("/tramites", accessSunatTramites); // con web extension
router.post("/declaraciones-pagos", accessSunatDeclaracionesPagos);
router.post("/renta-anual", accessSunatRentaAnual);

module.exports = router;
