const prisma = require("./src/config/database");

async function check() {
    try {
        const estados = await prisma.estado.findMany();
        console.log("Estados de Ingreso:", JSON.stringify(estados, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
