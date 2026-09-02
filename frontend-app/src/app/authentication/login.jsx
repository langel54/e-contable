// import { Link } from 'react-router-dom';

// material-ui
// import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// project import
import AuthWrapper from "./AuthWrapper";
import AuthLogin from "./auth-forms/AuthLogin";
import { Box } from "@mui/material";

// ================================|| LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      <Stack spacing={4}>
        <Box>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={1}
            sx={{ mb: { xs: -0.5, sm: 0.5 } }}
          >
            <Typography variant="h3" fontWeight={700}>
              Iniciar sesión
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Bienvenido de vuelta, ingresa tus credenciales para continuar.
            </Typography>
          </Stack>
        </Box>
        <Box>
          <AuthLogin />
        </Box>
      </Stack>
    </AuthWrapper>
  );
}
