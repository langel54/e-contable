const { chromium } = require("playwright");

async function accessSunatMenu({ ruc, usuario, password }) {
    const url =
        "https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGV0AAVidXpvbng=";

    const browser = await chromium.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

        // Esperar y hacer clic en Buzón Electrónico
        console.log("Esperando por #aOpcionBuzon...");
        await page.waitForSelector("#aOpcionBuzon", { timeout: 20000 });
        await page.click("#aOpcionBuzon");
        console.log("Clic en Buzón Electrónico realizado.");

        // Esperar a que la lista de mensajes se cargue
        console.log("Esperando por #listaMensajes en los frames...");

        let messages = [];
        let foundInFrame = false;
        const waitTimeout = 40000;
        const startTimeMs = Date.now();

        while (Date.now() - startTimeMs < waitTimeout) {
            const allFrames = page.frames();
            for (const frame of allFrames) {
                try {
                    const listExists = await frame.$("#listaMensajes");
                    if (listExists) {
                        console.log(`Elemento #listaMensajes encontrado en el frame: ${frame.name() || 'sin nombre'}`);

                        // Extraer los mensajes desde este frame
                        messages = await frame.$$eval("#listaMensajes li.list-group-item", (rows) => {
                            return rows.map((row) => {
                                const id = row.id;
                                const subject = row.querySelector("a.linkMensaje")?.textContent.trim() || "";
                                const date = row.querySelector(".fecPublica")?.textContent.trim() || "";
                                const tag = row.querySelector(".label.tag")?.textContent.trim() || "";
                                const leido = row.querySelector("#idLeido")?.value === "1";
                                const destacado = row.querySelector("#idDestacado")?.value === "1";
                                const urgente = row.querySelector("#idUrgente")?.value === "1";

                                return {
                                    id,
                                    subject,
                                    date,
                                    tag,
                                    leido,
                                    destacado,
                                    urgente
                                };
                            });
                        });
                        foundInFrame = true;
                        break;
                    }
                } catch (e) {
                    // Ignorar errores
                }
            }
            if (foundInFrame) break;
            await page.waitForTimeout(2000);
        }

        if (!foundInFrame) {
            throw new Error("No se pudo encontrar #listaMensajes en ningún frame tras el tiempo de espera.");
        }

        // Filtrar solo los mensajes no leídos
        const unreadMessages = messages.filter(m => !m.leido);
        console.log(`Se encontraron ${unreadMessages.length} mensajes no leídos de ${messages.length} totales.`);
        console.log("Mensajes no leídos:", JSON.stringify(unreadMessages, null, 2));

        return { success: true, url: currentUrl, messages: unreadMessages };
    } catch (error) {
        console.error("❌ Error en login SUNAT Menu:", error);
        return { success: false, error: error.message };
    } finally {
        // browser.close() se omite según el patrón de sunafilService.js
    }
}

module.exports = { accessSunatMenu };
