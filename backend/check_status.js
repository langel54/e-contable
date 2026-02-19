const prisma = require("./src/config/database");

async function check() {
    try {
        const clients = await prisma.clienteProv.groupBy({
            by: ['estado'],
            _count: {
                estado: true,
            },
        });
        console.log("JSON_OUTPUT_START");
        console.log(JSON.stringify(clients, null, 2));
        console.log("JSON_OUTPUT_END");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
