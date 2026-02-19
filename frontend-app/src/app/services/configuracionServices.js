// services/configuracionServices.js
import { fetchWithAuth } from "@/app/services/apiClient";

export const getConfiguraciones = async (page = 1, limit = 10, search) => {
  return fetchWithAuth(`/configuracion?page=${page}&limit=${limit}&search=${search || ""}`);
};

export const getCurrentConfig = async () => {
  return fetchWithAuth("/configuracion/current");
};

export const getConfiguracionById = async (id) => {
  return fetchWithAuth(`/configuracion/${id}`);
};

export const createConfiguracion = async (data) => {
  return fetchWithAuth("/configuracion", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateConfiguracion = async (id, data) => {
  return fetchWithAuth(`/configuracion/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteConfiguracion = async (id) => {
  return fetchWithAuth(`/configuracion/${id}`, {
    method: "DELETE",
  });
};
