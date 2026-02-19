// services/tipoDocumentoService.js

import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener todos los tipos de documento con paginación
export const getTiposDocumento = async (page = 1, limit = 10, search) => {
  return fetchWithAuth(
    `/tipodocumento?page=${page}&limit=${limit}&search=${search}`
  );
};

// Obtener un tipo de documento por ID
export const getTipoDocumentoById = async (idtipo_doc) => {
  return fetchWithAuth(`/tipodocumento/${idtipo_doc}`);
};

// Crear un nuevo tipo de documento
export const createTipoDocumento = async (data) => {
  return fetchWithAuth("/tipodocumento", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar un tipo de documento existente
export const updateTipoDocumento = async (idtipo_doc, data) => {
  return fetchWithAuth(`/tipodocumento/${idtipo_doc}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar un tipo de documento
export const deleteTipoDocumento = async (idtipo_doc) => {
  return fetchWithAuth(`/tipodocumento/${idtipo_doc}`, {
    method: "DELETE",
  });
};
