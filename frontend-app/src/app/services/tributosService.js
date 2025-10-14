import { fetchWithAuth } from "@/app/services/apiClient";

// Get all tributos with pagination
export const getTributos = async (
  page = 1,
  limit = 10,
  search,
  status
) => {
  return fetchWithAuth(
    `/tributos?page=${page}&limit=${limit}&search=${search}&status=${status}`
  );
};

// Get filtered tributos with advanced filters
export const getFilterTributos = async (
  page = 1,
  limit = 10,
  idclienteprov,
  idtipo_trib,
  anio,
  mes,
  estado
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (idclienteprov) params.append('idclienteprov', idclienteprov);
  if (idtipo_trib) params.append('idtipo_trib', idtipo_trib);
  if (anio) params.append('anio', anio);
  if (mes) params.append('mes', mes);
  if (estado) params.append('estado', estado);

  return fetchWithAuth(`/tributos/filter?${params.toString()}`);
};

// Get tributo by ID
export const getTributoById = async (id) => {
  return fetchWithAuth(`/tributos/${id}`);
};

// Get tributos by cliente
export const getTributosByCliente = async (idclienteprov) => {
  return fetchWithAuth(`/tributos/cliente/${idclienteprov}`);
};

// Create new tributo
export const createTributo = async (tributoData) => {
  return fetchWithAuth("/tributos", {
    method: "POST",
    body: JSON.stringify(tributoData),
  });
};

// Update tributo
export const updateTributo = async (id, tributoData) => {
  return fetchWithAuth(`/tributos/${id}`, {
    method: "PUT",
    body: JSON.stringify(tributoData),
  });
};

// Delete tributo
export const deleteTributo = async (id, force = false) => {
  return fetchWithAuth(`/tributos/${id}${force ? '?force=true' : ''}`, {
    method: "DELETE",
  });
};

// Get tipos de tributo
export const getTiposTributo = async () => {
  return fetchWithAuth("/tipotributo");
};

// Get clientes for filter
export const getClientesForFilter = async () => {
  return fetchWithAuth("/clienteproveedor");
};
