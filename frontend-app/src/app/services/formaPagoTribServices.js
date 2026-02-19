
import { fetchWithAuth } from "./apiClient";

const endpoint = "/formapagotrib";

export const getFormasPagoTrib = async (page = 0, limit = 10) => {
  const skip = page * limit;
  return fetchWithAuth(`${endpoint}?skip=${skip}&limit=${limit}`);
};

export const getFormaPagoTribById = async (id) => {
  return fetchWithAuth(`${endpoint}/${id}`);
};

export const createFormaPagoTrib = async (data) => {
  return fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateFormaPagoTrib = async (id, data) => {
  return fetchWithAuth(`${endpoint}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteFormaPagoTrib = async (id) => {
  return fetchWithAuth(`${endpoint}/${id}`, {
    method: "DELETE",
  });
};
