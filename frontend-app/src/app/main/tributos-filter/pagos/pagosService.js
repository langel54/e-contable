import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
  if (response.status === 204) return { success: true };
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return { success: true };
};

export const getFormaPagoTrib = async () => {
  return fetchWithAuth("/formapagotrib");
};

export const getPagosByTributo = async (idtributos) => {
  return fetchWithAuth(`/pagos/tributo/${idtributos}`);
};

export const addPago = async (idtributos, data) => {
  // Convertir importe_p a número si es string
  const importe_p = data.importe_p !== undefined ? Number(data.importe_p) : undefined;
  return fetchWithAuth(`/pagos`, {
    method: "POST",
    body: JSON.stringify({ ...data, idtributos, importe_p }),
  });
};

export const deletePago = async (idpagos) => {
  return fetchWithAuth(`/pagos/${idpagos}`, {
    method: "DELETE",
  });
};
