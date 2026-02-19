/**
 * Servicio para login vía "curl" (HTTP directo o Playwright en servidor).
 * Basado en flujo documentado y repos como giansalex/Curl-Sunat:
 * POST a .../oauth2/j_security_check con custom_ruc, j_username, j_password, state, originalUrl.
 */

const { chromium } = require("playwright");

const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/**
 * Parsea baseUrl de SUNAT y devuelve clientId, originalUrl, state y URL de j_security_check.
 * Ej: https://api-seguridad.sunat.gob.pe/v1/clientessol/{uuid}/oauth2/loginMenuSol?...&originalUrl=...&state=...
 */
function parseSunatLoginUrl(baseUrl) {
  const url = new URL(baseUrl);
  const pathMatch = url.pathname.match(/\/v1\/clientessol\/([a-f0-9-]+)\/oauth2\//i);
  const clientId = pathMatch ? pathMatch[1] : null;
  const originalUrl = url.searchParams.get("originalUrl") || "";
  const state = url.searchParams.get("state") || "";
  const baseOrigin = url.origin;
  const jSecurityCheckUrl = `${baseOrigin}/v1/clientessol/${clientId}/oauth2/j_security_check`;
  return { clientId, originalUrl, state, jSecurityCheckUrl };
}

/**
 * Login SUNAT por HTTP puro (estilo curl): GET página de login para cookies, POST a j_security_check.
 * Referencia: https://github.com/giansalex/Curl-Sunat (form_params: tipo, custom_ruc, j_username, j_password, originalUrl, state).
 * @returns {Promise<{ success: boolean, url?: string, error?: string }>}
 */
async function loginSunatHttp({ baseUrl, ruc, usuario, password }) {
  const { clientId, originalUrl, state, jSecurityCheckUrl } = parseSunatLoginUrl(baseUrl);
  if (!clientId) {
    return { success: false, error: "No se pudo extraer clientId de la URL de login." };
  }

  let cookies = "";

  try {
    // 1) GET página de login para obtener cookies de sesión
    const getRes = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "User-Agent": DEFAULT_UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "es-PE,es;q=0.9,en;q=0.8",
      },
      redirect: "manual",
    });

    const setCookie = getRes.headers.get("set-cookie");
    if (setCookie) cookies = setCookie.split(",").map((c) => c.split(";")[0].trim()).join("; ");

    // 2) POST a j_security_check (form-based auth SUNAT)
    const body = new URLSearchParams({
      tipo: "2",
      dni: "",
      custom_ruc: String(ruc).trim(),
      j_username: String(usuario).trim(),
      j_password: String(password).trim(),
      captcha: "",
      originalUrl: originalUrl || baseUrl,
      state: state,
    }).toString();

    const postRes = await fetch(jSecurityCheckUrl, {
      method: "POST",
      headers: {
        "User-Agent": DEFAULT_UA,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Referer: baseUrl,
        Origin: new URL(baseUrl).origin,
        Cookie: cookies,
      },
      body,
      redirect: "manual",
    });

    const location = postRes.headers.get("location");
    if (location) {
      const finalUrl = location.startsWith("http") ? location : new URL(location, jSecurityCheckUrl).href;
      return { success: true, url: finalUrl };
    }

    // Si no hay Location, puede ser que la respuesta sea 200 con error (credenciales incorrectas)
    const text = await postRes.text();
    if (text.toLowerCase().includes("error") || text.toLowerCase().includes("incorrecto")) {
      return { success: false, error: "Credenciales incorrectas o acceso denegado." };
    }
    return { success: false, error: "Login no devolvió redirección (revisar credenciales o captcha)." };
  } catch (err) {
    console.error("Error en login SUNAT (HTTP):", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Login SUNAT con Playwright (navegador headless). Más robusto: espera a navegación y evita networkidle inestable.
 * @returns {Promise<{ success: boolean, url?: string, error?: string }>}
 */
async function loginSunatPlaywright({ baseUrl, ruc, usuario, password }) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage({
    userAgent: DEFAULT_UA,
  });

  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    await page.waitForSelector("#txtRuc", { timeout: 10000 });
    await page.waitForSelector("#txtUsuario", { timeout: 10000 });
    await page.waitForSelector("#txtContrasena", { timeout: 10000 });

    await page.fill("#txtRuc", ruc);
    await page.fill("#txtUsuario", usuario);
    await page.fill("#txtContrasena", password);

    await page.click("#btnAceptar");

    await page.waitForURL(
      (url) => {
        const href = typeof url === "string" ? url : (url && (url.href || url.toString && url.toString())) || "";
        return href !== baseUrl && !href.includes("loginMenuSol") && !href.includes("j_security_check");
      },
      { timeout: 30000 }
    ).catch(() => null);

    await page.waitForLoadState("domcontentloaded", { timeout: 10000 }).catch(() => null);

    const finalUrl = page.url();
    const stillOnLogin = finalUrl.includes("j_security_check") || finalUrl.includes("loginMenuSol") || finalUrl.includes("login?");
    if (stillOnLogin) {
      const bodyText = await page.innerText("body").catch(() => "");
      if (bodyText.toLowerCase().includes("incorrecto") || bodyText.toLowerCase().includes("error")) {
        return { success: false, error: "Credenciales incorrectas o acceso denegado." };
      }
      return { success: false, error: "Tras el login se siguió en la página de acceso." };
    }

    return { success: true, url: finalUrl };
  } catch (error) {
    console.error("Error en login SUNAT (Playwright):", error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

/**
 * Ejecuta login en SUNAT: intenta primero HTTP (curl), si falla usa Playwright.
 *
 * @param {Object} params
 * @param {string} params.baseUrl - URL inicial del sitio (trámites, declaraciones-pagos, etc.)
 * @param {string} params.ruc
 * @param {string} params.usuario
 * @param {string} params.password
 * @returns {Promise<{ success: boolean, url?: string, error?: string }>}
 */
async function loginSunatAndGetUrl({ baseUrl, ruc, usuario, password }) {
  const httpResult = await loginSunatHttp({ baseUrl, ruc, usuario, password });
  if (httpResult.success) return httpResult;

  return loginSunatPlaywright({ baseUrl, ruc, usuario, password });
}

module.exports = {
  loginSunatAndGetUrl,
  loginSunatHttp,
  loginSunatPlaywright,
  parseSunatLoginUrl,
};
