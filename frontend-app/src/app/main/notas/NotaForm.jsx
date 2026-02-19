"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import { getClientesProvs } from "@/app/services/clienteProvService";
import {
  createNota,
  updateNota,
  deleteNota,
} from "@/app/services/notasServices";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";

// importa TinyMCE localmente (sin usar la nube)
import "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default/icons";

// importa solo los plugins que vas a usar
import "tinymce/plugins/table";
import "tinymce/plugins/code";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/autoresize";
import dayjs from "dayjs";
import { useAuth } from "@/app/provider";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("America/Lima");

const validationSchema = Yup.object({
  cliente: Yup.object().nullable().required("El cliente es obligatorio"),
  // nombre: Yup.string().required("El nombre es obligatorio"),
  contenido: Yup.string().required("El contenido es obligatorio"),
});

export default function NotaForm({ initialData = null, onClose, onSaved }) {
  const { user } = useAuth();

  const [selectedClient, setSelectedClient] = useState(
    initialData?.cliente_prov || null
  );
  const [loading, setLoading] = useState(false);

  const transformResponse = (response) => ({
    items: response.clientesProvs || [],
    total: response.pagination?.total || 0,
  });
  const fetchClients = async ({ page, pageSize, search }) => {
    return getClientesProvs(page, pageSize, search, 1);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
    setLoading(true);
    try {
      const payload = {
        idclienteprov: values.cliente?.idclienteprov,
        contenido: values.contenido,
        ncreador: values.ncreador,
        neditor: values.neditor,
        fecha_ed: dayjs(values.fecha_ed)
          .tz("America/Lima")
          .format("YYYY-MM-DD"),
        n_fecha: dayjs(values.n_fecha).tz("America/Lima").format("YYYY-MM-DD"),
      };

      if (initialData?.idnotas) {
        const editPayload = {
          ...payload,
          neditor: user.personal?.nombres,
          fecha_ed: dayjs().tz("America/Lima").format("YYYY-MM-DD"),
        };

        console.log(
          "🚀 ~ NotaForm ~ ..:",
          dayjs().tz("America/Lima").format("YYYY-MM-DD")
        );
        // Actualizar nota existente
        await updateNota(initialData.idnotas, editPayload);
        await Swal.fire({
          title: "¡Actualizado!",
          text: "La nota ha sido actualizada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Crear nueva nota
        await createNota(payload);
        await Swal.fire({
          title: "¡Registrado!",
          text: "La nota ha sido registrada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      if (onSaved) onSaved();
      if (onClose) onClose();
    } catch (error) {
      const message = error?.message || "Error al guardar la nota";
      setFieldError("general", message);
      Swal.fire({ title: "Error", text: message, icon: "error" });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.idnotas) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      html: `<div style="padding: 10px 32px; text-align: center;">
        <p>Vas a eliminar la nota:</p>
        <ul style="text-align: left; margin: 10px 0" type="square">
          <li>Cliente: ${initialData.cliente_prov?.razonsocial || "N/A"}</li>
          <li>Creador: ${initialData.ncreador || "N/A"}</li>
          <li>Fecha: ${
            initialData.n_fecha
              ? new Date(initialData.n_fecha).toLocaleDateString()
              : "N/A"
          }</li>
        </ul>
        <p style="margin-top: 10px;">Esta acción no se puede revertir.</p>
      </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await deleteNota(initialData.idnotas);
      await Swal.fire({
        title: "¡Eliminado!",
        text: "La nota ha sido eliminada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      if (onSaved) onSaved();
      if (onClose) onClose();
    } catch (error) {
      const message = error?.message || "Error al eliminar la nota";
      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "Entendido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box paddingY={2}>
      <Formik
        initialValues={{
          cliente: initialData?.cliente_prov || null,
          ncreador: initialData?.ncreador || user?.personal?.nombres,
          neditor: user?.personal?.nombres,
          contenido: initialData?.contenido || "",
          fecha_ed: dayjs(initialData?.fecha_ed).format("YYYY-MM-DD") || "",
          n_fecha:
            dayjs(initialData?.n_fecha).format("YYYY-MM-DD") ||
            dayjs().date().format("YYYY-MM-DD"),
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size="medium">
                  <InfiniteSelect
                    fetchData={fetchClients}
                    transformResponse={transformResponse}
                    getOptionLabel={(option) => option.razonsocial}
                    getOptionValue={(option) => option.idclienteprov}
                    label="Buscar Empresa/Cliente"
                    value={values.cliente}
                    onChange={(val) => {
                      setFieldValue("cliente", val);
                      setSelectedClient(val);
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option.idclienteprov}>
                        <div style={{ padding: "8px 0" }}>
                          <div style={{ fontWeight: 500 }}>
                            {option.razonsocial}
                          </div>
                          <Box component="span" sx={{ fontSize: "0.8em", color: "text.secondary" }}>
                            RUC: {option.ruc}
                          </Box>
                        </div>
                      </li>
                    )}
                  />
                </FormControl>
                {!values.cliente && errors.cliente && (
                  <Typography variant="caption" color="error">
                    {errors.cliente}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Registrado:"
                  name="n_fecha"
                  value={values.n_fecha}
                  onChange={handleChange}
                  error={Boolean(errors.n_fecha)}
                  helperText={errors.n_fecha}
                  slotProps={{ input: { readOnly: true } }}
                  type="date"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Registrado por:"
                  name="ncreador"
                  value={values.ncreador}
                  onChange={handleChange}
                  error={Boolean(errors.ncreador)}
                  helperText={errors.ncreador}
                  slotProps={{ input: { readOnly: true } }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Editado:"
                  name="fecha_ed"
                  value={values.fecha_ed}
                  onChange={handleChange}
                  error={Boolean(errors.fecha_ed)}
                  helperText={errors.fecha_ed}
                  slotProps={{ input: { readOnly: true } }}
                  type="date"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Último en editar:"
                  name="neditor"
                  value={values.neditor}
                  onChange={handleChange}
                  error={Boolean(errors.neditor)}
                  helperText={errors.neditor}
                  slotProps={{ input: { readOnly: true } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Contenido
                </Typography>
                <Editor
                  //   apiKey="no-api-key"
                  value={values.contenido}
                  init={{
                    height: 300,
                    menubar: "file edit view insert format tools table help",
                    plugins: "preview code lists link table",
                    toolbar:
                      "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | print preview | code",
                    menubar: false,
                    branding: false,
                    // evita que intente validar API Key
                    base_url: "/tinymce", // importante para autohospedado
                    suffix: ".min",
                    license_key: "gpl",
                  }}
                  onEditorChange={(val) => setFieldValue("contenido", val)}
                />
                {errors.contenido && (
                  <Typography variant="caption" color="error">
                    {errors.contenido}
                  </Typography>
                )}
              </Grid>
              {errors.general && (
                <Grid item xs={12}>
                  <Typography color="error" variant="body2">
                    {errors.general}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={loading || isSubmitting}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading
                      ? "Procesando..."
                      : initialData?.idnotas
                      ? "Actualizar Nota"
                      : "Registrar Nota"}
                  </Button>

                  {initialData?.idnotas && (
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
}
