import PropTypes from "prop-types";

// material-ui
import Grid from "@mui/material/Grid";

// project import
// import AuthFooter from "components/cards/AuthFooter";
// import Logo from "components/logo";
import AuthCard from "./AuthCard";
import AuthBackground from "../assets/images/auth/AuthBackground";
import AuthFooter from "../ui-components/cards/AuthFooter";
import Logo from "../ui-components/logo/LogoMain";
import { Box } from "@mui/material";
// import AuthBackground from "../assets/images/auth/AuthBackground";

// assets
// import AuthBackground from '@assets/images/auth/AuthBackground';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AuthBackground />
      <Box
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "100vh" }}
      >
        <Box sx={{ pl: 3, pt: 3 }}>
          <Logo />
        </Box>
        <Box sx={{ width: "100%" }}>
          <Box
            display={"flex"}
            justifyContent="center"
            alignItems="center"
            sx={{
              width: "100%",
              minHeight: {
                xs: "calc(100vh - 210px)",
                sm: "calc(100vh - 134px)",
                md: "calc(100vh - 112px)",
              },
            }}
          >
            <AuthCard>{children}</AuthCard>
          </Box>
        </Box>
        <Box sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Box>
      </Box>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
