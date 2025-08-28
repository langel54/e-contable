import { getEstadoClientes } from "@/app/services/estadoClienteServices";
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { statusValidationSchema } from "./formValidations";
import { updateClienteProv } from "@/app/services/clienteProvService";

const EstatusEditForm = ({ handleCloseModal, data }) => {
  const [estadoCliente, setEstadoCliente] = useState([]);
  const initialValues = data;
  const validationSchema = statusValidationSchema;
  const fetchEstadoClientes = async () => {
    try {
      const data = await getEstadoClientes();
      setEstadoCliente(data.estadoClientes);
    } catch (error) {
      console.error("Error fetching estadoClientes:", error);
    }
  };

  const handleSubmit = async (values, setSubmitting, setFieldError) => {
    try {
      const response = await updateClienteProv(values.idclienteprov, values);

      if (!response) {
        const errorData = await response;
        setFieldError(
          "general",
          errorData.message || "Error al procesar cliente/proveedor"
        );
      } else {
        handleCloseModal();
      }
    } catch (error) {
      setFieldError(
        "general",
        `Error al "actualizar"  usuario - Servidor:` + error
      );
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    fetchEstadoClientes();
  }, []);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      //   onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setSubmitting,
        setFieldError,
        isSubmitting,
        validateForm,
      }) => (
        <Form>
          <FormControl
            component="fieldset"
            margin="normal"
            error={touched.estado && Boolean(errors.estado)}
            fullWidth
          >
            <FormLabel component="legend">Estado</FormLabel>
            <RadioGroup
              name="estado"
              value={values.estado}
              onChange={handleChange}
            >
              {estadoCliente.map((estadoCli) => (
                <FormControlLabel
                  key={estadoCli.idestadocliente}
                  value={estadoCli.idestadocliente}
                  control={<Radio />}
                  label={estadoCli.descripcion}
                />
              ))}
            </RadioGroup>
            <FormHelperText>{touched.estado && errors.estado}</FormHelperText>
          </FormControl>
          <Divider></Divider>
          <Stack direction={"row"} justifyContent={"space-between"} pt={3}>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button
              // type="submit"
              variant="contained"
              disabled={isSubmitting}
              onClick={async () => {
                const formErrors = await validateForm();
                if (Object.keys(formErrors).length === 0) {
                  setSubmitting(true);
                  handleSubmit(values, setFieldError, setSubmitting);
                } else {
                  setSubmitting(false);
                }
              }}
            >
              ACTUALIZAR ESTADO
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default EstatusEditForm;
