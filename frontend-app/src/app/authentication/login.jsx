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
      <Stack spacing={3}>
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            sx={{ mb: { xs: -0.5, sm: 0.5 } }}
          >
            <Typography variant="h3">Iniciar sesión</Typography>
            {/* <Typography
              // component={Link}
              to="/register"
              variant="body1"
              sx={{ textDecoration: "none" }}
              color="primary"
            >
              Crear cuenta
            </Typography> */}
          </Stack>
        </Box>
        <Box>
          <AuthLogin />
        </Box>
      </Stack>
    </AuthWrapper>
  );
}
