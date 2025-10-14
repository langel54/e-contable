"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import { getClientesProvs } from "@/app/services/clienteProvService";
import { Editor } from "@tinymce/tinymce-react";

const validationSchema = Yup.object({
  cliente: Yup.object().nullable().required("El cliente es obligatorio"),
  nombre: Yup.string().required("El nombre es obligatorio"),
  contenido: Yup.string().required("El contenido es obligatorio"),
});

export default function NotaForm({ initialData = {}, onSubmit, onCancel }) {
  console.log("🚀 ~ NotaForm ~ initialData:", initialData);
  const [selectedClient, setSelectedClient] = useState(
    initialData.cliente_prov || null
  );

  const transformResponse = (response) => ({
    items: response.clientesProvs || [],
    total: response.pagination?.total || 0,
  });
  const fetchClients = async ({ page, pageSize, search }) => {
    return getClientesProvs(page, pageSize, search, 1);
  };

  return (
    <Box paddingY={2}>
      <Formik
        initialValues={{
          cliente: initialData.cliente_prov || null,
          nombre: initialData.ncreador || initialData.neditor || "",
          contenido: initialData.contenido || "",
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            const payload = {
              ...initialData,
              idclienteprov: values.cliente?.idclienteprov,
              contenido: values.contenido,
              ...(initialData.idnotas
                ? { neditor: values.nombre }
                : { ncreador: values.nombre }),
            };
            await onSubmit(payload);
          } catch (error) {
            setFieldError(
              "general",
              error.message || "Error al guardar la nota"
            );
          } finally {
            setSubmitting(false);
          }
        }}
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
                {!values.cliente && errors.cliente && (
                  <Typography variant="caption" color="error">
                    {errors.cliente}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="medium"
                  label="Nombre"
                  name="nombre"
                  value={values.nombre}
                  onChange={handleChange}
                  error={Boolean(errors.nombre)}
                  helperText={errors.nombre}
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
                    height: 200,
                    menubar: false,
                    plugins: "link lists code",
                    toolbar:
                      "undo redo | bold italic | alignleft aligncenter alignright | code",
                  }}
                  onEditorChange={(val) => setFieldValue("contenido", val)}
                />
                {errors.contenido && (
                  <Typography variant="caption" color="error">
                    {errors.contenido}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={onCancel}
                    color="error"
                    variant="outlined"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Guardar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
