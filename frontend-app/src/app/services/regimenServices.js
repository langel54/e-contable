import { fetchWithAuth } from "@/app/services/apiClient";

// Get all Regimenes
export const getRegimenes = async () => {
  return fetchWithAuth("/regimen");
};

// Create a new Regimen
export const createRegimen = async (data) => {
  return fetchWithAuth("/regimen", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing Regimen
export const updateRegimen = async (id, data) => {
  return fetchWithAuth(`/regimen/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a Regimen
export const deleteRegimen = async (id) => {
  return fetchWithAuth(`/regimen/${id}`, {
    method: "DELETE",
  });
};
