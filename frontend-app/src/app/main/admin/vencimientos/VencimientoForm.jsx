
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "../../../components/date-picker/date-picker.css";
import { createVencimiento, updateVencimiento } from "@/app/services/vencimientosService";

const validationSchema = Yup.object({
  anio_v: Yup.string().required("Año es obligatorio"),
  mes_v: Yup.string().required("Mes es obligatorio"),
});

const VencimientoForm = ({ handleCloseModal, dataToEdit }) => {
  const parseDate = (dateStr) => (dateStr ? new Date(dateStr) : null);

  const initialValues = {
    anio_v: dataToEdit?.anio_v || new Date().getFullYear().toString(),
    mes_v: dataToEdit?.mes_v || (new Date().getMonth() + 1).toString().padStart(2, "0"),
    d0: parseDate(dataToEdit?.d0),
    d1: parseDate(dataToEdit?.d1),
    d2: parseDate(dataToEdit?.d2),
    d3: parseDate(dataToEdit?.d3),
    d4: parseDate(dataToEdit?.d4),
    d5: parseDate(dataToEdit?.d5),
    d6: parseDate(dataToEdit?.d6),
    d7: parseDate(dataToEdit?.d7),
    d8: parseDate(dataToEdit?.d8),
    d9: parseDate(dataToEdit?.d9),
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (dataToEdit) {
        await updateVencimiento(dataToEdit.idvencimientos, values);
      } else {
        await createVencimiento(values);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving vencimiento:", error);
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
        {({ values, handleChange, setFieldValue, errors, touched, isSubmitting }) => (
          <Form>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Año"
                  name="anio_v"
                  size="small"
                  value={values.anio_v}
                  onChange={handleChange}
                  error={touched.anio_v && Boolean(errors.anio_v)}
                  helperText={touched.anio_v && errors.anio_v}
                />
                <TextField
                  label="Mes (01-12)"
                  name="mes_v"
                  size="small"
                  value={values.mes_v}
                  onChange={handleChange}
                  error={touched.mes_v && Boolean(errors.mes_v)}
                  helperText={touched.mes_v && errors.mes_v}
                />
              </Stack>
              <Typography variant="subtitle2">Fechas por dígito (RUC)</Typography>
              <Grid container spacing={2}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <Grid item xs={6} sm={4} md={2.4} key={digit}>
                    <DatePicker
                      selected={values[`d${digit}`]}
                      onChange={(date) => setFieldValue(`d${digit}`, date)}
                      dateFormat="dd/MM/yyyy"
                      customInput={
                        <TextField
                          label={`Dígito ${digit}`}
                          fullWidth
                          size="small"
                        />
                      }
                    />
                  </Grid>
                ))}
              </Grid>

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
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

export default VencimientoForm;
