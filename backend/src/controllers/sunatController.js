const { chromium } = require("playwright");
const { accessSunatMenu } = require("../services/sunatMenuService");
const { buildAutologinUrl } = require("../utils/sunatAuthHelper");
const { loginSunatAndGetUrl } = require("../services/sunatCurlLoginService");

// plugin = URL con #autologin para extensión; curl = login en servidor (Playwright) y retorno de URL final
const DEFAULT_ACCESS_MODE = process.env.SUNAT_ACCESS_MODE || "curl";

// Helper local eliminado para usar el util de /utils/

// --- Playwright directo (más eficiente que Puppeteer) ---
async function accessSunat({ ruc, usuario, password }) {
  const url = process.env.SUNAT_TRAMITES_CONSULTAS_URL;

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Optimización para servidores
  });
  const page = await browser.newPage({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  });

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    await page.waitForSelector("#txtRuc", { timeout: 10000 });
    await page.waitForSelector("#txtUsuario", { timeout: 10000 });
    await page.waitForSelector("#txtContrasena", { timeout: 10000 });

    await page.fill("#txtRuc", ruc);
    await page.fill("#txtUsuario", usuario);
    await page.fill("#txtContrasena", password);

    await Promise.all([
      page.click("#btnAceptar"),
      page.waitForLoadState("networkidle", { timeout: 30000 }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error en el acceso a SUNAT:", error);
    return { success: false, error: error.message };
  } finally {
    // Cerrar el navegador para liberar recursos
    await browser.close();
  }
}

// --- Handler con Playwright (más eficiente) ---
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

// --- API con autologin por payload (plugin) o login en servidor (curl) ---
async function accessSunatTramites(req, res) {
  const { ruc, usuario, password, mode } = req.body;
  const accessMode = mode || req.query.mode || DEFAULT_ACCESS_MODE;

  if (!ruc || !usuario || !password) {
    return res.status(400).json({
      error: "Todos los campos (RUC, usuario, contraseña) son obligatorios.",
    });
  }
  try {
    if (accessMode === "curl") {
      const baseUrl = process.env.SUNAT_TRAMITES_CONSULTAS_URL;
      const result = await loginSunatAndGetUrl({
        baseUrl,
        ruc,
        usuario,
        password,
      });
      if (!result.success) {
        return res.status(502).json({
          error: "No se pudo completar el login en el servidor.",
          detail: result.error,
        });
      }
      return res
        .status(200)
        .json({ message: "URL logueada generada correctamente", url: result.url, mode: "curl" });
    }

    const url = buildAutologinUrl(
      process.env.SUNAT_TRAMITES_CONSULTAS_URL,
      ruc,
      usuario,
      password,
      "TRAMITES_CONSULTAS"
    );
    res.status(200).json({ message: "URL generada correctamente", url, mode: "plugin" });
  } catch (error) {
    console.error("Error en el acceso a SUNAT:", error);
    res
      .status(500)
      .json({ error: "Hubo un problema al generar la URL de acceso a SUNAT." });
  }
}

async function accessSunatDeclaracionesPagos(req, res) {
  const { ruc, usuario, password, mode } = req.body;
  const accessMode = mode || req.query.mode || DEFAULT_ACCESS_MODE;

  if (!ruc || !usuario || !password) {
    return res.status(400).json({
      error: "Todos los campos (RUC, usuario, contraseña) son obligatorios.",
    });
  }
  try {
    if (accessMode === "curl") {
      const baseUrl = process.env.SUNAT_DECLARACIONES_PAGOS;
      const result = await loginSunatAndGetUrl({
        baseUrl,
        ruc,
        usuario,
        password,
      });
      if (!result.success) {
        return res.status(502).json({
          error: "No se pudo completar el login en el servidor.",
          detail: result.error,
        });
      }
      return res
        .status(200)
        .json({ message: "URL logueada generada correctamente", url: result.url, mode: "curl" });
    }

    const url = buildAutologinUrl(
      process.env.SUNAT_DECLARACIONES_PAGOS,
      ruc,
      usuario,
      password,
      "DECLARACIONES_PAGOS"
    );
    res.status(200).json({ message: "URL generada correctamente", url, mode: "plugin" });
  } catch (error) {
    console.error("Error en el acceso a SUNAT:", error);
    res
      .status(500)
      .json({ error: "Hubo un problema al generar la URL de acceso a SUNAT." });
  }
}

async function accessSunatRentaAnual(req, res) {
  const { ruc, usuario, password, mode } = req.body;
  const accessMode = mode || req.query.mode || DEFAULT_ACCESS_MODE;

  if (!ruc || !usuario || !password) {
    return res.status(400).json({
      error: "Todos los campos (RUC, usuario, contraseña) son obligatorios.",
    });
  }
  try {
    if (accessMode === "curl") {
      const baseUrl = process.env.SUNAT_RENTA_ANUAL;
      const result = await loginSunatAndGetUrl({
        baseUrl,
        ruc,
        usuario,
        password,
      });
      if (!result.success) {
        return res.status(502).json({
          error: "No se pudo completar el login en el servidor.",
          detail: result.error,
        });
      }
      return res
        .status(200)
        .json({ message: "URL logueada generada correctamente", url: result.url, mode: "curl" });
    }

    const url = buildAutologinUrl(
      process.env.SUNAT_RENTA_ANUAL,
      ruc,
      usuario,
      password,
      "RENTA_ANUAL"
    );
    res.status(200).json({ message: "URL generada correctamente", url, mode: "plugin" });
  } catch (error) {
    console.error("Error en el acceso a SUNAT:", error);
    res
      .status(500)
      .json({ error: "Hubo un problema al generar la URL de acceso a SUNAT." });
  }
}

async function accessSunatMenuHandler(req, res) {
  const { ruc, usuario, password } = req.body;
  if (!ruc || !usuario || !password) {
    return res.status(400).json({
      error: "Todos los campos (RUC, usuario, contraseña) son obligatorios.",
    });
  }
  try {
    const result = await accessSunatMenu({ ruc, usuario, password });
    if (result.success) {
      res.status(200).json({
        message: "Login exitoso",
        url: result.url,
        result: result.messages,
      });
    } else {
      res.status(500).json({ error: "Error en login", detail: result.error });
    }
  } catch (error) {
    console.error("❌ Error general:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
}

module.exports = {
  accessSunat,
  accessSunatHandlerPuppeter,
  accessSunatTramites,
  accessSunatDeclaracionesPagos,
  accessSunatRentaAnual,
  accessSunatMenuHandler,
};
