// services/apiClient.js

import Cookies from "js-cookie";
import { notifyNetworkError, NETWORK_ERROR_MESSAGE } from "./networkErrorHandler";
import { API_BASE } from "./apiConfig";

// Función reutilizable para hacer peticiones a la API con autenticación
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = Cookies.get("token");
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const msg = error.message || error.error || "Error en la petición";
      const err = new Error(msg);
      err.status = response.status;
      throw err;
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    // Handle network errors (Failed to fetch, CORS, etc.)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      notifyNetworkError();
      throw new Error(NETWORK_ERROR_MESSAGE);
    }
    // Re-throw other errors
    throw error;
  }
};
