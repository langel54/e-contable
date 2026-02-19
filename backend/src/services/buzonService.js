const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { accessSunatMenu } = require("./sunatMenuService");

// Estado de progreso de verificación masiva (para polling desde el frontend)
let verifyProgress = { total: 0, done: 0, inProgress: false };

function getVerifyProgress() {
    return { ...verifyProgress };
}

async function verifyMonitoredBuzones() {
    console.log("Iniciando verificación masiva de Buzón SOL (Decoupled)...");

    // 1. Obtener los IDs de clientes a monitorear
    const monitoringEntries = await prisma.monitoreo_buzon.findMany();
    const clientIds = monitoringEntries.map(e => e.idclienteprov);

    if (clientIds.length === 0) {
        verifyProgress = { total: 0, done: 0, inProgress: false };
        return [];
    }

    // 2. Obtener los datos de esos clientes desde clienteProv
    const clients = await prisma.clienteProv.findMany({
        where: { idclienteprov: { in: clientIds } },
        select: {
            idclienteprov: true,
            ruc: true,
            c_usuario: true,
            c_passw: true,
            razonsocial: true
        }
    });

    verifyProgress = { total: clients.length, done: 0, inProgress: true };
    console.log(`Se procesarán ${clients.length} clientes.`);

    const results = [];

    for (const client of clients) {
        console.log(`Verificando buzón para: ${client.razonsocial} (${client.ruc})`);

        if (!client.ruc || !client.c_usuario || !client.c_passw) {
            results.push({ idclienteprov: client.idclienteprov, success: false, error: "Credenciales incompletas" });
            continue;
        }

        try {
            const result = await accessSunatMenu({
                ruc: client.ruc,
                usuario: client.c_usuario,
                password: client.c_passw
            });

            if (result.success && result.messages) {
                let savedCount = 0;
                for (const msg of result.messages) {
                    try {
                        await prisma.monitoreo_mensaje.upsert({
                            where: { mensajeId: msg.id },
                            update: {
                                leido: msg.leido,
                                tag: msg.tag
                            },
                            create: {
                                idclienteprov: client.idclienteprov,
                                mensajeId: msg.id,
                                asunto: msg.subject,
                                fecha: parseSunatDate(msg.date),
                                tag: msg.tag,
                                leido: msg.leido
                            }
                        });
                        savedCount++;
                    } catch (dbErr) {
                        console.error(`Error guardando mensaje ${msg.id}:`, dbErr);
                    }
                }

                // 3. Actualizar el conteo de no leídos (desde la DB para ser precisos)
                const unreadCountInDb = await prisma.monitoreo_mensaje.count({
                    where: { idclienteprov: client.idclienteprov, leido: false }
                });

                await prisma.monitoreo_buzon.update({
                    where: { idclienteprov: client.idclienteprov },
                    data: {
                        cantidad_no_leidos: unreadCountInDb,
                        ultima_revision: new Date()
                    }
                });

                results.push({ idclienteprov: client.idclienteprov, success: true, count: savedCount, unread: unreadCountInDb });
            } else {
                results.push({ idclienteprov: client.idclienteprov, success: false, error: result.error });
            }
        } catch (error) {
            console.error(`Error procesando cliente ${client.idclienteprov}:`, error);
            results.push({ idclienteprov: client.idclienteprov, success: false, error: error.message });
        }
        verifyProgress.done += 1;
    }

    verifyProgress.inProgress = false;
    return results;
}

function parseSunatDate(dateStr) {
    if (!dateStr) return new Date();
    try {
        const [datePart, timePart] = dateStr.split(" ");
        const [day, month, year] = datePart.split("/");
        return new Date(`${year}-${month}-${day}T${timePart || '00:00:00'}`);
    } catch (e) {
        return new Date();
    }
}

async function getMonitoringData() {
    // Retorna datos de monitoreo_buzon incluyendo los nuevos campos
    const monitoringEntries = await prisma.monitoreo_buzon.findMany();
    const clientIds = monitoringEntries.map(e => e.idclienteprov);

    if (clientIds.length === 0) return [];

    const clients = await prisma.clienteProv.findMany({
        where: { idclienteprov: { in: clientIds } },
        select: {
            idclienteprov: true,
            ruc: true,
            razonsocial: true,
            c_usuario: true,
            c_passw: true
        }
    });

    const messages = await prisma.monitoreo_mensaje.findMany({
        where: {
            idclienteprov: { in: clientIds },
            leido: false
        },
        orderBy: { fecha: 'desc' }
    });

    // Combinar localmente
    return clients.map(client => {
        const entry = monitoringEntries.find(e => e.idclienteprov === client.idclienteprov);
        return {
            ...client,
            cantidad_no_leidos: entry?.cantidad_no_leidos || 0,
            ultima_revision: entry?.ultima_revision,
            unreadMessages: messages.filter(m => m.idclienteprov === client.idclienteprov)
        };
    });
}

async function addClientToMonitoring(idclienteprov) {
    return await prisma.monitoreo_buzon.upsert({
        where: { idclienteprov },
        update: {},
        create: { idclienteprov }
    });
}

async function removeClientFromMonitoring(idclienteprov) {
    try {
        return await prisma.monitoreo_buzon.delete({
            where: { idclienteprov }
        });
    } catch (e) {
        return null;
    }
}

async function markMessageAsRead(mensajeId) {
    const message = await prisma.monitoreo_mensaje.findUnique({
        where: { mensajeId }
    });

    if (!message) throw new Error("Mensaje no encontrado");

    const idclienteprov = message.idclienteprov;

    await prisma.monitoreo_mensaje.delete({
        where: { mensajeId }
    });

    const unreadCount = await prisma.monitoreo_mensaje.count({
        where: { idclienteprov, leido: false }
    });

    await prisma.monitoreo_buzon.update({
        where: { idclienteprov },
        data: { cantidad_no_leidos: unreadCount }
    });

    return { success: true, unreadCount };
}

async function markAllMessagesAsRead(idclienteprov) {
    await prisma.monitoreo_mensaje.deleteMany({
        where: { idclienteprov, leido: false }
    });

    await prisma.monitoreo_buzon.update({
        where: { idclienteprov },
        data: { cantidad_no_leidos: 0 }
    });

    return { success: true, unreadCount: 0 };
}

module.exports = {
    verifyMonitoredBuzones,
    getVerifyProgress,
    getMonitoringData,
    addClientToMonitoring,
    removeClientFromMonitoring,
    markMessageAsRead,
    markAllMessagesAsRead
};
