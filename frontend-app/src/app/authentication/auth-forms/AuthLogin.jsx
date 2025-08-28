import PropTypes from "prop-types";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// import { Link as RouterLink } from "react-router-dom";

// material-ui
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// assets
import { EyeOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined } from "@ant-design/icons";
import FirebaseSocial from "./FirebaseSocial";
import AnimateButton from "@/app/ui-components/@extended/AnimateButton";
import { Box } from "@mui/material";
import { useAuth } from "@/app/provider";

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().max(255).required("Ingrese un correo o usuario."),
          password: Yup.string().max(255).required("Ingrese una contraseña"),
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            await login(values.email, values.password);
            router.push("/main");
          } catch (err) {
            setErrors({ submit: err.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ width: "100%" }}>
              <Box sx={{ width: "100%" }}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">
                    Correo electrónico / Usuario
                  </InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Ingrese Correo o Usuario"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {errors.email}
                  </FormHelperText>
                )}
              </Box>
              <Box sx={{ width: "100%" }}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Contraseña</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? (
                            <EyeOutlined />
                          ) : (
                            <EyeInvisibleOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Ingrese una contraseña"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-password-login"
                  >
                    {errors.password}
                  </FormHelperText>
                )}
              </Box>

              <Stack sx={{ mt: -1, width: "100%" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Recordar datos</Typography>}
                  />
                  <Link
                    variant="h6"
                    // component={RouterLink}
                    color="text.primary"
                  >
                    ¿Olvidó contraseña?
                  </Link>
                </Stack>
              </Stack>
              {errors.submit && (
                <Box sx={{ width: "100%" }}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}
              <Box sx={{ width: "100%" }}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    ACCEDER
                  </Button>
                </AnimateButton>
              </Box>
              <Box sx={{ width: "100%" }}>
                {" "}
                <Divider>
                  <Typography variant="caption"> Iniciar con</Typography>
                </Divider>
              </Box>
              <Box sx={{ width: "100%" }}>
                {" "}
                <FirebaseSocial />
              </Box>
            </Stack>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
