import { getValidateRuc } from "@/app/services/clienteProvService";
import * as Yup from "yup";

// Esquema de validación para el Paso 1
export const step1ValidationSchema = (formAction, idclienteprov) =>
  Yup.object({
    razonsocial: Yup.string()
      .max(85, "Máximo 85 caracteres")
      .required("Razón social es requerida"),

    ruc: Yup.string()
      .test("check-ruc", async function (value) {
        if (value) {
          try {
            const action = formAction;
            const response = await getValidateRuc(value, action, idclienteprov);
            if (response.exists) {
              // Generar mensaje dinámico
              const message = `El RUC/DNI ya está registrado. 
             ${response.details.idClienteProv}
            : ${response.details.razonSocial}, 
             Con estado: ${response.details.estadoDescripcion}`;
              return this.createError({ message }); // Crea un error con el mensaje personalizado
            }
          } catch (error) {
            console.error("Error en la validación del RUC:", error);
            return true; // Permite continuar en caso de error inesperado
          }
        }
        return true; // Si no hay problemas, la validación pasa
      })
      .test(
        "len",
        "El valor debe tener  8 u 11 dígitos",
        (value) => value && (value.length === 8 || value.length === 11)
      )
      .required("Este campo es requerido"),
    estado: Yup.string().required("El estado es requerido"),
    u_digito: Yup.string().required("El digito es requerido"),
    nregimen: Yup.string().required("El regimen es requerido"),
    nrubro: Yup.string().required("El rubro es requerido"),
    fecha_ingreso: Yup.string().required("La fecha es requerida"),
  });

// Esquema de validación para el Paso 2
export const step2ValidationSchema = Yup.object({
  c_usuario: Yup.string().required("Usuario es requerido"),
  c_passw: Yup.string().required("Contraseña es requerido"),
  dni: Yup.string()
    .matches(/^\d+$/, "El valor debe contener solo números")
    .test(
      "len",
      "El valor debe tener 8  dígitos o vacio",
      (value) => value?.length == 8 || !value
    ),
  ple_desde: Yup.string().required("Este campo es requerido"),
});
export const step3ValidationSchema = Yup.object({});

// Esquema de validación para el Paso 3
export const step4ValidationSchema = Yup.object({
  montoref: Yup.number()
    .positive("Debe ser un número positivo")
    .required("El monto de referencia es requerido"),
  honorario_anual: Yup.number()
    .positive("Debe ser un número positivo")
    .required("El monto de referencia es requerido"),
});

export const statusValidationSchema = Yup.object({
  estado: Yup.string().required("El estado es requerido"),
});
