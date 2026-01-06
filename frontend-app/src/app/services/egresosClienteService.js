import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener egresos por cliente y año
export const getEgresosCliente = async (idclienteprov, year) => {
  return fetchWithAuth(
    `/egresos-cliente?idclienteprov=${idclienteprov}&year=${year}`
  );
};

