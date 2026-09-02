import Cookies from "js-cookie";
import { notifyNetworkError, NETWORK_ERROR_MESSAGE } from "./networkErrorHandler";
import { API_BASE } from "./apiConfig";

export const authService = {
  getToken: () => {
    return Cookies.get("token");
  },
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Error en la autenticación");
      }

      const data = await response.json();

      // Guarda el token en una cookie
      Cookies.set("token", data.token, {
        path: "/",
        sameSite: "Strict",
        secure:
          typeof window !== "undefined" &&
          window.location.protocol === "https:",
      });

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        notifyNetworkError();
        throw new Error(NETWORK_ERROR_MESSAGE);
      }
      throw error;
    }
  },
  logout: () => {
    Cookies.remove("token", { path: "/" });
  },
};
