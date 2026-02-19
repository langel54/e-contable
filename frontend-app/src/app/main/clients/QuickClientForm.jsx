import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getRubros } from "@/app/services/rubroServices";
import { getRegimenes } from "@/app/services/regimenServices";
import { getEstadoClientes } from "@/app/services/estadoClienteServices";
import { getFacturadores } from "@/app/services/facturadorServices";
import { digitos } from "./configs";
import { clientsStore } from "@/app/store/clientsStore";
import { useNotification } from "@/app/context/NotificationContext";
import dayjs from "dayjs";

const QuickClientForm = ({ handleCloseModal }) => {
  const { showSuccess, showError } = useNotification();
  const { addClient } = clientsStore();

  const [rubros, setRubros] = useState([]);
  const [regimenes, setRegimenes] = useState([]);
  const [estadoCliente, setEstadoCliente] = useState([]);
  const [facturadores, setFacturadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rubrosData, regimenesData, estadoData, facturadoresData] =
          await Promise.all([
            getRubros(),
            getRegimenes(),
            getEstadoClientes(),
            getFacturadores(),
          ]);

        setRubros(rubrosData.rubros || []);
        setRegimenes(regimenesData.regimenes || []);
        setEstadoCliente(estadoData.estadoClientes || []);
        setFacturadores(facturadoresData.facturadores || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Error al cargar datos necesarios");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showError]);

  // Obtener primeros valores por defecto
  const getDefaultValues = () => {
    const fechaActual = dayjs().format("YYYY-MM-DD");
    return {
      // Valores automáticos
      ruc: "",
      dni: "",
      contacto: "",
      telefono: 0,
      direccion: "",
      responsable: "",
      estado: estadoCliente.length > 0 ? String(estadoCliente[0].idestadocliente) : "1",
      nrubro: rubros.length > 0 ? rubros[0].nrubro : "",
      nregimen: regimenes.length > 0 ? regimenes[0].nregimen : "",
      fecha_ingreso: fechaActual,
      c_usuario: "sol",
      c_passw: "sol",
      cod_envio: "",
      pdt_621: "SI",
      libro_elect: "NO",
      planilla_elect: "NO",
      clave_afpnet: "",
      clave_rnp: "",
      tipo_cronog: "A",
      ple_desde: "",
      cta_detraccion: "",
      nact_especifica: "",
      paga_detraccion: "NO",
      paga_percepcion: "NO",
      compensa_percepcion: "NO",
      sujeta_retencion: "NO",
      obs: "",
      honorario_anual: "0",
      idfacturador: facturadores.length > 0 ? facturadores[0].idfacturador : 3,
      f_pass: "",
      f_usuario: "",
      fact_elect: "SI",
    };
  };

  const validationSchema = Yup.object().shape({
    razonsocial: Yup.string()
      .max(85, "Máximo 85 caracteres")
      .required("Razón social es requerida"),
    ruc: Yup.string()
      .test(
        "len",
        "El valor debe tener 8 u 11 dígitos",
        (value) => value && (value.length === 8 || value.length === 11)
      )
      .required("Este campo es requerido"),
    u_digito: Yup.string().required("El dígito es requerido"),
    montoref: Yup.string().required("El monto referencial es requerido"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Obtener valores por defecto
      const defaults = getDefaultValues();
      
      // Determinar si es RUC (11 dígitos) o DNI (8 dígitos)
      const documentoValue = values.ruc.trim();
      const isRUC = documentoValue.length === 11;
      const isDNI = documentoValue.length === 8;

      // Preparar datos con valores por defecto
      const clientData = {
        ...defaults,
        razonsocial: values.razonsocial,
        u_digito: values.u_digito,
        montoref: values.montoref,
        // Asignar RUC o DNI según la longitud
        // El backend requiere que ruc siempre tenga un valor
        ruc: documentoValue, // Siempre enviar el valor en ruc
        dni: isDNI ? documentoValue : "", // Si es DNI, también enviarlo en dni
      };

      const result = await addClient(clientData);

      if (!result.success) {
        const errorMsg = result.error || "Error al crear cliente/beneficiario";
        setFieldError("general", errorMsg);
        showError(errorMsg);
      } else {
        showSuccess("Cliente/Beneficiario creado correctamente");
        handleCloseModal();
      }
    } catch (error) {
      const errorMsg = `Error inesperado: ${error.message || error}`;
      setFieldError("general", errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Cargando datos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Formik
        initialValues={{
          razonsocial: "",
          ruc: "",
          u_digito: "",
          montoref: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          setFieldValue,
          setFieldError,
        }) => (
          <Form>
            <Stack spacing={3}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Modo rápido: Solo complete los campos esenciales. Los demás
                  se llenarán automáticamente con valores por defecto.
                </Typography>
              </Alert>

              {errors.general && (
                <Alert severity="error">{errors.general}</Alert>
              )}

              <Field
                name="u_digito"
                as={TextField}
                label="Último dígito"
                select
                fullWidth
                value={values.u_digito}
                onChange={(e) => setFieldValue("u_digito", e.target.value)}
                error={touched.u_digito && Boolean(errors.u_digito)}
                helperText={
                  touched.u_digito && errors.u_digito ? (
                    <Typography variant="caption" color="error">
                      {errors.u_digito}
                    </Typography>
                  ) : null
                }
              >
                {digitos.map((digito) => (
                  <MenuItem key={digito} value={digito}>
                    {digito === "B" ? `${digito} (Beneficiario)` : digito}
                  </MenuItem>
                ))}
              </Field>

              <Field
                name="ruc"
                as={TextField}
                label="RUC o DNI"
                fullWidth
                value={values.ruc}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ruc && Boolean(errors.ruc)}
                helperText={
                  touched.ruc && errors.ruc ? (
                    <Typography variant="caption" color="error">
                      {errors.ruc}
                    </Typography>
                  ) : null
                }
                inputProps={{ maxLength: 11 }}
              />

              <Field
                name="razonsocial"
                as={TextField}
                label="Razón Social / Nombres"
                fullWidth
                value={values.razonsocial}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.razonsocial && Boolean(errors.razonsocial)}
                helperText={
                  touched.razonsocial && errors.razonsocial ? (
                    <Typography variant="caption" color="error">
                      {errors.razonsocial}
                    </Typography>
                  ) : null
                }
              />

              <TextField
                name="montoref"
                label="Honorario Mensual (Monto Referencial)"
                fullWidth
                type="number"
                value={values.montoref}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.montoref && Boolean(errors.montoref)}
                helperText={
                  touched.montoref && errors.montoref ? (
                    <Typography variant="caption" color="error">
                      {errors.montoref}
                    </Typography>
                  ) : null
                }
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>S/</Typography>,
                }}
              />

              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  <strong>Valores automáticos:</strong>
                  <br />
                  • Usuario SOL: sol
                  <br />
                  • Contraseña SOL: sol
                  <br />
                  • Honorario Anual: 0
                  <br />
                  • Fecha de Ingreso: {dayjs().format("DD/MM/YYYY")}
                  <br />
                  • Régimen: {regimenes[0]?.nregimen || "Primero disponible"}
                  <br />
                  • Rubro: {rubros[0]?.nrubro || "Primero disponible"}
                  <br />
                  • Estado: {estadoCliente[0]?.descripcion || "Activo"}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Crear Cliente/Beneficiario"}
                </Button>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default QuickClientForm;
