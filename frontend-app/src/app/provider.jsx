import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { authService } from "./services/authService";
import { useRouter } from "next/navigation";
import { getCajasMes } from "./services/cajaMesServices";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

          const data = await response.json();
          if (data.valid) {
            setIsAuthenticated(true);
            setUser(data.user);
            setUserType(data.user?.tipo_usuario?.id_tipo); //  aqui esta el tipooooooooooooooo
          } else {
            setIsAuthenticated(false);
            router.push("/authentication");
          }
        } catch (error) {
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
        if (cajas.length > 0) {
          const ultimaCaja = cajas.reduce(
            (max, obj) => (obj.nro > max.nro ? obj : max),
            cajas[0]
          );
          setCajaMes(ultimaCaja);
        }
      } catch (error) {
        console.error("Error al obtener las cajas:", error);
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
    setUserType(response.user?.tipo_usuario?.id_tipo); //  aqui esta el tipooooooooooooooo

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
        userType,
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
