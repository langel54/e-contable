require("dotenv").config();
const express = require("express");
const errorHandler = require("./middlewares/errorMiddleware");
const authMiddleware = require("./middlewares/authMiddleware");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const personalRoutes = require("./routes/personalRoutes");
const tipoUsuarioRoutes = require("./routes/tipoUsuarioRoutes");
const conceptoRoutes = require("./routes/conceptoRoutes");
const tipoTribRoutes = require("./routes/tipoTributoRoutes");
const formaPagoTribRoutes = require("./routes/formaPagoTribRoutes");
const regimeRoutes = require("./routes/regimenRoutes");
const facturadorRoutes = require("./routes/facturadorRoutes");
const periodoRoutes = require("./routes/periodoRoutes");
const cajaAnualRoutes = require("./routes/cajaAnualRoutes");
const cajaMesRoutes = require("./routes/cajaMesRoutes");
const clienteProvRoutes = require("./routes/clienteProvRoutes");
const rubroRoutes = require("./routes/rubroRoutes");
const estadoRoutes = require("./routes/estadoRoutes");
const tipoOperacionRoutes = require("./routes/tipoOperacionRoutes");
const ingresoRoutes = require("./routes/ingresoRoutes");
const salidaRoutes = require("./routes/salidaRoutes");
const notasRoutes = require("./routes/notasRoutes");
const tributosRoutes = require("./routes/tributosRoutes");
const pagosRoutes = require("./routes/pagosRoutes");
const configuracionRoutes = require("./routes/configuracionRoutes");
const vencimientosRoutes = require("./routes/vencimientosRoutes");
const tipoDocumentoRoutes = require("./routes/tipoDocumentoRoutes");
const tempPagoRoutes = require("./routes/tempPagoRoutes");
const validateTokenRoutes = require("./routes/validateTokenRoutes");
const estadoClienteRoutes = require("./routes/estadoClienteRoutes");
const misDeclaracionesRoutes = require("./routes/misDeclaracionesRoutes");
const pdfIncomeRoutes = require("./routes/pdfIncomeRoutes");
const pdfSalidaRoutes = require("./routes/pdfSalidaRoutes");
const sunafilRoutes = require("./routes/sunafilRoutes");
const checkOrigin = require("./middlewares/checkOrigin");
const corsOptions = require("./config/corsConfig");
const { accessSunat } = require("./controllers/sunatController");

// const clienteRoutes = require("./routes/clienteRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(checkOrigin); // PARA RESTRINGIR CONEXIONES

// Routes
app.use("/api/auth", authRoutes);
// Ruta para acceso a SUNAT
app.post("/api/access-sunat", async (req, res) => {
  const { ruc, usuario, password } = req.body;
  if (!ruc || !usuario || !password) {
    return res.status(400).json({
      error: "Todos los campos (RUC, usuario, contraseña) son obligatorios.",
    });
  }
  try {
    const result = await accessSunat({ ruc, usuario, password });
    res.status(200).json({ message: "Acceso completado", result });
  } catch (error) {
    console.error("Error en el acceso a SUNAT:", error);
    res.status(500).json({ error: "Hubo un problema al acceder a SUNAT." });
  }
});

// Aplicar middleware de autenticación a todas las rutas
// app.use(authMiddleware);

app.use("/api/users", userRoutes);
app.use("/api/personal", personalRoutes);
app.use("/api/tipousuario", tipoUsuarioRoutes);
app.use("/api/concepto", conceptoRoutes);
app.use("/api/tipotributo", tipoTribRoutes);
app.use("/api/formapagotrib", formaPagoTribRoutes);
app.use("/api/regimen", regimeRoutes);
app.use("/api/facturador", facturadorRoutes);
app.use("/api/periodo", periodoRoutes);
app.use("/api/cajaanual", cajaAnualRoutes);
app.use("/api/caja-mes", cajaMesRoutes);
app.use("/api/clienteproveedor", clienteProvRoutes);
app.use("/api/rubro", rubroRoutes);
app.use("/api/estado", estadoRoutes);
app.use("/api/tipo-operacion", tipoOperacionRoutes);
app.use("/api/ingreso", ingresoRoutes);
app.use("/api/egreso", salidaRoutes);
app.use("/api/notas", notasRoutes);
app.use("/api/tributos", tributosRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/configuracion", configuracionRoutes);
app.use("/api/vencimientos", vencimientosRoutes);
app.use("/api/tipodocumento", tipoDocumentoRoutes);
app.use("/api/temppago", tempPagoRoutes);
app.use("/api/validate-token", validateTokenRoutes);
app.use("/api/estado-cliente", estadoClienteRoutes);
app.use("/api/misdeclaraciones", misDeclaracionesRoutes);
app.use("/api/pdf-income", pdfIncomeRoutes);
app.use("/api/pdf-salida", pdfSalidaRoutes);
app.use("/api/sunafil", sunafilRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
