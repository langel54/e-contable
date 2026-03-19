import { fetchWithAuth } from "@/app/services/apiClient";

// Get all Rubros
export const getRubros = async (page = 1, limit = 100, search = "") => {
  return fetchWithAuth(`/rubro?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
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
