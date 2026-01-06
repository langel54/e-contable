import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Stack } from "@mui/material";
import { createFacturador, updateFacturador } from "@/app/services/facturadorServices";
import Swal from "sweetalert2";

const FacturadorForm = ({ initialData, handleCloseModal }) => {
  const initialValues = {
    n_facturador: initialData?.n_facturador || "",
    f_obs: initialData?.f_obs || "",
  };

  const validationSchema = Yup.object({
    n_facturador: Yup.string().required("El nombre del facturador es obligatorio"),
    f_obs: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (initialData) {
        await updateFacturador(initialData.idfacturador, values);
        Swal.fire("Éxito", "Facturador actualizado correctamente", "success");
      } else {
        await createFacturador(values);
        Swal.fire("Éxito", "Facturador creado correctamente", "success");
      }
      handleCloseModal();
    } catch (error) {
      Swal.fire("Error", error.message || "Ocurrió un error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Box sx={{ p: 2 }}>
            <Field
              as={TextField}
              name="n_facturador"
              label="Nombre del Facturador"
              fullWidth
              error={touched.n_facturador && Boolean(errors.n_facturador)}
              helperText={touched.n_facturador && errors.n_facturador}
              margin="normal"
            />
             <Field
              as={TextField}
              name="f_obs"
              label="Observaciones"
              fullWidth
              error={touched.f_obs && Boolean(errors.f_obs)}
              helperText={touched.f_obs && errors.f_obs}
              margin="normal"
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button onClick={handleCloseModal} color="inherit" variant="outlined">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {initialData ? "Actualizar" : "Guardar"}
              </Button>
            </Stack>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default FacturadorForm;
