import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Helper para llamadas API con autenticación
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = Cookies.get("token");
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error en la petición");
  }

  return response.json();
};

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
