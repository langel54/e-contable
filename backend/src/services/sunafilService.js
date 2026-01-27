const { chromium } = require("playwright");

async function accessSunafil({ ruc, usuario, password }) {
  filterList = ["Actos Administrativos", "Alertas"];

  const url =
    "https://api-seguridad.sunat.gob.pe/v1/clientessol/b6474e23-8a3b-4153-b301-dafcc9646250/oauth2/login?originalUrl=https://casillaelectronica.sunafil.gob.pe/si.inbox/Login/Empresa&state=s";

  const browser = await chromium.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Optimización para servidores
  });
  const page = await browser.newPage();

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

    const currentUrl = page.url();

    /******************* de notificaciones
     ********************** */
    // // Espera a que el modal esté visible
    // await page.waitForSelector("#formNotificaciones\\:mdNotificaciones", {
    //   visible: true,
    // });
    /**************modal de aviso ********* */
    // // Espera a que el modal esté visible
    // await page.waitForSelector("#formAvisoContacto\\:mdAvisoContacto", {
    //   visible: true,
    // });

    // // Cierra el modal
    // await page.evaluate(() => {
    //   $("#formAvisoContacto\\:mdAvisoContacto").modal("hide");
    // });

    // Cierra el modal
    // await page.evaluate(() => {
    //   $("#formNotificaciones\\:mdNotificaciones").modal("hide");
    // });

    // // Espera un poco para asegurarse de que el modal se cierre
    // // await page.waitForTimeout(500); // Puedes ajustar el tiempo si es necesario

    // // Ahora espera a que los elementos de la tabla estén disponibles
    // await page.waitForSelector("#formNotificaciones\\:dtNotiAlertas tbody tr", {
    //   visible: true,
    // });

    // Realiza las acciones necesarias con los elementos de la tabla
    const items = await page.$$eval(
      "#formNotificaciones\\:dtNotiAlertas tbody tr",
      (rows) => {
        return rows.map((row) => {
          const description = row
            .querySelector("td:nth-child(1)")
            ?.textContent.trim();
          const quantity = row
            .querySelector("td:nth-child(2)")
            ?.textContent.trim();
          return { description, quantity };
        });
      }
    );

    console.log(items); // Muestra los items de la tabla

    // Extraer los menús después del login
    await page.waitForSelector("ul.sidebar-menu", { timeout: 10000 });

    const menuItems = await page.$$eval(
      "ul.sidebar-menu > li.treeview",
      (menus) => {
        return Array.from(menus).map((menuLi) => {
          const menuName =
            menuLi.querySelector(":scope > a > span")?.textContent.trim() || "";

          const submenus = Array.from(
            menuLi.querySelectorAll("ul.treeview-menu > li")
          ).map((submenuLi) => {
            const label =
              submenuLi.querySelector("a")?.textContent.trim() || "";
            const danger =
              submenuLi
                .querySelector(".label.label-danger")
                ?.textContent.trim() || "0";

            return { label, danger };
          });

          return {
            menu: menuName,
            submenus,
          };
        });
      }
    );

    console.log(JSON.stringify(menuItems, null, 2));

    return { success: true, url: currentUrl, menuItems };
  } catch (error) {
    console.error("❌ Error en login:", error);
    return { success: false, error: error.message };
  } finally {
    // Asegurar que el navegador se cierre siempre
    // await browser.close();
  }
}
module.exports = { accessSunafil };
