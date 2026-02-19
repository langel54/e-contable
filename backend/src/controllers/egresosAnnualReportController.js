const prisma = require("../config/database");

const egresosAnnualReportController = {
    getAnnualReport: async (req, res) => {
        try {
            const year = parseInt(req.query.year) || new Date().getFullYear();

            // Get all expenses for the year, filtering by valid status (e.g. 1)
            const expenses = await prisma.salida.findMany({
                where: {
                    anio: year,
                    idestado: 1, // CONFIRMED: 1 means valid/paid based on service
                },
                include: {
                    cliente_prov: true,
                    periodo: true,
                },
            });

            // Group by client
            const clientMap = new Map();

            expenses.forEach((expense) => {
                const clientId = expense.idclienteprov;
                const monthName = expense.periodo?.nom_periodo?.toLowerCase().substring(0, 3); // ene, feb, mar...

                if (!clientMap.has(clientId)) {
                    clientMap.set(clientId, {
                        id: clientId,
                        razon_social: expense.cliente_prov?.razonsocial || "Sin Nombre",
                        cant_pagos: 0,
                        ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0,
                        jul: 0, ago: 0, set: 0, oct: 0, nov: 0, dic: 0,
                        anual: 0
                    });
                }

                const clientData = clientMap.get(clientId);
                const amount = parseFloat(expense.importe) || 0;

                clientData.cant_pagos += 1;
                clientData.anual += amount;

                // Add to specific month if valid
                if (monthName && clientData.hasOwnProperty(monthName)) {
                    clientData[monthName] += amount;
                } else if (monthName === "abr") { // handle abril/abr difference if any
                    clientData["abr"] += amount;
                }
            });

            const reportData = Array.from(clientMap.values());

            res.status(200).json(reportData);
        } catch (error) {
            console.error("Error generating annual expense report:", error);
            res.status(500).json({ error: "Error generating report" });
        }
    },
};

module.exports = egresosAnnualReportController;
