"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Para App Router
import { useAuth } from "../provider";

export function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, loadingAuth } = useAuth();

  useEffect(() => {
    // Redirige si no estás autenticado y no estamos cargando la autenticación
    if (!loadingAuth && !isAuthenticated) {
      router.push("/authentication");
    }
  }, [isAuthenticated, loadingAuth, router]);

  // Muestra un spinner o algo similar mientras se carga la autenticación
  if (loadingAuth) {
    return <div>Loading...</div>; // Aquí puedes mostrar un spinner de carga
  }

  // Si está autenticado, muestra el contenido
  return isAuthenticated ? children : null;
}
