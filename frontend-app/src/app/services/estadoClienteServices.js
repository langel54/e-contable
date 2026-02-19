import { fetchWithAuth } from "@/app/services/apiClient";

// Servicio para obtener todos los estados de cliente
export const getEstadoClientes = async () => {
  return fetchWithAuth("/estado-cliente");
};

// Servicio para crear un nuevo estado de cliente
export const createEstadoCliente = async (data) => {
  return fetchWithAuth("/estado-cliente", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Servicio para actualizar un estado de cliente existente
export const updateEstadoCliente = async (id, data) => {
  return fetchWithAuth(`/estado-cliente/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Servicio para eliminar un estado de cliente por ID
export const deleteEstadoCliente = async (id) => {
  return fetchWithAuth(`/estado-cliente/${id}`, {
    method: "DELETE",
  });
};
