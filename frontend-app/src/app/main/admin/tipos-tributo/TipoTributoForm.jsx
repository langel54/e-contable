
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { createTipoTributo, updateTipoTributo } from "@/app/services/tipoTributoServices";

const validationSchema = Yup.object({
  idtipo_trib: Yup.string().required("El código es obligatorio"),
  descripcion_t: Yup.string().required("La descripción es obligatoria"),
});

const TipoTributoForm = ({ handleCloseModal, dataToEdit }) => {
  const initialValues = {
    idtipo_trib: dataToEdit?.idtipo_trib || "",
    descripcion_t: dataToEdit?.descripcion_t || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (dataToEdit) {
        await updateTipoTributo(dataToEdit.idtipo_trib, values);
      } else {
        await createTipoTributo(values);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving tipo tributo:", error);
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
                name="idtipo_trib"
                label="Código (ID)"
                disabled={!!dataToEdit}
                value={values.idtipo_trib}
                onChange={handleChange}
                error={touched.idtipo_trib && Boolean(errors.idtipo_trib)}
                helperText={touched.idtipo_trib && errors.idtipo_trib}
              />
              <TextField
                fullWidth
                name="descripcion_t"
                label="Descripción"
                value={values.descripcion_t}
                onChange={handleChange}
                error={touched.descripcion_t && Boolean(errors.descripcion_t)}
                helperText={touched.descripcion_t && errors.descripcion_t}
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

export default TipoTributoForm;
