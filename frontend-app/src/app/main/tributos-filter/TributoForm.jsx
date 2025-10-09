import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  Alert,
  Chip,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import { NumericFormat } from "react-number-format";
import {
  createTributo,
  updateTributo,
  deleteTributo,
  getTiposTributo,
} from "@/app/services/tributosService";
import { getVencimientos } from "@/app/services/vencimientosService";
import { getClientesProvs } from "@/app/services/clienteProvService";
import { useAuth } from "@/app/provider";
import Swal from "sweetalert2";

const validationSchema = Yup.object({
  fecha_v: Yup.date().required("La fecha de vencimiento es obligatoria"),
  idclienteprov: Yup.string().required("El cliente es obligatorio"),
  idtipo_trib: Yup.string().required("El tipo de tributo es obligatorio"),
  anio: Yup.number().required("El año es obligatorio"),
  mes: Yup.string().required("El mes es obligatorio"),
  importe_reg: Yup.number()
    .typeError("Ingrese un importe válido")
    .min(0, "No puede ser negativo")
    .required("El importe determinado es obligatorio"),
  estado: Yup.string().oneOf(["0", "1", "A"]).required(),
});

const months = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
  { value: "13", label: "Anual" },
];

const currentYear = dayjs().year();
const years = Array.from({ length: 6 }, (_, idx) => currentYear - idx);

