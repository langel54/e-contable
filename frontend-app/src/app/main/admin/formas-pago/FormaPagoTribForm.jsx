
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { createFormaPagoTrib, updateFormaPagoTrib } from "@/app/services/formaPagoTribServices";

const validationSchema = Yup.object({
  idforma_pago_trib: Yup.string().required("El código es obligatorio"),
  descripcion: Yup.string().required("La descripción es obligatoria"),
});

const FormaPagoTribForm = ({ handleCloseModal, dataToEdit }) => {
  const initialValues = {
    idforma_pago_trib: dataToEdit?.idforma_pago_trib || "",
    descripcion: dataToEdit?.descripcion || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (dataToEdit) {
        await updateFormaPagoTrib(dataToEdit.idforma_pago_trib, values);
      } else {
        await createFormaPagoTrib(values);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving forma pago:", error);
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
                name="idforma_pago_trib"
                label="Código (ID)"
                disabled={!!dataToEdit}
                value={values.idforma_pago_trib}
                onChange={handleChange}
                error={touched.idforma_pago_trib && Boolean(errors.idforma_pago_trib)}
                helperText={touched.idforma_pago_trib && errors.idforma_pago_trib}
              />
              <TextField
                fullWidth
                name="descripcion"
                label="Descripción"
                value={values.descripcion}
                onChange={handleChange}
                error={touched.descripcion && Boolean(errors.descripcion)}
                helperText={touched.descripcion && errors.descripcion}
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

export default FormaPagoTribForm;
