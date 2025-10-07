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
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
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
      importe_reg: "",
      importe_pc: 0,
      estado: "0",
      obs: "",
      //registra: user?.personal?.nombres || user?.username || "",
    }
  );

  const [selectedClient, setSelectedClient] = useState(
    tributoEdit ? { ...tributoEdit.cliente_prov } : null
  );
  const [tiposTributo, setTiposTributo] = useState([]);
  const [loading, setLoading] = useState(false);

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
          : tributoEdit.mes || dayjs().format("MM")
        ).padStart(2, "0"),
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
        mes: dayjs().format("MM"),
        importe_reg: "",
        estado: "0",
        obs: "",
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
  }, [selectedClient]);

  const transformResponse = (response) => ({
    items: response.clientesProvs || [],
    total: response.pagination?.total || 0,
  });

  const fetchClients = async ({ page, pageSize, search }) => {
    return getClientesProvs(page, pageSize, search, 1);
  };

  const handleSubmit = async (values, setFieldError, setSubmitting) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
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
        await createTributo(payload);
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
                  value={dayjs(values.fecha_v).format("YYYY-MM-DD")}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.fecha_v)}
                  helperText={errors.fecha_v}
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
                    onChange={handleChange}
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
                  <Select name="mes" value={values.mes} onChange={handleChange}>
                    {months.map((m) => (
                      <MenuItem key={m.value} value={m.value}>
                        {m.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

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
