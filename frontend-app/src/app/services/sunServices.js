import { fetchWithAuth } from "@/app/services/apiClient";

// El modo (plugin | curl) se configura en el .env del backend: SUNAT_ACCESS_MODE
export async function accessSunatTramites(data) {
  return fetchWithAuth("/sunat/tramites", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function accessSunatDeclaracionesPagos(data) {
  return fetchWithAuth("/sunat/declaraciones-pagos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function accessSunatRentaAnual(data) {
  return fetchWithAuth("/sunat/renta-anual", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
