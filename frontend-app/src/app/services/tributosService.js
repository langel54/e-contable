import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Helper function to handle API calls
const handleApiError = async (response) => {
  const error = await response.json().catch(() => ({}));
  const errorMessage = error.message || "Error en la petición";
  
  // Crear un error personalizado con detalles adicionales
  const customError = new Error(errorMessage);
  customError.status = response.status;
  customError.response = response;
  customError.data = error;

  // Personalizar mensajes según el código de estado
  switch (response.status) {
    case 400:
      customError.userMessage = "La solicitud no es válida. Por favor, verifique los datos ingresados.";
      break;
    case 401:
      customError.userMessage = "Sesión expirada. Por favor, vuelva a iniciar sesión.";
      break;
    case 403:
      customError.userMessage = "No tiene permisos para realizar esta acción.";
      break;
    case 404:
      customError.userMessage = "El recurso solicitado no fue encontrado.";
      break;
    case 409:
      customError.userMessage = "No se puede realizar la operación debido a un conflicto.";
      break;
    case 500:
      customError.userMessage = "Error interno del servidor. Por favor, intente más tarde.";
      break;
    default:
      customError.userMessage = "Ocurrió un error inesperado. Por favor, intente nuevamente.";
  }

  throw customError;
};

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = Cookies.get("token");
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    // Para respuestas exitosas sin contenido (204 No Content)
    if (response.status === 204) {
      return { success: true };
    }

    // Para otras respuestas exitosas, intentar parsear el JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    // Si no es JSON, devolver un objeto simple con éxito
    return { success: true };
  } catch (error) {
    if (error.status) {
      throw error; // Re-lanzar errores personalizados
    }
    // Manejar errores de red u otros errores no HTTP
    const networkError = new Error("Error de conexión. Verifique su conexión a internet.");
    networkError.userMessage = "No se pudo conectar al servidor. Por favor, verifique su conexión.";
    throw networkError;
  }
};

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
