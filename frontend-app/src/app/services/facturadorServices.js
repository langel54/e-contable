import { fetchWithAuth } from "@/app/services/apiClient";

// Get all Facturadores
export const getFacturadores = async (page = 0, limit = 10, search = "") => {
  // El controller usa skip y limit. skip = page * limit.
  // Pero en el Page pasamos page (0-indexed) y pageSize.
  // Controller: const { skip, limit } = req.query; const skip = (page - 1) * limit; WAIT.
  // Step 36: const { skip, limit } = req.query; (Directamente usa skip).
  // En otros controllers como Concepto (Step 30): const { page = 1, limit = 10 } = req.query; const skip = (page - 1) * limit;
  // Facturador controller (Step 36): async getAll(req, res) { const { skip, limit } = req.query; ... await facturadorService.getAll(parseInt(skip)...) }
  // OJO: ClientPage usa page 0-indexed.
  // Si FacturadorController usa 'skip' directo, debo calcularlo.
  const skip = page * limit; 
  return fetchWithAuth(`/facturador?skip=${skip}&limit=${limit}&search=${encodeURIComponent(search)}`);
};

// Create a new Facturador
export const createFacturador = async (data) => {
  return fetchWithAuth("/facturador", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing Facturador
export const updateFacturador = async (id, data) => {
  return fetchWithAuth(`/facturador/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a Facturador
export const deleteFacturador = async (id) => {
  return fetchWithAuth(`/facturador/${id}`, {
    method: "DELETE",
  });
};
