"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Stack } from "@mui/material";
import { createRubro, updateRubro } from "@/app/services/rubroServices";
import Swal from "sweetalert2";

const RubrosForm = ({ initialData, handleCloseModal }) => {
  const initialValues = {
    nrubro: initialData?.nrubro || "",
  };

  const validationSchema = Yup.object({
    nrubro: Yup.string().required("El nombre del rubro es obligatorio"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (initialData) {
        await updateRubro(initialData.nrubro, values);
        Swal.fire("Éxito", "Rubro actualizado correctamente", "success");
      } else {
        await createRubro(values);
        Swal.fire("Éxito", "Rubro creado correctamente", "success");
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
              name="nrubro"
              label="Nombre del Rubro"
              fullWidth
              error={touched.nrubro && Boolean(errors.nrubro)}
              helperText={touched.nrubro && errors.nrubro}
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

export default RubrosForm;
