"use client";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Drawer } from "./CustomDrawer";
import { DrawerHeader } from "./DrawerHeader";
import DrawerListItem from "../menu/DrawerListItem";
import { getMenuForRole } from "../menu/menuConfig";
import { useAuth } from "@/app/provider";
import Logo from "@/app/ui-components/logo/LogoMain";
import SidebarFooter from "./SidebarFooter";

export default function MiniDrawer({ children }) {
  const [open, setOpen] = useState(true);
  const [openedMenuItem, setOpenedMenuItem] = useState("");
  const theme = useTheme();
  const { userType, user } = useAuth();
  const isDark = theme.palette.mode === "dark";

  const pathname = usePathname();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const tipo = userType ?? user?.tipo_usuario;
  const rawIdTipo = typeof tipo === "object" ? tipo?.id_tipo : tipo;
  const idTipo = rawIdTipo != null && rawIdTipo !== "" ? Number(rawIdTipo) : null;
  const currentMenuItems = idTipo != null ? getMenuForRole(idTipo) : [];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        background: (t) =>
          t.app?.surface?.mainBackground || t.palette.background.default,
      }}
    >
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ border: 'none' }}>
          <Stack 
            direction={"row"} 
            justifyContent={open ? "space-between" : "center"} 
            width={"100%"} 
            alignItems={"center"} 
            sx={{ px: open ? 2 : 0 }}
          >
            {open && (
              <Box sx={{ height: 26, width: 'auto', '& svg': { height: '100%', width: 'auto' } }}>
                <Logo />
              </Box>
            )}
            <IconButton
                onClick={handleDrawerToggle}
                size="small"
                sx={{
                  bgcolor: (t) => t.palette.action.hover,
                  border: "1px solid",
                  borderColor: "divider",
                  p: 0.75,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "action.selected" },
                }}
            >
              {open ? <ChevronLeftIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
            </IconButton>
          </Stack>
        </DrawerHeader>
        
        <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
            <List sx={{ px: open ? 1 : 0, pt: 2 }}>
            {currentMenuItems.map((item) => (
                <DrawerListItem
                key={item.path}
                item={item}
                open={open}
                pathname={pathname}
                onClick={() => handleNavigation(item.path)}
                isSubmenuOpen={openedMenuItem === item.path}
                onSetSubmenuOpen={(isOpen) => setOpenedMenuItem(isOpen ? item.path : "")}
                />
            ))}
            </List>
        </Box>

        <SidebarFooter open={open} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 2.5, md: 3 },
          minHeight: "100vh",
          minWidth: 0,
          width: "100%",
          border: "none",
          borderRadius: 0,
          boxShadow: "none",
          outline: "none",
          bgcolor: "transparent",
          background: "none",
          color: "text.primary",
          overflowX: "hidden",
          transition: (t) =>
            t.transitions.create(["width", "margin"], {
              easing: t.transitions.easing.easeInOut,
              duration: t.transitions.duration.enteringScreen,
            }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
