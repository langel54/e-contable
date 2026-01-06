import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getClientesProvs } from "@/app/services/clienteProvService";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import dayjs from "dayjs";
import { getConceptos } from "@/app/services/conceptoServices";
import { getTiposDocumento } from "@/app/services/tipoDocPagoServices";
import { getEstados } from "@/app/services/estadoDocServices";
import { getCajasMes } from "@/app/services/cajaMesServices";
import { getPeriodos } from "@/app/services/periodoServices";
import { getTiposOperacion } from "@/app/services/tipoOperacionServices";
import { useAuth } from "@/app/provider";
import { NumericFormat } from "react-number-format";
import { createIngreso, updateIngreso } from "@/app/services/incomesServices";

const validationSchema = Yup.object({
  fecha: Yup.date().required("La fecha es obligatoria"),
  //   idtipo_op: Yup.number().required("El tipo de operación es obligatorio"),
  //   idtipo_doc: Yup.number().required("El tipo de documento es obligatorio"),
  //   serie_doc: Yup.string().required("La serie del documento es obligatoria"),
  //   num_doc: Yup.number().required("El número del documento es obligatorio"),
  idclienteprov: Yup.string().required("El cliente/proveedor es obligatorio"),
  idconcepto: Yup.number().required("El concepto es obligatorio"),
  idperiodo: Yup.number().required("El período es obligatorio"),
  anio: Yup.number().nullable(),
  importe: Yup.number()
    .positive("El importe debe ser positivo")
    .required("El importe es obligatorio"),
  idestado: Yup.number().required("El estado es obligatorio"),
  observacion: Yup.string(),
  // registra: Yup.boolean(),
  codcaja_m: Yup.string().required("El código de caja es obligatorio"),
});

