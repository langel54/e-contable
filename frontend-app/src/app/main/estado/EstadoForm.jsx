import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Stack } from "@mui/material";
import { createEstado, updateEstado } from "@/app/services/estadoDocServices";
import Swal from "sweetalert2";

const EstadoForm = ({ initialData, handleCloseModal }) => {
  const initialValues = {
    nom_estado: initialData?.nom_estado || "",
  };

  const validationSchema = Yup.object({
    nom_estado: Yup.string().required("El nombre del estado es obligatorio"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (initialData) {
        await updateEstado(initialData.idestado, values);
        Swal.fire("Éxito", "Estado actualizado correctamente", "success");
      } else {
        await createEstado(values);
        Swal.fire("Éxito", "Estado creado correctamente", "success");
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
              name="nom_estado"
              label="Nombre del Estado"
              fullWidth
              error={touched.nom_estado && Boolean(errors.nom_estado)}
              helperText={touched.nom_estado && errors.nom_estado}
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

export default EstadoForm;
