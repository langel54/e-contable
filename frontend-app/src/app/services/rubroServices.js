import { fetchWithAuth } from "@/app/services/apiClient";

// Get all Rubros
export const getRubros = async () => {
  return fetchWithAuth("/rubro");
};

// Create a new Rubro
export const createRubro = async (data) => {
  return fetchWithAuth("/rubro", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing Rubro
export const updateRubro = async (id, data) => {
  return fetchWithAuth(`/rubro/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a Rubro
export const deleteRubro = async (id) => {
  return fetchWithAuth(`/rubro/${id}`, {
    method: "DELETE",
  });
};
