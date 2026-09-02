import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener estado de cuenta por cliente y año
export const getEstadoCuenta = async (idclienteprov, year, tipo) => {
  let url = `/estado-cuenta?idclienteprov=${idclienteprov}&year=${year}`;
  if (tipo) {
    url += `&tipo=${tipo}`;
  }
  return fetchWithAuth(url);
};

