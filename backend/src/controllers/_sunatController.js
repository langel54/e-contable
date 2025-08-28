const { chromium } = require("playwright");

async function accessSunat({ ruc, usuario, password }) {
  const url =
    "https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?lang=es-PE&showDni=true&showLanguages=false&originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA=="; // URL del formulario de SUNAT

  const browser = await chromium.launch({ headless: false }); // Cambiamos a Firefox
  const page = await browser.newPage();

  // Escuchar eventos de error de red
  page.on("requestfailed", (request) => {
    console.error(
      `Error en la solicitud: ${request.url()} - ${
        request.failure()?.errorText
      }`
    );
  });

  try {
    await page.goto(url, { timeout: 10000 });

    await page.type("#txtRuc", ruc);
    await page.type("#txtUsuario", usuario);
    await page.type("#txtContrasena", password);

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.click("#btnAceptar"),
    ]);

    console.log("Acceso completado");
    return { success: true };
  } catch (error) {
    console.error("Error durante el acceso a SUNAT:", error.message);

    if (error.message.includes("ERR_INTERNET_DISCONNECTED")) {
      console.error("Error: No hay conexión a Internet.");
    }

    return { success: false, error: error.message };
  } finally {
    // await browser.close();
  }
}

module.exports = { accessSunat };
