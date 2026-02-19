
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
import { createCajaMes, updateCajaMes, getLastMesBalance } from "@/app/services/cajaMesServices";

const validationSchema = Yup.object({
  codcaja_a: Yup.string().required("Año es obligatorio"),
  codcaja_m: Yup.string().required("Código Mes es obligatorio"),
  monto_inicial_m: Yup.number(),
  estado_c_m: Yup.string(),
});

const AutoFetchBalance = ({ isEdit }) => {
    const { values, setFieldValue, setFieldError } = useFormikContext();

    useEffect(() => {
        // Construct code when Year or Month changes
        // Assuming we rely on separate fields for selection but submit 'codcaja_m'
        // Wait, 'codcaja_m' is "YYYYMM" ? No, User example "ENE2020".
        // I need internal state for Year and Month selection, then update `codcaja_m`.
        // But `initialValues` has `codcaja_m`.
        // Let's parse `codcaja_m` to init Year/Month if editing.
    }, []);

    // Effect to fetch balance
    useEffect(() => {
        if (!isEdit && values.codcaja_m) {
             getLastMesBalance(values.codcaja_m).then(res => {
                if (res && res.saldo !== undefined) {
                    setFieldValue("monto_inicial_m", res.saldo);
                }
            });
        }
    }, [values.codcaja_m, isEdit, setFieldValue]);

    return null;
};

// Helper: Month list
const MONTHS = [
    { code: "ENE", label: "Enero" },
    { code: "FEB", label: "Febrero" },
    { code: "MAR", label: "Marzo" },
    { code: "ABR", label: "Abril" },
    { code: "MAY", label: "Mayo" },
    { code: "JUN", label: "Junio" },
    { code: "JUL", label: "Julio" },
    { code: "AGO", label: "Agosto" },
    { code: "SET", label: "Septiembre" }, // User used SET
    { code: "OCT", label: "Octubre" },
    { code: "NOV", label: "Noviembre" },
    { code: "DIC", label: "Diciembre" },
];

const CajaMesForm = ({ handleCloseModal, dataToEdit, refreshData, defaultAnio }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString());

  // Helper to extract parts
  const parseCode = (code) => {
      // ENE2020
      const month = code ? code.substring(0, 3) : "ENE";
      const year = code ? code.substring(3) : currentYear.toString();
      return { month, year };
  };

  const { month: initMonth, year: initYear } = dataToEdit ? parseCode(dataToEdit.codcaja_m) : { month: "ENE", year: defaultAnio || currentYear.toString() };

  const initialValues = {
    selectedMonth: initMonth,
    selectedYear: initYear,
    codcaja_m: dataToEdit?.codcaja_m || `${initMonth}${initYear}`,
    codcaja_a: dataToEdit?.codcaja_a || "S" + initYear,
    monto_inicial_m: dataToEdit?.monto_inicial_m || 0,
    estado_c_m: dataToEdit?.estado_c_m || "ABIERTO",
  };

  const handleCustomSubmit = async (values, actions) => {
       // Validations if needed
       // Call standard submit
       // Ensure codcaja_a matches selectedYear
       const payload = {
           ...values,
           codcaja_a: "S" + values.selectedYear,
           codcaja_m: `${values.selectedMonth}${values.selectedYear}`
       };
       // Remove auxiliary
       delete payload.selectedMonth;
       delete payload.selectedYear;

       try {
        if (dataToEdit) {
           await updateCajaMes(dataToEdit.codcaja_m, payload);
        } else {
           await createCajaMes(payload);
        }
        refreshData?.();
        handleCloseModal();
       } catch (error) {
           console.error("Error saving:", error);
           actions.setStatus({ error: error.message || "Error al guardar la caja mensual." });
       } finally {
        actions.setSubmitting(false);
       }
  };

  // Internal component to handle selection changes updates
  const FormLogic = () => {
      const { values, setFieldValue } = useFormikContext();
      useEffect(() => {
          const newCode = `${values.selectedMonth}${values.selectedYear}`;
          if (newCode !== values.codcaja_m) {
              setFieldValue("codcaja_m", newCode);
              setFieldValue("codcaja_a", "S" + values.selectedYear);
          }
      }, [values.selectedMonth, values.selectedYear, setFieldValue, values.codcaja_m]);
      return null;
  };

  return (
    <Box mt={1}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleCustomSubmit}
        enableReinitialize
      >
        {({ values, handleChange, errors, touched, isSubmitting, status }) => (
          <Form>
            <AutoFetchBalance isEdit={!!dataToEdit} />
            <FormLogic />
            <Stack spacing={2}>
              {status?.error && <Alert severity="error">{status.error}</Alert>}
              <Stack direction="row" spacing={2}>
                 <TextField
                    select
                    fullWidth
                    name="selectedYear"
                    label="Año"
                    disabled={!!dataToEdit}
                    value={values.selectedYear}
                    onChange={handleChange}
                 >
                     {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                 </TextField>
                 <TextField
                    select
                    fullWidth
                    name="selectedMonth"
                    label="Mes"
                    disabled={!!dataToEdit}
                    value={values.selectedMonth}
                    onChange={handleChange}
                 >
                     {MONTHS.map(m => <MenuItem key={m.code} value={m.code}>{m.label}</MenuItem>)}
                 </TextField>
              </Stack>
              
              <TextField
                fullWidth
                name="codcaja_m"
                label="Código Generado"
                disabled
                value={values.codcaja_m}
                // Display only
              />

              <TextField
                fullWidth
                name="monto_inicial_m"
                label="Monto Inicial"
                type="number"
                value={values.monto_inicial_m}
                onChange={handleChange}
              />
              <TextField
                select
                fullWidth
                name="estado_c_m"
                label="Estado"
                value={values.estado_c_m}
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

export default CajaMesForm;