const IncomeForm = ({ ingresoEdit = null, handleCloseModal }) => {
  const { cajaMes, user } = useAuth();
  const [initialValues, setInitialValues] = useState(
    ingresoEdit || {
      fecha: dayjs().format("YYYY-MM-DDTHH:mm"),
      idtipo_op: 1,
      idtipo_doc: 1,
      serie_doc: 0,
      num_doc: 0,
      idclienteprov: "",
      idconcepto: "",
      idperiodo: "",
      anio: dayjs().year(),
      importe: "",
      idestado: 1,
      observacion: "",
      registra: user.personal.nombres, // + " " + user.personal.apellidos,
      codcaja_m: cajaMes.codcaja_m,
    }
  );

  const [selectedClient, setSelectedClient] = useState(
    ingresoEdit
      ? { ...ingresoEdit.cliente_prov, montoref: ingresoEdit.importe } // para igualar lo que pide InfiniteSelect
      : null
  );

  const [conceptos, setConceptos] = useState([]);

  const [tipoPago, setTipoPago] = useState([]);

  const [estadoComprobante, setEstadoComprobante] = useState([]);

  const [periodosList, setPeriodosList] = useState([]);
  const [tipoOps, setTipoOps] = useState([]);

  useEffect(() => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      importe: selectedClient?.montoref || "",
      idclienteprov: selectedClient?.idclienteprov || "", // Usamos montoref del cliente seleccionado
    }));
  }, [selectedClient]); // Dependencia en selectedClient para hacer la actualización

  const transformResponse = (response) => ({
    items: response.clientesProvs || [],
    total: response.pagination?.total || 0,
  });

  const fetchClients = async ({ page, pageSize, search }) => {
    return getClientesProvs(page, pageSize, search, 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          conceptosData,
          tipoPagoData,
          estadoComprobanteData,
          periodosData,
          tipoOperacionData,
        ] = await Promise.all([
          getConceptos(),
          getTiposDocumento(),
          getEstados(),
          getPeriodos(),
          getTiposOperacion(),
        ]);

        setConceptos(conceptosData.conceptos);
        setTipoPago(tipoPagoData.tipoDocumentos);
        setEstadoComprobante(estadoComprobanteData.estados);
        setPeriodosList(periodosData.periodos);
        setTipoOps(tipoOperacionData.tiposOperacion);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values, setSubmitting, setFieldError) => {
    try {
      const fechaConZonaHoraria = dayjs(values.fecha).toISOString();
      const valoresProcesados = { ...values, fecha: fechaConZonaHoraria };

      let response;

      if (ingresoEdit) {
        response = await updateIngreso(
          ingresoEdit.idingreso,
          valoresProcesados
        );
      } else {
        response = await createIngreso(valoresProcesados);
      }

      console.log(
        ingresoEdit ? "Actualizado correctamente" : "Creado correctamente"
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error en handleSubmit:", error);

      // Extraer mensaje del backend si está presente
      const errorMessage =
        error.response?.data?.message || // Para respuestas tipo Axios
        error.message || // Para errores normales
        "Error desconocido en el servidor";

      setFieldError(
        "general",
        `Error al ${
          ingresoEdit ? "actualizar" : "agregar"
        } Ingreso: ${errorMessage}`
      );
    } finally {
      setSubmitting(false);
    }
  };
  const anioActual = dayjs().year() + 1;
  const anios = Array.from({ length: 10 }, (_, i) => anioActual - i); // Últimos 10 años

  return (
    <Box paddingY={2}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          validateForm,
          setSubmitting,
          setFieldError,
          setFieldValue,
        }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="medium"
                  label="Fecha"
                  name="fecha"
                  type="datetime-local"
                  value={dayjs(values.fecha).format("YYYY-MM-DDTHH:mm")} // Pasamos el valor formateado
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.fecha)}
                  helperText={errors.fecha}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Tipo de Operación</InputLabel>
                  <Select
                    readOnly
                    disabled
                    name="idtipo_op"
                    value={values.idtipo_op}
                    onChange={handleChange}
                    label="Tipo de Operación"
                    error={Boolean(errors.idtipo_op)}
                  >
                    {tipoOps.map((tipo) => (
                      <MenuItem key={tipo.idtipo_op} value={tipo.idtipo_op}>
                        {tipo.nombre_op}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  disabled
                  fullWidth
                  size="medium"
                  label="Código Caja"
                  name="codcaja_m"
                  value={values.codcaja_m}
                  onChange={handleChange}
                  error={Boolean(errors.codcaja_m)}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControl fullWidth size="medium">
                  <InfiniteSelect
                    fetchData={fetchClients}
                    transformResponse={transformResponse}
                    getOptionLabel={(option) => option.razonsocial}
                    getOptionValue={(option) => option.idclienteprov}
                    label="Buscar Cliente"
                    value={selectedClient}
                    onChange={setSelectedClient}
                    renderOption={(props, option) => (
                      <li {...props} key={option.idclienteprov}>
                        <div style={{ padding: "8px 0" }}>
                          <div style={{ fontWeight: 500 }}>
                            {option.razonsocial}
                          </div>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              display: 'block'
                            }}
                          >
                            RUC: {option.ruc}
                          </Typography>
                        </div>
                      </li>
                    )}
                  />
                </FormControl>
                {!values.idclienteprov && errors.idclienteprov && (
                  <Typography variant="caption" color="error">
                    {errors.idclienteprov}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Concepto</InputLabel>
                  <Select
                    name="idconcepto"
                    value={values.idconcepto}
                    onChange={handleChange}
                    label="Concepto"
                    error={Boolean(errors.idconcepto)}
                  >
                    {conceptos.map((concepto) => (
                      <MenuItem
                        key={concepto.idconcepto}
                        value={concepto.idconcepto}
                      >
                        {concepto.nombre_concepto}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {!values.idconcepto && errors.idconcepto && (
                  <Typography variant="caption" color="error">
                    {errors.idconcepto}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <NumericFormat
                  fullWidth
                  size="medium"
                  label="Importe (S/)"
                  name="importe"
                  value={values.importe}
                  onValueChange={(values) => {
                    setFieldValue("importe", values.floatValue);
                  }}
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  fixedDecimalScale
                  customInput={TextField}
                  error={Boolean(errors.importe)}
                  helperText={errors.importe ? errors.importe : ""}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: (theme) => theme.palette.mode === 'dark' ? '#818cf8' : theme.palette.info.dark,
                      fontWeight: 600,
                      textAlign: "end",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Periodo</InputLabel>
                  <Select
                    name="idperiodo"
                    value={values.idperiodo}
                    onChange={handleChange}
                    error={Boolean(errors.idperiodo)}
                  >
                    {periodosList.map((period) => (
                      <MenuItem key={period.idperiodo} value={period.idperiodo}>
                        {period.nom_periodo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {!values.idperiodo && errors.idperiodo && (
                  <Typography variant="caption" color="error">
                    {errors.idperiodo}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Año</InputLabel>
                  <Select
                    name="anio"
                    value={values.anio}
                    onChange={handleChange}
                    displayEmpty
                  >
                    {anios.map((anio) => (
                      <MenuItem key={anio} value={anio}>
                        {anio}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Forma de Pago</InputLabel>
                  <Select
                    name="idtipo_doc"
                    value={values.idtipo_doc}
                    onChange={handleChange}
                    label="Tipo de Documento"
                  >
                    {tipoPago.map((tipo) => (
                      <MenuItem key={tipo.idtipo_doc} value={tipo.idtipo_doc}>
                        {tipo.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="idestado"
                    value={values.idestado}
                    onChange={handleChange}
                    label="Estado"
                  >
                    {estadoComprobante.map((estado) => (
                      <MenuItem key={estado.idestado} value={estado.idestado}>
                        {estado.nom_estado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  disabled
                  fullWidth
                  size="medium"
                  label="Registrado por:"
                  name="registra"
                  rows={2}
                  value={values.registra}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="medium"
                  label="Observación"
                  name="observacion"
                  multiline
                  rows={2}
                  value={values.observacion}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  // type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={async () => {
                    const formErrors = await validateForm();
                    if (Object.keys(formErrors).length === 0) {
                      setSubmitting(true);
                      handleSubmit(values, setFieldError, setSubmitting);
                    } else {
                      setSubmitting(false);
                    }
                  }}
                >
                  {ingresoEdit ? "Actualizar Ingreso" : "Registrar Ingreso"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default IncomeForm;
