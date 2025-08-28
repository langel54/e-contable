// "use client";

// import LoginPage from "./login/page";

// export default function HomePage() {
//   return (
//     <main style={{ padding: "20px" }}>
//       <h1>Welcome to My App</h1>
//       <p>Please log in to access your dashboard:</p>
//       <LoginPage /> {/* Aquí se incluye tu componente de login */}
//     </main>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./provider";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authentication");
    } else {
      router.push("/main"); // O cualquier ruta protegida
    }
  }, [isAuthenticated, router]);

  return null;
}

// "use client";

// import { Typography, Button, TextField, Card, Box } from "@mui/material";

// export default function HomePage() {
//   return (
//     <Box sx={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
//       <Typography variant="h4" gutterBottom>
//         Bienvenido a la App
//       </Typography>

//       <Card sx={{ padding: "16px", marginBottom: "16px" }}>
//         <Typography variant="body1">
//           Esta es una aplicación personalizada con Material UI.
//         </Typography>
//       </Card>

//       <TextField label="Ingresa tu nombre" fullWidth margin="normal" />
//       <Button variant="contained" color="primary" fullWidth>
//         Enviar
//       </Button>
//     </Box>
//   );
// }
