import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Stack } from "@mui/material";
import { createConfiguracion, updateConfiguracion } from "@/app/services/configuracionServices";
import Swal from "sweetalert2";

const ConfiguracionForm = ({ initialData, handleCloseModal }) => {
  const initialValues = {
    e_razonsocial: initialData?.e_razonsocial || "",
    e_ncomercial: initialData?.e_ncomercial || "",
    e_ruc: initialData?.e_ruc || "",
    igv: initialData?.igv || 18,
    tim: initialData?.tim || 0,
  };

  const validationSchema = Yup.object({
    e_razonsocial: Yup.string().required("La razón social es obligatoria"),
    e_ruc: Yup.string().required("El RUC es obligatorio"),
    igv: Yup.number().min(0, "Debe ser positivo").required("Requerido"),
    tim: Yup.number().min(0, "Debe ser positivo").required("Requerido"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Asegurarse de que igv y tim sean números
      const data = {
          ...values,
          igv: parseFloat(values.igv),
          tim: parseFloat(values.tim)
      };

      if (initialData) {
        await updateConfiguracion(initialData.idconfig, data);
        Swal.fire("Éxito", "Configuración actualizada correctamente", "success");
      } else {
        await createConfiguracion(data);
        Swal.fire("Éxito", "Configuración creada correctamente", "success");
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
              name="e_razonsocial"
              label="Razón Social"
              fullWidth
              error={touched.e_razonsocial && Boolean(errors.e_razonsocial)}
              helperText={touched.e_razonsocial && errors.e_razonsocial}
              margin="normal"
            />
            <Field
              as={TextField}
              name="e_ncomercial"
              label="Nombre Comercial"
              fullWidth
              margin="normal"
            />
            <Field
              as={TextField}
              name="e_ruc"
              label="RUC"
              fullWidth
              error={touched.e_ruc && Boolean(errors.e_ruc)}
              helperText={touched.e_ruc && errors.e_ruc}
              margin="normal"
            />
            <Stack direction="row" spacing={2}>
                 <Field
                  as={TextField}
                  name="igv"
                  label="IGV (%)"
                  type="number"
                  fullWidth
                  error={touched.igv && Boolean(errors.igv)}
                  helperText={touched.igv && errors.igv}
                  margin="normal"
                />
                <Field
                  as={TextField}
                  name="tim"
                  label="TIM (%)"
                  type="number"
                  fullWidth
                  error={touched.tim && Boolean(errors.tim)}
                  helperText={touched.tim && errors.tim}
                  margin="normal"
                />
            </Stack>
           
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

export default ConfiguracionForm;
