// services/formaPagoTribServices.js
import { fetchWithAuth } from "@/app/services/apiClient";

export const getFormaPagoTribs = async (page = 1, limit = 10, search) => {
  return fetchWithAuth(`/formapagotrib?page=${page}&limit=${limit}&search=${search || ""}`);
};

export const getFormaPagoTribById = async (id) => {
  return fetchWithAuth(`/formapagotrib/${id}`);
};

export const createFormaPagoTrib = async (data) => {
  return fetchWithAuth("/formapagotrib", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateFormaPagoTrib = async (id, data) => {
  return fetchWithAuth(`/formapagotrib/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteFormaPagoTrib = async (id) => {
  return fetchWithAuth(`/formapagotrib/${id}`, {
    method: "DELETE",
  });
};
