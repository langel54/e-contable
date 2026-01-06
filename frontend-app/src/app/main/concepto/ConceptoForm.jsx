import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Stack } from "@mui/material";
import { createConcepto, updateConcepto } from "@/app/services/conceptoServices";
import Swal from "sweetalert2";

const ConceptoForm = ({ initialData, handleCloseModal }) => {
  const initialValues = {
    nombre_concepto: initialData?.nombre_concepto || "",
  };

  const validationSchema = Yup.object({
    nombre_concepto: Yup.string().required("El nombre es obligatorio"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (initialData) {
        await updateConcepto(initialData.idconcepto, values);
        Swal.fire("Éxito", "Concepto actualizado correctamente", "success");
      } else {
        await createConcepto(values);
        Swal.fire("Éxito", "Concepto creado correctamente", "success");
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
              name="nombre_concepto"
              label="Nombre del Concepto"
              fullWidth
              error={touched.nombre_concepto && Boolean(errors.nombre_concepto)}
              helperText={touched.nombre_concepto && errors.nombre_concepto}
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

export default ConceptoForm;
