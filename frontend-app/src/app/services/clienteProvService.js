import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Helper function to handle API calls
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

// Get all clients with pagination
export const getClientesProvs = async (
  page = 1,
  limit = 10,
  search,
  status
) => {
  return fetchWithAuth(
    `/clienteproveedor?page=${page}&limit=${limit}&search=${search}&status=${status}`
  );
};
export const getFilterClientesProvs = async (
  page = 1,
  limit = 10,
  digito,
  regimen,
  status,
  planilla
) => {
  return fetchWithAuth(
    `/clienteproveedor/filter?page=${page}&limit=${limit}&digito=${digito}&regimen=${regimen}&status=${status}&planilla=${planilla}`
  );
};

// Get single client by ID
export const getClienteProvById = async (id) => {
  return fetchWithAuth(`/clienteproveedor/${id}`);
};

// Create new client
export const createClienteProv = async (data) => {
  return fetchWithAuth("/clienteproveedor", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update existing client
export const updateClienteProv = async (id, data) => {
  return fetchWithAuth(`/clienteproveedor/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete client
export const deleteClienteProv = async (id) => {
  return fetchWithAuth(`/clienteproveedor/${id}`, {
    method: "DELETE",
  });
};

// Get regimens
export const getRegimens = async () => {
  return fetchWithAuth("/regimen");
};

// Get rubros
export const getRubros = async () => {
  return fetchWithAuth("/rubro");
};

// Get facturadores
export const getFacturadores = async () => {
  return fetchWithAuth("/facturador");
};

// Search clients
export const searchClientesProvs = async (searchTerm) => {
  return fetchWithAuth(
    `/clienteprov/search?term=${encodeURIComponent(searchTerm)}`
  );
};

// Bulk operations
export const bulkCreateClientesProvs = async (clients) => {
  return fetchWithAuth("/clienteprov/bulk", {
    method: "POST",
    body: JSON.stringify({ clients }),
  });
};

// Example usage of validation before sending to API
export const validateClienteProv = (data) => {
  const errors = {};

  if (!data.razonsocial) {
    errors.razonsocial = "La razón social es requerida";
  }

  if (data.ruc && !/^\d{11}$/.test(data.ruc)) {
    errors.ruc = "El RUC debe tener 11 dígitos";
  }

  if (data.dni && !/^\d{8}$/.test(data.dni)) {
    errors.dni = "El DNI debe tener 8 dígitos";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
export const getValidateRuc = async (ruc, action, idclienteprov) => {
  return fetchWithAuth(
    "/clienteproveedor/validate-ruc/" +
      ruc +
      "?action=" +
      action +
      "&idclienteprov=" +
      idclienteprov
  );
};
export const updateDeclaradoTodos = async (nuevoEstado) => {
  return fetchWithAuth("/clienteproveedor/update-declarado", {
    method: "PUT",
    body: JSON.stringify({ declarado: nuevoEstado }), // Enviamos el estado que queremos actualizar
  });
};
