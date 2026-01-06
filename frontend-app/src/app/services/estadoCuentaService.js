import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener estado de cuenta por cliente y año
export const getEstadoCuenta = async (idclienteprov, year) => {
  return fetchWithAuth(
    `/estado-cuenta?idclienteprov=${idclienteprov}&year=${year}`
  );
};

