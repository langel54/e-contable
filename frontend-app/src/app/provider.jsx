import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { authService } from "./services/authService";
import { useRouter } from "next/navigation";
import { getCajasMes } from "./services/cajaMesServices";
import { notifyNetworkError, NETWORK_ERROR_MESSAGE } from "./services/networkErrorHandler";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  estadoClientesProvider: "",
  setEstadoClientesProvider: () => {},
  cajaMes: null,
  setCajaMes: () => {},
  mode: "light",
  toggleMode: () => {},
});

export function AuthProvider({ children }) {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [estadoClientesProvider, setEstadoClientesProvider] = useState("");
  const [cajaMes, setCajaMes] = useState(null); // Estado para cajaMes
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const savedMode = Cookies.get("themeMode");
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    Cookies.set("themeMode", newMode, { expires: 365 });
  };

  useEffect(() => {
    async function inicializarApp() {
      setLoadingAuth(true);
      const token = Cookies.get("token");

      if (token) {
        try {
          // Validar el token
          const response = await fetch(`${API_URL}/validate-token/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            throw new Error("Token inválido");
          }

          const data = await response.json();
          if (data.valid) {
            setIsAuthenticated(true);
            setUser(data.user);
            const tipo = data.user?.tipo_usuario;
            const idTipo = tipo?.id_tipo ?? (typeof tipo === "number" || typeof tipo === "string" ? tipo : null);
            setUserType(idTipo != null ? Number(idTipo) : null);
          } else {
            setIsAuthenticated(false);
            router.push("/authentication");
          }
        } catch (error) {
          if (error instanceof TypeError && error.message === "Failed to fetch") {
            notifyNetworkError();
          } else {
            console.error("Error al validar token:", error);
          }
          setIsAuthenticated(false);
          router.push("/authentication");
        }
      } else {
        setIsAuthenticated(false);
        router.push("/authentication");
      }

      // Obtener la caja con mayor nro
      try {
        const cajaResponse = await getCajasMes(); // Ajusta la URL de tu API
        const cajas = cajaResponse.cajasMensuales;
        if (cajas && cajas.length > 0) {
          const ultimaCaja = cajas.reduce(
            (max, obj) => (obj.nro > max.nro ? obj : max),
            cajas[0]
          );
          setCajaMes(ultimaCaja);
        }
      } catch (error) {
        const isNetworkError =
          (error instanceof TypeError && error.message === "Failed to fetch") ||
          error?.message === NETWORK_ERROR_MESSAGE;
        if (isNetworkError && error?.message !== NETWORK_ERROR_MESSAGE) {
          notifyNetworkError();
        }
        if (!isNetworkError) {
          console.error("Error al obtener las cajas:", error);
        }
      }

      setLoadingAuth(false);
    }

    inicializarApp();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    Cookies.set("token", response.token, { expires: 1 }); // expiracion de token
    setIsAuthenticated(true);
    setUser(response.user);
    const tipo = response.user?.tipo_usuario;
    const idTipo = tipo?.id_tipo ?? (typeof tipo === "number" || typeof tipo === "string" ? tipo : null);
    setUserType(idTipo != null ? Number(idTipo) : null);

    return response;
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loadingAuth,
        userType, // id_tipo del usuario (tabla usuarios / tipo_usuario)
        estadoClientesProvider,
        setEstadoClientesProvider,
        cajaMes,
        setCajaMes,
        mode,
        toggleMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
