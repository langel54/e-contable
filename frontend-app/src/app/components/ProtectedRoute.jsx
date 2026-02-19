"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../provider";
import Loader from "../ui-components/Loader";

export function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, loadingAuth } = useAuth();

  useEffect(() => {
    // Redirige si no estás autenticado y no estamos cargando la autenticación
    if (!loadingAuth && !isAuthenticated) {
      router.push("/authentication");
    }
  }, [isAuthenticated, loadingAuth, router]);

  // Muestra un loader profesional mientras se carga la autenticación
  if (loadingAuth) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Box sx={{ mt: 2 }}>
          <Loader />
        </Box>
      </Box>
    );
  }

  // Si está autenticado, muestra el contenido
  return isAuthenticated ? children : null;
}
