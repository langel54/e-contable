import { fetchWithAuth } from "@/app/services/apiClient";

// Get vencimientos by year, month and u_digito
export const getVencimientos = async (anio, mes, u_digito) => {
  console.log("🚀 ~ getVencimientos ~ anio:", anio, mes, u_digito);
  return fetchWithAuth(
    `/vencimientos?anio=${anio}&mes=${mes}&u_digito=${u_digito}`
  );
};

// Get all vencimientos
export const getAllVencimientos = async () => {
  return fetchWithAuth("/vencimientos");
};

// Create vencimiento
export const createVencimiento = async (vencimientoData) => {
  return fetchWithAuth("/vencimientos", {
    method: "POST",
    body: JSON.stringify(vencimientoData),
  });
};

// Update vencimiento
export const updateVencimiento = async (id, vencimientoData) => {
  return fetchWithAuth(`/vencimientos/${id}`, {
    method: "PUT",
    body: JSON.stringify(vencimientoData),
  });
};

// Delete vencimiento
export const deleteVencimiento = async (id) => {
  return fetchWithAuth(`/vencimientos/${id}`, {
    method: "DELETE",
  });
};
