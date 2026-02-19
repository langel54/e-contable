import { fetchWithAuth } from "@/app/services/apiClient";

const BULK_REQUEST_TIMEOUT_MS = 30000; // 30 s por lote

/** Comprueba que el endpoint de carga masiva esté disponible antes de subir (evita quedarse colgado). */
export const checkBulkAvailable = async () => {
  try {
    const data = await fetchWithAuth("/clienteproveedor/bulk/status");
    return data?.ok === true;
  } catch (e) {
    console.warn("checkBulkAvailable:", e);
    return false;
  }
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
  planilla,
  search = ""
) => {
  return fetchWithAuth(
    `/clienteproveedor/filter?page=${page}&limit=${limit}&digito=${digito}&regimen=${regimen}&status=${status}&planilla=${planilla}&search=${search}`
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

// Bulk create (un lote; para pocos registros o envío por cola desde el frontend)
export const bulkCreateClientes = async (data) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BULK_REQUEST_TIMEOUT_MS);
  try {
    const result = await fetchWithAuth("/clienteproveedor/bulk", {
      method: "POST",
      body: JSON.stringify(Array.isArray(data) ? data : []),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("La petición tardó demasiado. Intente con menos registros o vuelva a intentar.");
    }
    throw err;
  }
};

// Carga grande: envía todos los registros en una petición; el backend procesa en lotes internos (ideal para 100+)
export const bulkCreateClientesLarge = async (data) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BULK_REQUEST_TIMEOUT_MS);
  try {
    const result = await fetchWithAuth("/clienteproveedor/bulk-large", {
      method: "POST",
      body: JSON.stringify(Array.isArray(data) ? data : []),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("La petición tardó demasiado. Intente con menos registros o vuelva a intentar.");
    }
    throw err;
  }
};

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
