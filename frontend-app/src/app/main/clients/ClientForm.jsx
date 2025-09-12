import React, { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
  FormHelperText,
  FormControlLabel,
  Switch,
  Stack,
  Divider,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getRubros } from "@/app/services/rubroServices";
import { getRegimenes } from "@/app/services/regimenServices";
import { getEstadoClientes } from "@/app/services/estadoClienteServices";
import { digitos, tipoCronograma } from "./configs";
import { getFacturadores } from "@/app/services/facturadorServices";
import {
  step1ValidationSchema,
  step2ValidationSchema,
  step3ValidationSchema,
  step4ValidationSchema,
} from "./formValidations";
import {
  createClienteProv,
  updateClienteProv,
} from "@/app/services/clienteProvService";
import { clientsStore } from "@/app/store/clientsStore";
const steps = [
  "Datos Generales",
  "Información Financiera",
  "Detalles Adicionales",
  "Contactos",
];

const ClientForm = ({
  handleCloseModal,
  initialData = null,
  formAction = "update",
  idclienteprov = null,
}) => {
  const initialValues = initialData || {
    razonsocial: "",
    ruc: "",
    dni: "",
    contacto: "",
    telefono: 0,
    direccion: "",
    responsable: "",
    montoref: "",
    estado: "1",
    nrubro: "",
    nregimen: "",
    u_digito: "",
    fecha_ingreso: new Date().toISOString().split("T")[0],
    c_usuario: "",
    c_passw: "",
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
    montoref: "",
    obs: "",
    honorario_anual: "",
    idfacturador: 3,
    f_pass: "",
    f_usuario: "",
    fact_elect: "SI",
  };

  const theme = useTheme();
  const { addClient, updateClient } = clientsStore();

  const [activeStep, setActiveStep] = useState(0);
  const [rubros, setRubros] = useState([]);
  const [regimenes, setRegimenes] = useState([]);
  const [estadoCliente, setEstadoCliente] = useState([]);
  const [facturadores, setFacturadores] = useState([]);

  const handleNext = async (validateForm, setErrors, setTouched) => {
    setTouched({ ruc: true }); // 👈 Marca el campo como tocado

    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      setErrors(errors);
    }
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // const handleSubmit = async (values, setSubmitting, setFieldError) => {
  //   try {
  //     const response = initialData
  //       ? await updateClienteProv(values.idclienteprov, values)
  //       : await createClienteProv(values);

  //     if (!response) {
  //       const errorData = await response;
  //       setFieldError(
  //         "general",
  //         errorData.message || "Error al procesar cliente/proveedor"
  //       );
  //     } else {
  //       console.log(
  //         initialData ? "Actualizado correctamente" : "Creado correctamente"
  //       );
  //       handleCloseModal();
  //     }
  //   } catch (error) {
  //     setFieldError(
  //       "general",
  //       `Error al ${initialData ? "actualizar" : "crear"} usuario - Servidor:` +
  //         error
  //     );
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async (values, setSubmitting, setFieldError) => {
    try {
      let result;

      if (initialData) {
        // Modo edición

        result = await updateClient(values.idclienteprov, values);
      } else {
        // Modo creación
        result = await addClient(values);
      }

      if (!result.success) {
        setFieldError(
          "general",
          result.error || "Error al guardar cliente/proveedor"
        );
      } else {
        console.log(
          initialData ? "Actualizado correctamente" : "Creado correctamente"
        );
        handleCloseModal(); // Cierra el modal solo si todo salió bien
      }
    } catch (error) {
      setFieldError(
        "general",
        `Error inesperado al ${initialData ? "actualizar" : "crear"}: ${error}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fetchRubros = async () => {
    try {
      const data = await getRubros();
      setRubros(data.rubros); // Asume que la respuesta es un array de rubros
    } catch (error) {
      console.error("Error fetching rubros:", error);
    }
  };

  const fetchRegimenes = async () => {
    try {
      const data = await getRegimenes();
      setRegimenes(data.regimenes);
    } catch (error) {
      console.error("Error fetching regimenes:", error);
    }
  };
  const fetchEstadoClientes = async () => {
    try {
      const data = await getEstadoClientes();
      setEstadoCliente(data.estadoClientes);
    } catch (error) {
      console.error("Error fetching estadoClientes:", error);
    }
  };
  const fetchFacturadores = async () => {
    try {
      const data = await getFacturadores();
      setFacturadores(data.facturadores);
    } catch (error) {
      console.error("Error al obtener facturadores:", error);
    }
  };
  useEffect(() => {
    fetchEstadoClientes();
    fetchRubros();
    fetchRegimenes();
    fetchFacturadores();
  }, []);
  // const digitos = digitos;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Para pantallas pequeñas (<=600px)
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md")); // Para pantallas medianas (600px - 960px)
  const isLarge = useMediaQuery(theme.breakpoints.up("md"));

  const getValidationSchema = (action) => {
    switch (activeStep) {
      case 0:
        return step1ValidationSchema(action, idclienteprov);
      case 1:
        return step2ValidationSchema;
      case 2:
        return step3ValidationSchema;
      case 3:
        return step4ValidationSchema;
      default:
        return Yup.object({});
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(formAction)}
      // onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        values,
        setFieldValue,
        validateForm,
        setErrors,
        errors,
        setSubmitting,
        setFieldError,
        handleBlur,
        touched,
        setTouched,
      }) => (
        <Form>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ p: 3 }}>
            {activeStep === 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isLarge
                    ? "repeat(3, 1fr)" // 3 columnas en pantallas grandes
                    : isMedium
                    ? "repeat(2, 1fr)" // 2 columnas en pantallas medianas
                    : "1fr", // 1 columna en pantallas pequeñas
                  gap: 1,
                }}
              >
                <Field
                  fullWidth
                  name="u_digito"
                  as={TextField}
                  label="Ultimo dígito"
                  select
                  margin="normal"
                  onChange={(e) => setFieldValue("u_digito", e.target.value)}
                  // helperText={<ErrorMessage name="udigito" />}
                  error={!values.u_digito && errors.u_digito}
                  helperText={errors.u_digito}
                >
                  {digitos.map((digito) => (
                    <MenuItem key={digito} value={digito}>
                      {digito}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  fullWidth
                  name="nregimen" // Nombre del campo en el formulario
                  as={TextField}
                  label={
                    regimenes.length > 0
                      ? "Seleccionar Régimen"
                      : "Cargando regimenes"
                  }
                  select
                  margin="normal"
                  onChange={(e) => setFieldValue("nregimen", e.target.value)} // Asignar el valor del regimen
                  error={!values.nregimen && errors.nregimen}
                  helperText={errors.nregimen} // Mostrar errores del campo
                >
                  {regimenes.map((regimen) => (
                    <MenuItem key={regimen.idregimen} value={regimen.nregimen}>
                      {regimen.nregimen} {/* Mostrar el nombre del régimen */}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  fullWidth
                  name="nrubro" // Nombre del campo en el formulario
                  as={TextField}
                  label="Seleccionar Rubro"
                  select
                  margin="normal"
                  onChange={(e) => setFieldValue("nrubro", e.target.value)} // Asignar el valor del nrubro
                  error={!values.nrubro && errors.nrubro}
                  helperText={errors.nrubro} // Mostrar errores del campo
                >
                  {rubros.map((rubro) => (
                    <MenuItem key={rubro.idrubro} value={rubro.nrubro}>
                      {rubro.nrubro} {/* Mostrar el nombre del rubro */}
                    </MenuItem>
                  ))}
                </Field>

                <Field
                  name="ruc"
                  // type="number"
                  as={TextField}
                  label="RUC o DNI"
                  fullWidth
                  margin="normal"
                  error={!values.ruc && errors.ruc}
                  helperText={
                    touched.ruc && errors.ruc ? (
                      <Typography variant="caption" color="error">
                        {errors.ruc}
                      </Typography>
                    ) : null
                  }
                  onBlur={handleBlur}
                  // helperText={<ErrorMessage name="ruc" />}
                />
                <Field
                  name="razonsocial"
                  as={TextField}
                  label="Razón Social"
                  fullWidth
                  margin="normal"
                  error={!values.razonsocial && errors.razonsocial}
                  helperText={errors.razonsocial}
                  sx={{
                    gridColumn: isMobile ? "span 1" : "span 2", // Si no es móvil, ocupa 2 columnas
                  }}
                />
                <Field
                  name="estado"
                  as={TextField}
                  label="Estado"
                  select
                  fullWidth
                  margin="normal"
                  value={values.estado}
                  error={!values.estado && errors.estado}
                  helperText={errors.estado}
                >
                  {estadoCliente.map((estadoCli) => (
                    <MenuItem
                      key={estadoCli.idestadocliente}
                      value={estadoCli.idestadocliente}
                    >
                      {estadoCli.descripcion}{" "}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  fullWidth
                  name="fecha_ingreso"
                  as={TextField}
                  label="Fecha de ingreso"
                  type="date"
                  value={values.fecha_ingreso}
                  margin="normal"
                  error={!values.fecha_ingreso && errors.fecha_ingreso}
                  helperText={errors.fecha_ingreso}
                  onChange={(e) =>
                    setFieldValue("fecha_ingreso", e.target.value)
                  }
                />
              </Box>
            )}
            {activeStep === 1 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isLarge
                    ? "repeat(3, 1fr)" // 3 columnas en pantallas grandes
                    : isMedium
                    ? "repeat(2, 1fr)" // 2 columnas en pantallas medianas
                    : "1fr", // 1 columna en pantallas pequeñas
                  gap: 1,
                }}
              >
                <Field
                  name="c_usuario"
                  as={TextField}
                  label="Usuario SOL"
                  fullWidth
                  margin="normal"
                  error={!values.c_usuario && errors.c_usuario}
                  helperText={
                    <Typography variant="caption" color="error">
                      {errors.c_usuario}
                    </Typography>
                  }
                />

                <Field
                  name="c_passw"
                  as={TextField}
                  label="Contraseña SOL"
                  fullWidth
                  margin="normal"
                  error={!values.c_passw && errors.c_passw}
                  helperText={
                    <Typography variant="caption" color="error">
                      {errors.c_passw}
                    </Typography>
                  }
                />

                <Field
                  fullWidth
                  name="dni"
                  as={TextField}
                  label="DNI"
                  type="number"
                  margin="normal"
                  error={!values.dni && errors.dni}
                  helperText={
                    <Typography variant="caption" color="error">
                      {errors.dni}
                    </Typography>
                  }
                />

                <Field
                  name="clave_afpnet"
                  as={TextField}
                  label="Clave de AFPNet"
                  fullWidth
                  margin="normal"
                />
                <Field
                  name="clave_rnp"
                  as={TextField}
                  label="Clave de RNP"
                  fullWidth
                  margin="normal"
                />
                <Field
                  name="nact_especifica"
                  as={TextField}
                  label="Actividad específica"
                  fullWidth
                  margin="normal"
                />
                <Field
                  name="tipo_cronog"
                  as={TextField}
                  label="Tipo de Gronograma"
                  select
                  fullWidth
                  margin="normal"
                  value={values.tipo_cronog}
                >
                  {tipoCronograma.map((cron, index) => (
                    <MenuItem key={index} value={cron}>
                      {cron}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  fullWidth
                  name="ple_desde"
                  as={TextField}
                  label="PLE desde: "
                  type="date"
                  value={values.ple_desde}
                  margin="normal"
                  error={!values.ple_desde && errors.ple_desde}
                  helperText={
                    <Typography variant="caption" color="error">
                      {errors.ple_desde}
                    </Typography>
                  }
                  InputLabelProps={{
                    shrink: true, // Esto asegura que el label no se superponga
                  }}
                />
                <Field
                  name="cta_detraccion"
                  as={TextField}
                  label="Cuenta de Detracción"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="cta_detraccion" />}
                />
              </Box>
            )}
            {activeStep === 2 && (
              <>
                {/* <Field
                  name="cod_envio"
                  // type="hidden"
                  as={TextField}
                  label="Código de envio"
                  fullWidth
                  margin="normal"
                /> */}
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  flexWrap={"wrap"}
                  sx={{
                    gridColumn: isMobile ? "span 1" : "span 2", // Si no es móvil, ocupa 3 columnas
                    gap: 2, // Añadido para darle espacio entre los switches
                  }}
                >
                  <Field name="pdt_621">
                    {({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={values.pdt_621 === "SI"}
                            onChange={(e) =>
                              setFieldValue(
                                "pdt_621",
                                e.target.checked ? "SI" : "NO"
                              )
                            }
                          />
                        }
                        label="¿Declara PDT 621?"
                        // sx={{ width: isMobile ? "100%" : "50%" }} // Asegura que ocupe todo el ancho disponible
                      />
                    )}
                  </Field>

                  <Field name="planilla_elect">
                    {({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={values.planilla_elect === "SI"}
                            onChange={(e) =>
                              setFieldValue(
                                "planilla_elect",
                                e.target.checked ? "SI" : "NO"
                              )
                            }
                          />
                        }
                        label="¿Declara Planilla Electrónica?"
                        // sx={{ width: isMobile ? "100%" : "50%" }}
                      />
                    )}
                  </Field>

                  <Field name="libro_elect">
                    {({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={values.libro_elect === "SI"}
                            onChange={(e) =>
                              setFieldValue(
                                "libro_elect",
                                e.target.checked ? "SI" : "NO"
                              )
                            }
                          />
                        }
                        label="¿Lleva libros Electrónicos?"
                        // sx={{ width: isMobile ? "100%" : "50%" }}
                      />
                    )}
                  </Field>

                  <Field name="paga_detraccion">
                    {({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={values.paga_detraccion === "SI"}
                            onChange={(e) =>
                              setFieldValue(
                                "paga_detraccion",
                                e.target.checked ? "SI" : "NO"
                              )
                            }
                          />
                        }
                        label="¿Paga con Detracción?"
                        // sx={{ width: isMobile ? "100%" : "50%" }}
                      />
                    )}
                  </Field>

                  <Field name="paga_percepcion">
                    {({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={values.paga_percepcion === "SI"}
                            onChange={(e) =>
                              setFieldValue(
                                "paga_percepcion",
                                e.target.checked ? "SI" : "NO"
                              )
                            }
                          />
                        }
                        label="¿Paga con Percepción?"
                        // sx={{ width: isMobile ? "100%" : "50%" }}
                      />
                    )}
                  </Field>

                  <Field name="compensa_percepcion">
                    {({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={values.compensa_percepcion === "SI"}
                            onChange={(e) =>
                              setFieldValue(
                                "compensa_percepcion",
                                e.target.checked ? "SI" : "NO"
                              )
                            }
                          />
                        }
                        label="¿Compensa con Percepción?"
                        // sx={{ width: isMobile ? "100%" : "50%" }}
                      />
                    )}
                  </Field>

                  <Field name="sujeta_retencion">
                    {({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={values.sujeta_retencion === "SI"}
                            onChange={(e) =>
                              setFieldValue(
                                "sujeta_retencion",
                                e.target.checked ? "SI" : "NO"
                              )
                            }
                          />
                        }
                        label="¿Está sujeto a Retención?"
                        // sx={{ width: isMobile ? "100%" : "50%" }}
                      />
                    )}
                  </Field>

                  <FormHelperText error>
                    <ErrorMessage name="pdt_621" />
                    <ErrorMessage name="planilla_elect" />
                    <ErrorMessage name="libro_elect" />
                  </FormHelperText>
                </Stack>
              </>
            )}
            {activeStep === 3 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isLarge
                    ? "repeat(3, 1fr)"
                    : isMedium
                    ? "repeat(2, 1fr)"
                    : "1fr",
                  gap: 1,
                }}
              >
                <Field
                  name="contacto"
                  as={TextField}
                  label="Nombre del contacto"
                  fullWidth
                  margin="normal"
                  error={!!values.contacto && !values.contacto.trim()}
                  helperText={<ErrorMessage name="contacto" />}
                />
                <Field
                  name="telefono"
                  type="number"
                  as={TextField}
                  label="Teléfono"
                  fullWidth
                  margin="normal"
                  error={!!values.telefono && errors.telefono}
                  helperText={<ErrorMessage name="telefono" />}
                />
                <Field
                  name="direccion"
                  as={TextField}
                  label="Dirección"
                  fullWidth
                  margin="normal"
                  error={!!values.direccion && !values.direccion.trim()}
                  helperText={<ErrorMessage name="direccion" />}
                />
                <Field
                  name="responsable"
                  as={TextField}
                  label="Responsable"
                  fullWidth
                  margin="normal"
                  error={!!values.responsable && !values.responsable.trim()}
                  helperText={<ErrorMessage name="responsable" />}
                />

                <Field
                  name="montoref"
                  as={TextField}
                  label="Honorario Mensual"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!values.montoref && errors.montoref}
                  helperText={<ErrorMessage name="montoref" />}
                />
                <Field
                  name="honorario_anual"
                  as={TextField}
                  label="Honorario Anual"
                  // type="number"
                  fullWidth
                  margin="normal"
                  error={!values.honorario_anual && errors.honorario_anual}
                  helperText={<ErrorMessage name="honorario_anual" />}
                />
                <Divider
                  sx={{
                    gridColumn: isMobile ? "span 1" : "span 3", // Si no es móvil, ocupa 2 columnas
                  }}
                ></Divider>
                <Field fullWidth name="fact_elect">
                  {({ field }) => (
                    <FormControlLabel
                      disabled
                      sx={{
                        gridColumn: isMobile ? "span 1" : "span 3", // Si no es móvil, ocupa 2 columnas
                      }}
                      control={
                        <Switch
                          {...field}
                          checked={values.fact_elect === "SI"}
                          onChange={(e) =>
                            setFieldValue(
                              "fact_elect",
                              e.target.checked ? "SI" : "NO"
                            )
                          }
                        />
                      }
                      label="¿Genera comprobantes electrónicos?"
                    />
                  )}
                </Field>
                <Field
                  fullWidth
                  name="idfacturador" // Nombre del campo en el formulario
                  as={TextField}
                  label="Seleccionar un facturador "
                  select
                  margin="normal"
                >
                  {facturadores.length > 0 ? (
                    facturadores.map((facturador) => (
                      <MenuItem
                        key={facturador.idfacturador}
                        value={parseInt(facturador.idfacturador)}
                      >
                        {facturador.n_facturador}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      No hay facturadores disponibles
                    </MenuItem>
                  )}
                </Field>

                <Field
                  name="f_usuario"
                  as={TextField}
                  label="Usuario/Correo del facturador"
                  fullWidth
                  margin="normal"
                  // error={!!values.f_usuario && !values.f_usuario.trim()}
                  // helperText={<ErrorMessage name="f_usuario" />}
                />
                <Field
                  name="f_pass"
                  as={TextField}
                  label="Contraseña del facturador"
                  fullWidth
                  margin="normal"
                  // error={!!values.f_pass && !values.f_pass.trim()}
                  // helperText={<ErrorMessage name="f_pass" />}
                />
                <Field
                  name="obs"
                  as={TextField}
                  label="Observaciones"
                  fullWidth
                  margin="normal"
                  sx={{
                    gridColumn: isMobile ? "span 1" : "span 3", // Si no es móvil, ocupa 2 columnas
                  }}
                  // error={!values.obs && !values.obs.trim()}
                  // helperText={<ErrorMessage name="obs" />}
                />
              </Box>
            )}
            <Divider></Divider>
            {errors.general && <div className="error">{errors.general}</div>}
            <Box sx={{ mt: 3 }}>
              <Button disabled={activeStep === 0} onClick={() => handleBack()}>
                Atrás
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  // type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  onClick={async () => {
                    const formErrors = await validateForm();
                    if (Object.keys(formErrors).length === 0) {
                      setSubmitting(true);
                      handleSubmit(values, setSubmitting, setFieldError);
                    } else {
                      setSubmitting(false);
                    }
                  }}
                >
                  Enviar
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  onClick={() =>
                    handleNext(validateForm, setErrors, setTouched)
                  }
                >
                  Siguiente
                </Button>
              )}
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ClientForm;
