import { fetchWithAuth } from "@/app/services/apiClient";

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
