// services/conceptoService.js

import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener todos los conceptos con paginación
export const getConceptos = async (page = 1, limit = 10, search) => {
  return fetchWithAuth(
    `/concepto?page=${page}&limit=${limit}&search=${search}`
  );
};

// Obtener un concepto por ID
export const getConceptoById = async (idconcepto) => {
  return fetchWithAuth(`/concepto/${idconcepto}`);
};

// Crear un nuevo concepto
export const createConcepto = async (data) => {
  return fetchWithAuth("/concepto", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar un concepto existente
export const updateConcepto = async (idconcepto, data) => {
  return fetchWithAuth(`/concepto/${idconcepto}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar un concepto
export const deleteConcepto = async (idconcepto) => {
  return fetchWithAuth(`/concepto/${idconcepto}`, {
    method: "DELETE",
  });
};
