const puppeteer = require("puppeteer");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");

async function accessSunat({ ruc, usuario, password }) {
  const url =
    "https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?lang=es-PE&showDni=true&showLanguages=false&originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA=="; // URL del formulario de SUNAT

  // puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    // executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    // args: [
    //   "--start-maximized", // Para abrir la ventana del navegador en pantalla completa
    // ],
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
    // await browser.close();
    return { success: false, error: error.message };
  } finally {
    // await browser.close();
  }
}

module.exports = { accessSunat };
