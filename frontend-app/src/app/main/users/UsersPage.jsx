import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  useTheme,
  IconButton,
  Stack,
  Modal,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "use-debounce";
import {
  // fetchUsers,
  getUsersTypes,
  // updateUser,
} from "../../services/userService";
import CustomTable from "@/app/components/CustonTable";
import EditIcon from "@mui/icons-material/Edit";
import {
  Add,
  AddCircleOutlineSharp,
  Clear,
  Delete,
  KeyboardArrowDown,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import AddUserModal from "./AddUserModal";
import { useUserStore } from "@/app/store/userStore";

const StyledModal = ({
  modalOpen,
  handleCloseModal,
  editedUser,
  setEditedUser,
  handleSaveChanges,
  userTypes = [], // Array de tipos de usuario disponibles
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChangePassword = (e) => {
    setChangePassword(e.target.checked);
    if (!e.target.checked) {
      setEditedUser({ ...editedUser, password: "" });
    }
  };

  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="edit-user-modal"
      aria-describedby="edit-user-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          backgroundImage: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))' : 'none',
          boxShadow: (theme) => theme.customShadows.z1,
          p: 4,
          borderRadius: 3,
          maxHeight: "90vh",
          overflow: "auto",
          border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        }}
      >
        <Typography id="edit-user-modal" variant="h5" color="text.primary" fontWeight={700} mb={3}>
          Editar Usuario
        </Typography>

        <Stack spacing={2}>
          {/* Campos de Usuario */}
          <TextField
            fullWidth
            label="Usuario"
            value={editedUser?.usuario || ""}
            onChange={(e) =>
              setEditedUser({ ...editedUser, usuario: e.target.value })
            }
          />
          <Divider sx={{ '&::before, &::after': { borderColor: 'divider' } }} />

        {/* Campos de Personal */}
        <TextField
          fullWidth
          label="Nombres"
          value={editedUser?.personal?.nombres || ""}
          onChange={(e) =>
            setEditedUser({
              ...editedUser,
              personal: { ...editedUser.personal, nombres: e.target.value },
            })
          }
          margin="normal"
        />

        <TextField
          fullWidth
          label="Apellidos"
          value={editedUser?.personal?.apellidos || ""}
          onChange={(e) =>
            setEditedUser({
              ...editedUser,
              personal: { ...editedUser.personal, apellidos: e.target.value },
            })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Direccion"
          value={editedUser?.personal?.direccion || ""}
          onChange={(e) =>
            setEditedUser({
              ...editedUser,
              personal: { ...editedUser.personal, direccion: e.target.value },
            })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Telefono"
          value={editedUser?.personal?.telefono || ""}
          onChange={(e) =>
            setEditedUser({
              ...editedUser,
              personal: { ...editedUser.personal, telefono: e.target.value },
            })
          }
          margin="normal"
          inputProps={{
            maxLength: 9, // Limita el máximo de caracteres a 9
            pattern: "[0-9]*", // Solo permite números si es necesario
          }}
        />

        {/* Selector de Tipo de Usuario */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de Usuario</InputLabel>
          <Select
            value={editedUser?.id_tipo || ""}
            onChange={(e) =>
              setEditedUser({ ...editedUser, id_tipo: e.target.value })
            }
            label="Tipo de Usuario"
          >
            {userTypes.map((tipo) => (
              <MenuItem key={tipo.id_tipo} value={tipo.id_tipo}>
                {tipo.descripcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider />
        {/* Opción para cambiar contraseña */}
        <FormControlLabel
          control={
            <Checkbox
              checked={changePassword}
              onChange={handleChangePassword}
            />
          }
          label="Cambiar contraseña"
          // sx={{ mt: 1 }}
        />

        {changePassword && (
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Nueva Contraseña"
            value={editedUser?.password || ""}
            onChange={(e) =>
              setEditedUser({ ...editedUser, password: e.target.value })
            }
            margin="normal"
            inputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handlePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            color="secondary"
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default function UsersPage() {
  const theme = useTheme();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  /* Zustand store usage */
  const users = useUserStore((state) => state.users);
  const loading = useUserStore((state) => state.loading);
  const total = useUserStore((state) => state.total);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const updateUserInStore = useUserStore((state) => state.updateUserInStore);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [userTypes, setUserTypes] = useState([]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchTiposUsuario = async () => {
    const response = await getUsersTypes();
    setUserTypes(response.tiposUsuario);
  };

  useEffect(() => {
    fetchTiposUsuario();
  }, []);
  useEffect(() => {
    let shouldCancel = false;
    const loadUsers = async () => {
      if (debouncedSearchTerm.length === 0 || debouncedSearchTerm.length >= 2) {
        await fetchUsers(
          paginationModel.page + 1,
          paginationModel.pageSize,
          debouncedSearchTerm
        );
      }
    };
    loadUsers();
    return () => {
      shouldCancel = true;
    };
  }, [paginationModel.page, paginationModel.pageSize, debouncedSearchTerm]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length >= 2 || value.length === 0) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async () => {
    const result = await updateUserInStore(
      selectedUser.id_usuario,
      selectedUser
    );
    if (result.success) {
      handleCloseModal();
    } else {
      alert("Error al actualizar");
    }
  };

  const handleAddingUser = () => {
    setAddModalOpen(false);
    fetchUsers(paginationModel.page + 1, paginationModel.pageSize, "");
  };

  const columns = useMemo(
    () => [
      {
        field: "id_usuario",
        headerName: "#",
        width: 80,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "usuario",
        headerName: "Usuario",
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <span style={{ fontWeight: 500 }}>{params.value}</span>
        ),
      },
      {
        field: "nombres",
        headerName: "Nombre Personal",
        flex: 2,
        minWidth: 200,
        renderCell: (params) => {
          const nombre = `${params.row.personal.nombres} ${params.row.personal.apellidos}`;
          return <span>{nombre}</span>;
        },
      },
      {
        field: "tipo_usuario",
        headerName: "Tipo de Usuario",
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
          const tipo = userTypes.find((t) => t.id_tipo === params.row.id_tipo);
          const descripcion = tipo ? tipo.descripcion : "Desconocido";

          // 🎨 Usa colores propios de MUI
          const colorMap = {
            Practicante: "secondary",
            "Asistente Contable": "primary",
            Gerencia: "info",
            "Asistente Administrativo": "warning",
            Apoyo: "success",
            "Administrador del sistema": "error",
          };

          return (
            <Chip
              label={descripcion}
              color={colorMap[descripcion] || "default"}
              variant="filled"
              size="small"
              sx={{
                fontWeight: 500,
                borderRadius: "8px",
                textTransform: "capitalize",
              }}
            />
          );
        },
      },
      {
        field: "actions",
        headerName: "Acciones",
        flex: 0.8,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} justifyContent="center">
            <Tooltip title="Editar usuario">
              <IconButton
                size="small"
                color="primary"
                sx={{
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "scale(1.15)" },
                }}
                onClick={() => handleOpenModal(params.row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar usuario">
              <IconButton
                size="small"
                color="error"
                sx={{
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "scale(1.15)" },
                }}
                onClick={() => setSelectedUser(params.row.id_usuario)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [userTypes]
  );

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Usuarios
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {total} usuarios
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Buscar"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ 
                width: 300,
                '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                    borderRadius: 2
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setSearchTerm("")}
                      edge="end"
                      size="small"
                    >
                      <KeyboardArrowDown fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              aria-label="Agregar"
              size="large"
              color="primary"
              variant="contained"
              onClick={() => setAddModalOpen(true)}
              startIcon={<Add />}
              sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
            >
              Agregar Usuario
            </Button>
          </Stack>
        </Stack>
      </Box>
      <CustomTable
        columns={columns}
        data={users}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        rowCount={total}
        loading={loading}
        getRowId={(row) => row.id_usuario}
      />
      {modalOpen && (
        <StyledModal
          modalOpen={modalOpen}
          handleCloseModal={() => handleCloseModal()}
          editedUser={selectedUser}
          setEditedUser={setSelectedUser}
          handleSaveChanges={handleSaveChanges}
          userTypes={userTypes}
        />
      )}
      {addModalOpen && (
        <AddUserModal
          modalOpen={addModalOpen}
          handleCloseModal={() => setAddModalOpen(false)}
          onUserAdded={() => handleAddingUser()}
        />
      )}
    </>
  );
}
