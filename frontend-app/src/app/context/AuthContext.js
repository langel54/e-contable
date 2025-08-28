import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: async (email, password) => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar token al cargar
    const token = authService.getToken();
    if (token) {
      setIsAuthenticated(true);
      // Aquí podrías hacer una llamada a la API para obtener los datos del usuario
    }
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setIsAuthenticated(true);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
