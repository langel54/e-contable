import { fetchWithAuth } from "@/app/services/apiClient";

// Get all Facturadores
export const getFacturadores = async () => {
  return fetchWithAuth("/facturador");
};

// Create a new Facturador
export const createFacturador = async (data) => {
  return fetchWithAuth("/facturador", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing Facturador
export const updateFacturador = async (id, data) => {
  return fetchWithAuth(`/facturador/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a Facturador
export const deleteFacturador = async (id) => {
  return fetchWithAuth(`/facturador/${id}`, {
    method: "DELETE",
  });
};
