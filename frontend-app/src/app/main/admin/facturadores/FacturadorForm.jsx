
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { createFacturador, updateFacturador } from "@/app/services/facturadorServices";

const validationSchema = Yup.object({
  n_facturador: Yup.string().required("El nombre es obligatorio"),
  f_obs: Yup.string(),
});

const FacturadorForm = ({ handleCloseModal, dataToEdit }) => {
  const initialValues = {
    n_facturador: dataToEdit?.n_facturador || "",
    f_obs: dataToEdit?.f_obs || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (dataToEdit) {
        await updateFacturador(dataToEdit.idfacturador, values);
      } else {
        await createFacturador(values);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving facturador:", error);
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
                name="n_facturador"
                label="Nombre del Facturador"
                value={values.n_facturador}
                onChange={handleChange}
                error={touched.n_facturador && Boolean(errors.n_facturador)}
                helperText={touched.n_facturador && errors.n_facturador}
              />
              <TextField
                fullWidth
                name="f_obs"
                label="Observaciones"
                multiline
                rows={3}
                value={values.f_obs}
                onChange={handleChange}
                error={touched.f_obs && Boolean(errors.f_obs)}
                helperText={touched.f_obs && errors.f_obs}
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

export default FacturadorForm;
