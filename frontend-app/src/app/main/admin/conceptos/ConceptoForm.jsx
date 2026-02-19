
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { createConcepto, updateConcepto } from "@/app/services/conceptoServices";

const validationSchema = Yup.object({
  nombre_concepto: Yup.string().required("El nombre es obligatorio"),
});

const ConceptoForm = ({ handleCloseModal, dataToEdit }) => {
  const initialValues = {
    nombre_concepto: dataToEdit?.nombre_concepto || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (dataToEdit) {
        await updateConcepto(dataToEdit.idconcepto, values);
      } else {
        await createConcepto(values);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving concepto:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box mt={1}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, errors, touched, isSubmitting }) => (
          <Form>
            <Stack spacing={2}>
              <TextField
                fullWidth
                name="nombre_concepto"
                label="Nombre del Concepto"
                value={values.nombre_concepto}
                onChange={handleChange}
                error={touched.nombre_concepto && Boolean(errors.nombre_concepto)}
                helperText={touched.nombre_concepto && errors.nombre_concepto}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={handleCloseModal} color="error">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : dataToEdit ? "Actualizar" : "Guardar"}
                </Button>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ConceptoForm;