const TributoForm = ({ tributoEdit = null, handleCloseModal, onSaved }) => {
  const { user } = useAuth();

  const [initialValues, setInitialValues] = useState(
    tributoEdit || {
      fecha_v: dayjs().format("YYYY-MM-DD"),
      idclienteprov: "",
      idtipo_trib: "",
      anio: currentYear,
      mes: dayjs().format("MM"),
      importe_reg: 0,
      importe_pc: 0,
      importe_pend: 0,
      estado: "0",
      obs: "",
      fecha_reg: dayjs().format("YYYY-MM-DD mm:ss"),
      //registra: user?.personal?.nombres || user?.username || "",
    }
  );

  const [selectedClient, setSelectedClient] = useState(
    tributoEdit ? { ...tributoEdit.cliente_prov } : null
  );
  const [tiposTributo, setTiposTributo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vencimientoValidado, setVencimientoValidado] = useState(false);
  const [fechaVencimiento, setFechaVencimiento] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  useEffect(() => {
    if (tributoEdit) {
      const mapped = {
        ...tributoEdit,
        fecha_v: tributoEdit.fecha_v
          ? dayjs(tributoEdit.fecha_v).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
        idclienteprov:
          tributoEdit.cliente_prov?.idclienteprov ||
          tributoEdit.idclienteprov ||
          "",
        idtipo_trib:
          tributoEdit.idtipo_trib || tributoEdit.tipo_trib?.idtipo_trib || "",
        anio: tributoEdit.anio || currentYear,
        mes: (typeof tributoEdit.mes === "number"
          ? String(tributoEdit.mes)
          : tributoEdit.mes || dayjs().format("M")
        ).replace(/^0+/, ""),
        importe_reg: tributoEdit.importe_reg ?? "",
        estado: tributoEdit.estado ?? "0",
        obs: tributoEdit.obs ?? "",
        // registra:
        //   tributoEdit.registra ||
        //   user?.personal?.nombres ||
        //   user?.username ||
        //   "",
      };
      setInitialValues(mapped);
      setSelectedClient(
        tributoEdit.cliente_prov ? { ...tributoEdit.cliente_prov } : null
      );
    } else {
      setInitialValues((prev) => ({
        ...prev,
        fecha_v: dayjs().format("YYYY-MM-DD"),
        idclienteprov: "",
        idtipo_trib: "",
        anio: currentYear,
        mes: dayjs().format("M"),
        importe_reg: 0,
        importe_pend: 0,
        estado: "0",
        obs: "",
        fecha_reg: dayjs().format("YYYY-MM-DD"),
        // registra: user?.personal?.nombres || user?.username || "",
      }));
      setSelectedClient(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tributoEdit]);

  useEffect(() => {
    const loadTipos = async () => {
      try {
        const data = await getTiposTributo();
        setTiposTributo(data.tipoTribs || data);
      } catch (e) {
        // noop
      }
    };
    loadTipos();
  }, []);

  useEffect(() => {
    setInitialValues((prev) => ({
      ...prev,
      idclienteprov: selectedClient?.idclienteprov || "",
    }));

    // Si hay cliente seleccionado y ya hay año/mes, validar vencimientos
    if (selectedClient?.u_digito && initialValues.anio && initialValues.mes) {
      setVencimientoValidado(false);
      validarVencimiento(
        initialValues.anio,
        initialValues.mes,
        selectedClient.u_digito
      );
    }
  }, [selectedClient]);

  const transformResponse = (response) => ({
    items: response.clientesProvs || [],
    total: response.pagination?.total || 0,
  });

  const fetchClients = async ({ page, pageSize, search }) => {
    return getClientesProvs(page, pageSize, search, 1);
  };

  const validarVencimiento = async (anio, mes, u_digito) => {
    try {
      // Si no hay cliente seleccionado, no se puede validar
      if (!u_digito) {
        Swal.fire({
          title: "¡Atención!",
          text: "Debe seleccionar un cliente para validar los vencimientos.",
          icon: "warning",
          confirmButtonText: "Entendido",
        });
        return false;
      }

      const response = await getVencimientos(anio, mes, u_digito);
      const vencimientos = response.vencimientos || response;

      if (!vencimientos || vencimientos.length === 0) {
        Swal.fire({
          title: "¡Atención!",
          text: `No existe un registro de vencimientos para el período ${anio}-${mes.padStart(
            2,
            "0"
          )} y régimen ${u_digito}. No se puede registrar el tributo sin fechas de vencimiento configuradas.`,
          icon: "warning",
          confirmButtonText: "Entendido",
        });
        return false;
      } else {
        setFechaVencimiento(
          dayjs(vencimientos.fecha_vencimiento).format("YYYY-MM-DD")
        );
      }

      setVencimientoValidado(true);
      return true;
    } catch (error) {
      console.error("Error validando vencimientos:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo validar las fechas de vencimiento. Intente nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return false;
    }
  };

  const handleSubmit = async (values, setFieldError, setSubmitting) => {
    // Validar vencimientos antes de proceder
    const vencimientoValido = await validarVencimiento(
      values.anio,
      values.mes,
      selectedClient?.u_digito
    );
    if (!vencimientoValido) {
      setSubmitting(false);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        // ...values,
        fecha_v: values.fecha_v,
        idclienteprov: values.idclienteprov,
        idtipo_trib: values.idtipo_trib,
        anio: values.anio?.toString?.() || String(values.anio),
        mes: values.mes,
        importe_reg: values.importe_reg,
        importe_pc: values.importe_pc ?? 0,
        estado: values.estado,
        obs: values.obs,
      };

      if (tributoEdit?.idtributos) {
        await updateTributo(tributoEdit.idtributos, payload);
        Swal.fire({
          title: "¡Actualizado!",
          text: "El tributo ha sido actualizado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createTributo({
          ...payload,
          importe_pend: 0,
          fecha_reg: dayjs().format("YYYY-MM-DD hh:mm"),
        });
        Swal.fire({
          title: "¡Registrado!",
          text: "El tributo ha sido registrado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      if (onSaved) onSaved();
      handleCloseModal();
    } catch (error) {
      const message = error?.message || "Error al guardar tributo";
      setFieldError("general", message);
      Swal.fire({ title: "Error", text: message, icon: "error" });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!tributoEdit?.idtributos) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await deleteTributo(tributoEdit.idtributos);
      Swal.fire({
        title: "¡Eliminado!",
        text: "El tributo ha sido eliminado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      if (onSaved) onSaved();
      handleCloseModal();
    } catch (error) {
      const message = error?.message || "Error al eliminar tributo";
      Swal.fire({ title: "Error", text: message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const titulo = tributoEdit ? "Editar Tributo" : "Registrar Tributo";

  return (
    <Box paddingY={2}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {({
          values,
          handleChange,
          errors,
          validateForm,
          setSubmitting,
          setFieldError,
          setFieldValue,
        }) => (
          <Form>
            <Grid container spacing={2}>
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
                          <div
                            style={{
                              fontSize: "0.8em",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            RUC: {option.ruc}
                          </div>
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
                <TextField
                  fullWidth
                  size="medium"
                  label="Fecha Vencimiento"
                  name="fecha_v"
                  type="date"
                  value={fechaVencimiento}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.fecha_v)}
                  helperText={errors.fecha_v}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Tipo de Tributo</InputLabel>
                  <Select
                    name="idtipo_trib"
                    value={values.idtipo_trib}
                    onChange={handleChange}
                    label="Tipo de Tributo"
                    error={Boolean(errors.idtipo_trib)}
                  >
                    {tiposTributo.map((t) => (
                      <MenuItem key={t.idtipo_trib} value={t.idtipo_trib}>
                        {t.descripcion_t}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {!values.idtipo_trib && errors.idtipo_trib && (
                  <Typography variant="caption" color="error">
                    {errors.idtipo_trib}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Año</InputLabel>
                  <Select
                    name="anio"
                    value={values.anio}
                    onChange={async (e) => {
                      handleChange(e);
                      // Validar vencimientos cuando cambie el año
                      if (
                        e.target.value &&
                        values.mes &&
                        selectedClient?.u_digito
                      ) {
                        setVencimientoValidado(false);
                        await validarVencimiento(
                          e.target.value,
                          values.mes,
                          selectedClient.u_digito
                        );
                      }
                    }}
                  >
                    {years.map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Mes</InputLabel>
                  <Select
                    name="mes"
                    value={values.mes}
                    onChange={async (e) => {
                      handleChange(e);
                      // Validar vencimientos cuando cambie el mes
                      if (
                        e.target.value &&
                        values.anio &&
                        selectedClient?.u_digito
                      ) {
                        setVencimientoValidado(false);
                        await validarVencimiento(
                          values.anio,
                          e.target.value,
                          selectedClient.u_digito
                        );
                      }
                    }}
                  >
                    {months.map((m) => (
                      <MenuItem key={m.value} value={m.value}>
                        {m.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Indicador de validación de vencimientos */}
              {values.anio && values.mes && selectedClient?.u_digito && (
                <Grid item xs={12}>
                  {vencimientoValidado ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {/* <Chip
                            label="✓"
                            color="success"
                            size="small"
                            sx={{ minWidth: 24, height: 24 }}
                          /> */}
                        <Typography variant="body2">
                          Fecha de vencimiento para: {values.anio}-
                          {values.mes.padStart(2, "0")} (Dígito:{" "}
                          {selectedClient.u_digito})
                        </Typography>
                      </Stack>
                    </Alert>
                  ) : (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        No se encontró fecha de vencimiento para: {values.anio}-
                        {values.mes.padStart(2, "0")} (Dígito:{" "}
                        {selectedClient.u_digito})
                      </Typography>
                    </Alert>
                  )}
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <NumericFormat
                  fullWidth
                  size="medium"
                  label="Importe Determinado (S/)"
                  name="importe_reg"
                  value={values.importe_reg}
                  onValueChange={(v) =>
                    setFieldValue("importe_reg", v.floatValue)
                  }
                  thousandSeparator=","
                  //   decimalSeparator=",".".replace(",",".")
                  decimalScale={2}
                  fixedDecimalScale
                  customInput={TextField}
                  error={Boolean(errors.importe_reg)}
                  helperText={errors.importe_reg ? errors.importe_reg : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estado"
                    value={values.estado}
                    onChange={handleChange}
                    disabled
                  >
                    <MenuItem value="0">Pendiente</MenuItem>
                    <MenuItem value="1">Cancelado</MenuItem>
                    <MenuItem value="A">Anulado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="medium"
                  label="Observación"
                  name="obs"
                  multiline
                  rows={2}
                  value={values.obs}
                  onChange={handleChange}
                />
              </Grid>

              {/*<Grid item xs={12} md={6}>
              <TextField
                disabled
                fullWidth
                size="medium"
                label="Registrado por"
                name="registra"
                value={values.registra}
                onChange={handleChange}
              />
            </Grid>*/}

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    onClick={async () => {
                      const formErrors = await validateForm();
                      if (Object.keys(formErrors).length === 0) {
                        setSubmitting(true);
                        handleSubmit(values, setFieldError, setSubmitting);
                      } else {
                        setSubmitting(false);
                      }
                    }}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading
                      ? "Procesando..."
                      : tributoEdit
                      ? "Actualizar Tributo"
                      : "Registrar Tributo"}
                  </Button>

                  {tributoEdit && (
                    <Button
                      variant="outlined"
                      color="error"
                      disabled={loading}
                      onClick={handleDelete}
                      startIcon={
                        loading ? <CircularProgress size={20} /> : null
                      }
                    >
                      Eliminar
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default TributoForm;
