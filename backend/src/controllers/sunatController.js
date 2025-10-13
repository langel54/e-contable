const puppeteer = require("puppeteer");

// --- Helper para autologin ---
function buildSunatUrl(base, ruc, usuario, password, origin) {
  const encodePayload = (obj) => {
    const json = JSON.stringify(obj);
    return Buffer.from(json, "utf8").toString("base64");
  };

  const payload = {
    u: String(ruc),
    usuario: String(usuario),
    p: String(password),
    ts: Date.now(),
    maxAgeMs: 2 * 60 * 1000,
    origin, // importante para diferenciar
  };

  const b64 = encodePayload(payload);
  return `${base}#autologin=${b64}`;
}

// --- Puppeteer directo ---
async function accessSunat({ ruc, usuario, password }) {
  const url = process.env.SUNAT_TRAMITES_CONSULTAS_URL;

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  try {
    await page.goto(url);
    await page.waitForSelector("#txtRuc");
    await page.waitForSelector("#txtUsuario");
    await page.waitForSelector("#txtContrasena");

    await page.type("#txtRuc", ruc);
    await page.type("#txtUsuario", usuario);
    await page.type("#txtContrasena", password);

    await page.click("#btnAceptar");
    await page.waitForNavigation();

    return { success: true };
  } catch (error) {
    console.error("Error en el acceso a SUNAT:", error);
    return { success: false, error: error.message };
  } finally {
    // browser.close() lo puedes dejar manual para debug
  }
}

// --- Handler con Puppeteer ---
async function accessSunatHandlerPuppeter(req, res) {
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
}

// --- API con autologin por payload ---
async function accessSunatTramites(req, res) {
  const { ruc, usuario, password } = req.body;
  if (!ruc || !usuario || !password) {
    return res.status(400).json({
      error: "Todos los campos (RUC, usuario, contraseña) son obligatorios.",
    });
  }
  try {
    const url = buildSunatUrl(
      process.env.SUNAT_TRAMITES_CONSULTAS_URL,
      ruc,
      usuario,
      password,
      "TRAMITES_CONSULTAS"
    );
    res.status(200).json({ message: "URL generada correctamente", url });
  } catch (error) {
    console.error("Error en el acceso a SUNAT:", error);
    res
      .status(500)
      .json({ error: "Hubo un problema al generar la URL de acceso a SUNAT." });
  }
}

async function accessSunatDeclaracionesPagos(req, res) {
  const { ruc, usuario, password } = req.body;
  if (!ruc || !usuario || !password) {
    return res.status(400).json({
      error: "Todos los campos (RUC, usuario, contraseña) son obligatorios.",
    });
  }
  try {
    const url = buildSunatUrl(
      process.env.SUNAT_DECLARACIONES_PAGOS,
      ruc,
      usuario,
      password,
      "DECLARACIONES_PAGOS"
    );
    res.status(200).json({ message: "URL generada correctamente", url });
  } catch (error) {
    console.error("Error en el acceso a SUNAT:", error);
    res
      .status(500)
      .json({ error: "Hubo un problema al generar la URL de acceso a SUNAT." });
  }
}

async function accessSunatRentaAnual(req, res) {
  const { ruc, usuario, password } = req.body;
  if (!ruc || !usuario || !password) {
    return res.status(400).json({
      error: "Todos los campos (RUC, usuario, contraseña) son obligatorios.",
    });
  }
  try {
    const url = buildSunatUrl(
      process.env.SUNAT_RENTA_ANUAL,
      ruc,
      usuario,
      password,
      "RENTA_ANUAL"
    );
    res.status(200).json({ message: "URL generada correctamente", url });
  } catch (error) {
    console.error("Error en el acceso a SUNAT:", error);
    res
      .status(500)
      .json({ error: "Hubo un problema al generar la URL de acceso a SUNAT." });
  }
}

module.exports = {
  accessSunat,
  accessSunatHandlerPuppeter,
  accessSunatTramites,
  accessSunatDeclaracionesPagos,
  accessSunatRentaAnual,
};
