import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { styled, useTheme } from "@mui/material";

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  const theme = useTheme();

  const show = () => {
    Swal.fire({
      title: title || "¿Estás seguro?",
      text: message || "Esta acción no se puede deshacer.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: theme.palette.success.main,
      cancelButtonColor: theme.palette.error.main,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      backdrop: true, // Se asegura de que el fondo se muestre
      allowOutsideClick: false, // Impide que el modal se cierre haciendo clic fuera
      customClass: {
        container: "swal2-container", // Aplica la clase personalizada
        popup: "swal2-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else if (onCancel) {
        onCancel();
      }
    });
  };

  return { show };
};

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default ConfirmDialog;
