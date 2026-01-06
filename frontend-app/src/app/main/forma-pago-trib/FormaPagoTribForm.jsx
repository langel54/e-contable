import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Stack } from "@mui/material";
import { createFormaPagoTrib, updateFormaPagoTrib } from "@/app/services/formaPagoTribServices";
import Swal from "sweetalert2";

const FormaPagoTribForm = ({ initialData, handleCloseModal }) => {
  const initialValues = {
    idforma_pago_trib: initialData?.idforma_pago_trib || "",
    descripcion: initialData?.descripcion || "",
  };

  const validationSchema = Yup.object({
    idforma_pago_trib: Yup.string()
      .required("El código ID es obligatorio")
      .max(20, "El ID no debe superar 20 caracteres"),
    descripcion: Yup.string().required("La descripción es obligatoria"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (initialData) {
        // En update, el ID va en la URL, pero también puede ir en el body si el backend lo ignora.
        // Pero el ID NO se puede cambiar.
        await updateFormaPagoTrib(initialData.idforma_pago_trib, values);
        Swal.fire("Éxito", "Actualizado correctamente", "success");
      } else {
        await createFormaPagoTrib(values);
        Swal.fire("Éxito", "Creado correctamente", "success");
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
             {/* ID Field - Solo editable en creación */}
             <Field
              as={TextField}
              name="idforma_pago_trib"
              label="Código ID"
              fullWidth
              disabled={!!initialData} // Deshabilitado si estamos editando
              error={touched.idforma_pago_trib && Boolean(errors.idforma_pago_trib)}
              helperText={touched.idforma_pago_trib && errors.idforma_pago_trib}
              margin="normal"
            />
            <Field
              as={TextField}
              name="descripcion"
              label="Descripción"
              fullWidth
              error={touched.descripcion && Boolean(errors.descripcion)}
              helperText={touched.descripcion && errors.descripcion}
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

export default FormaPagoTribForm;
