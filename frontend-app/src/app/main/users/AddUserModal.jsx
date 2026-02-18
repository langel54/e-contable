import { createUser, getUsersTypes } from "@/app/services/userService";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Check, Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

// Estado inicial para el formulario
const initialFormData = {
  nombres: "",
  apellidos: "",
  direccion: "",
  telefono: "",
  usuario: "",
  password: "",
  id_tipo: "",
};

const AddUserModal = ({ modalOpen, handleCloseModal, onUserAdded }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [userTypes, setUserTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      const fetchUserTypes = async () => {
        try {
          setLoadingTypes(true);
          const types = await getUsersTypes();
          setUserTypes(types.tiposUsuario || []);
        } catch (err) {
          setError("Error al cargar los tipos de usuario");
        } finally {
          setLoadingTypes(false);
        }
      };
      fetchUserTypes();
    }
  }, [modalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefono" && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createUser(formData);
      setSuccess(true);
      onUserAdded(); // Actualiza la tabla
      handleClose(); // Limpia y cierra
    } catch (err) {
      setError(err.message || "Ocurrió un error al agregar el usuario.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    handleCloseModal();
    setFormData(initialFormData);
    setError("");
    setSuccess(false);
  };
  const theme = useTheme();

  return (
    <Modal open={modalOpen} aria-labelledby="add-user-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: theme.customShadows.z1,
            p: 4,
            borderRadius: 3,
            maxHeight: "90vh",
            overflowY: "auto",
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" color="text.primary" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
              Agregar Usuario
            </Typography>
  
            <Stack spacing={2}>
              {/* Credenciales */}
              <Divider textAlign="left" sx={{ '&::before, &::after': { borderColor: 'divider' }, '& .MuiDivider-wrapper': { color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
                Credenciales
              </Divider>
            <TextField
              label="Usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              fullWidth
              required
              autoComplete="off"
            />
            <TextField
              type={showPassword ? "text" : "password"}
              label="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Datos Personales */}
            <Divider textAlign="left" sx={{ '&::before, &::after': { borderColor: 'divider' }, '& .MuiDivider-wrapper': { color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
              Datos Personales
            </Divider>
            <TextField
              label="Nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 9 }}
            />

            {/* Tipo de Usuario */}
            <Divider textAlign="left" sx={{ '&::before, &::after': { borderColor: 'divider' }, '& .MuiDivider-wrapper': { color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
              Tipo de Usuario
            </Divider>
            {loadingTypes ? (
              <CircularProgress size={24} />
            ) : (
              <TextField
                select
                name="id_tipo"
                label="Tipo"
                value={formData.id_tipo}
                onChange={handleChange}
                required
                fullWidth
              >
                {userTypes.map((type) => (
                  <MenuItem key={type.id_tipo} value={type.id_tipo}>
                    {type.descripcion}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* Botones */}
            <Stack direction="row" justifyContent="space-between">
              <Button variant="outlined" onClick={handleClose} disabled={submitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <Check />}
              >
                {submitting ? "Guardando..." : "Agregar"}
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Notificaciones */}
        <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
          <Alert severity="success">Usuario agregado con éxito</Alert>
        </Snackbar>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default AddUserModal;
