"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import BlockIcon from "@mui/icons-material/Block";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <BlockIcon sx={{ fontSize: 64, color: "error.main" }} />
      <Typography variant="h5" component="h1">
        Sin permisos
      </Typography>
      <Typography color="text.secondary" textAlign="center">
        No tienes permiso para ver esta sección. Contacta al administrador si crees que es un error.
      </Typography>
      <Button variant="contained" onClick={() => router.push("/main")}>
        Volver al inicio
      </Button>
    </Box>
  );
}
