
import React, { useEffect } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Stack,
  Box,
  MenuItem,
  Alert
} from "@mui/material";
import { createCajaAnual, updateCajaAnual, getLastAnualBalance } from "@/app/services/cajaAnualServices";

const validationSchema = Yup.object({
  codcaja_a: Yup.string().required("El Año es obligatorio"),
  monto_inicial_a: Yup.number(),
  estado_c_a: Yup.string(),
});

const AutoFetchBalance = ({ isEdit }) => {
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
        if (!isEdit && values.codcaja_a) {
            getLastAnualBalance(values.codcaja_a).then(res => {
                if (res && res.saldo !== undefined) {
                    setFieldValue("monto_inicial_a", res.saldo);
                }
            });
        }
    }, [values.codcaja_a, isEdit, setFieldValue]);

    return null;
};

const CajaAnualForm = ({ handleCloseModal, dataToEdit, refreshData }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString()); // 5 years back, 5 forward

  const initialValues = {
    codcaja_a: dataToEdit?.codcaja_a || "S" + currentYear.toString(),
    monto_inicial_a: dataToEdit?.monto_inicial_a || 0,
    estado_c_a: dataToEdit?.estado_c_a || "ABIERTO",
  };

  const handleSubmit = async (values, actions) => {
    try {
      if (dataToEdit) {
        await updateCajaAnual(dataToEdit.codcaja_a, values);
      } else {
        await createCajaAnual(values);
      }
      refreshData?.();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving caja anual:", error);
      actions.setStatus({ error: error.message || "Error al guardar la caja anual." });
    } finally {
      actions.setSubmitting(false);
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
        {({ values, handleChange, errors, touched, isSubmitting, status }) => (
          <Form>
            <AutoFetchBalance isEdit={!!dataToEdit} />
            <Stack spacing={2}>
              {status?.error && <Alert severity="error">{status.error}</Alert>}
              <TextField
                select
                fullWidth
                name="codcaja_a"
                label="Año"
                disabled={!!dataToEdit}
                value={values.codcaja_a}
                onChange={handleChange}
                error={touched.codcaja_a && Boolean(errors.codcaja_a)}
                helperText={touched.codcaja_a && errors.codcaja_a}
              >
                  {years.map((year) => (
                      <MenuItem key={year} value={"S" + year}>
                          {year}
                      </MenuItem>
                  ))}
              </TextField>
              
              <TextField
                fullWidth
                name="monto_inicial_a"
                label="Monto Inicial"
                type="number"
                value={values.monto_inicial_a}
                onChange={handleChange}
                disabled 
              />
              <TextField
                select
                fullWidth
                name="estado_c_a"
                label="Estado"
                value={values.estado_c_a}
                onChange={handleChange}
              >
                  <MenuItem value="ABIERTO">Abierto</MenuItem>
                  <MenuItem value="CERRADO">Cerrado</MenuItem>
              </TextField>

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

export default CajaAnualForm;
