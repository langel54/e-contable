import PropTypes from "prop-types";
import { Box, Grid, Typography, useTheme, alpha } from "@mui/material";

// project import
// import AuthBackground from "../assets/images/auth/AuthBackground";
import AuthCard from "./AuthCard";
import AuthFooter from "../ui-components/cards/AuthFooter";
import Logo from "../ui-components/logo/LogoMain";

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  const theme = useTheme();
  
  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Grid container sx={{ minHeight: "100vh" }}>
        <Grid
          item
          xs={12}
          md={6}
          lg={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: { xs: 3, sm: 4, md: 6 },
            bgcolor: "background.paper",
            zIndex: 1,
            position: "relative"
          }}
        >
          <Box>
            <Logo />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%"
            }}
          >
            <AuthCard>{children}</AuthCard>
          </Box>
          <Box sx={{ mt: 2 }}>
            <AuthFooter />
          </Box>
        </Grid>
        
        <Grid
          item
          xs={0}
          md={6}
          lg={7}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "url('/accounting_login_bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.9,
              zIndex: 0,
              mixBlendMode: "overlay"
            }
          }}
        >
          {/* Abstract background shapes */}
          <Box 
            sx={{
              position: "absolute",
              top: "-15%",
              left: "-10%",
              width: "70%",
              height: "70%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(theme.palette.background.paper, 0.15)} 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
          <Box 
            sx={{
              position: "absolute",
              bottom: "-10%",
              right: "-10%",
              width: "60%",
              height: "60%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main || theme.palette.info.main, 0.4)} 0%, transparent 70%)`,
              filter: "blur(60px)",
            }}
          />
          <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", p: 4 }}>
             <Typography variant="h2" color="white" fontWeight={700} gutterBottom sx={{ textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
               Gestión Integral
             </Typography>
             <Typography variant="h5" color="rgba(255,255,255,0.85)" fontWeight={400} sx={{ maxWidth: 500, mx: "auto" }}>
               Administra tus ingresos, gastos y reportes contables con una plataforma moderna, rápida y segura.
             </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
