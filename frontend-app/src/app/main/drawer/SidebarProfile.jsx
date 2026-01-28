"use client";

import { useRef, useState } from "react";
import {
  Box,
  ButtonBase,
  Stack,
  Typography,
  useTheme,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  PersonOutline,
  LogoutOutlined,
} from "@mui/icons-material";
import Avatar from "@/app/ui-components/@extended/Avatar";
import { useAuth } from "@/app/provider";

const SidebarProfile = ({ open }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleToggle = () => {
    setProfileOpen((prev) => !prev);
  };

  if (!user) return null;

  return (
    <Box sx={{ px: 1, pb: 1 }}>
      <ButtonBase
        onClick={handleToggle}
        sx={{
          width: "100%",
          p: 1,
          borderRadius: 2,
          transition: "background-color 0.2s",
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          },
          ...(profileOpen && {
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          }),
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ width: "100%", overflow: "hidden" }}
        >
          <Avatar
            alt="profile user"
            src={"/images/users/avatar-1.png"}
            size="sm"
            sx={{ width: 40, height: 40, flexShrink: 0 }}
          />
          {open && (
            <>
              <Box sx={{ flexGrow: 1, textAlign: "left", overflow: "hidden" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'text.primary',
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.personal.nombres} {user?.personal.apellidos}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ whiteSpace: "nowrap", fontSize: '0.75rem' }}
                    >
                        {user?.tipo_usuario.descripcion}
                    </Typography>
                    <Box 
                        sx={{ 
                            px: 0.6, 
                            py: 0.2, 
                            lineHeight: 1,
                            borderRadius: 1, 
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), 
                            color: 'primary.main',
                            fontSize: '9px',
                            fontWeight: 800,
                            letterSpacing: 0.5,
                            border: '1px solid',
                            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2)
                        }}
                    >
                        E2i
                    </Box>
                </Stack>
              </Box>
              {profileOpen ? (
                <KeyboardArrowUp fontSize="small" color="action" />
              ) : (
                <KeyboardArrowDown fontSize="small" color="action" />
              )}
            </>
          )}
        </Stack>
      </ButtonBase>

      {open && (
        <Collapse in={profileOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ mt: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonOutline fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Perfil"
                primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
              />
            </ListItemButton>
            <ListItemButton
              onClick={logout}
              sx={{
                borderRadius: 1.5,
                "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.05) },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutOutlined fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Cerrar sesión"
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: 500,
                  color: "error",
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      )}
    </Box>
  );
};

export default SidebarProfile;
