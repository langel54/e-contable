import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener egresos por cliente y año
export const getEgresosCliente = async (idclienteprov, year) => {
  return fetchWithAuth(
    `/egresos-cliente?idclienteprov=${idclienteprov}&year=${year}`
  );
};

// Reporte anual de egresos
export const getAnnualExpenseReport = async (year) => {
  return fetchWithAuth(`/egresos-cliente/annual-report?year=${year}`);
};

