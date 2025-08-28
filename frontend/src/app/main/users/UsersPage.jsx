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
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Typography id="edit-user-modal" variant="subtitle1" mb={3}>
          Editar Usuario
        </Typography>

        {/* Campos de Usuario */}
        <TextField
          fullWidth
          label="Usuario"
          value={editedUser?.usuario || ""}
          onChange={(e) =>
            setEditedUser({ ...editedUser, usuario: e.target.value })
          }
          margin="normal"
        />
        <Divider />

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
          sx={{ mt: 1 }}
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
    
    console.log("🚀 ~ Efect111:")
    fetchTiposUsuario();
  }, []);
  useEffect(() => {
     console.log("🚀 ~ Efect222:")
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
      { field: "id_usuario", headerName: "ID" },
      { field: "usuario", headerName: "Usuario", flex: 1 },
      {
        field: "nombres",
        headerName: "Nombre Personal",
        flex: 2,
        renderCell: (params) => {
          return `${params.row.personal.nombres} ${params.row.personal.apellidos}`;
        },
      },
      {
        field: "tipo_usuario",
        headerName: "Tipo de Usuario",
        flex: 1,
        renderCell: (params) => {
          const tipo = userTypes.find((t) => t.id_tipo === params.row.id_tipo);
          return tipo ? tipo.descripcion : "Desconocido";
        },
      },
      {
        field: "actions",
        headerName: "Acciones",
        flex: 1,
        align: "right",
        renderCell: (params) => {
          return (
            <Stack direction={"row"}>
              <IconButton
                aria-label="delete"
                size="medium"
                color="primary"
                onClick={() => {
                  // setSelectedUser(params.row);
                  handleOpenModal(params.row);

                  // updateUser(params.row.id_usuario, { usuario: "NuevoNombre" }); // Ejemplo
                }}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                aria-label="delete"
                size="medium"
                color="primary"
                onClick={() => {
                  setSelectedUser(params.row.id_usuario);
                  // setModalOpen(true);
                }}
              >
                <Delete fontSize="inherit" />
              </IconButton>
            </Stack>
          );
        },
      },
    ],
    [userTypes]
  );

  return (
    <>
      <Box>
        <Box sx={{ pb: 2 }}>
          <Typography variant="h4" fontWeight={"100"}>
            Usuarios
          </Typography>
        </Box>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchTerm("")}
                    edge="end"
                    size="small"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            aria-label="Agregar"
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => {
              setAddModalOpen(true);
            }}
          >
            <AddCircleOutlineSharp fontSize="inherit" /> Agregar Usuario
          </Button>
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
      </Box>
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
