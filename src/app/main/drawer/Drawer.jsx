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
import HeaderContent from "./HeaderContent";
import { AppBar } from "./CustomAppBar";
import { Drawer } from "./CustomDrawer";
import { DrawerHeader } from "./DrawerHeader";
// import { menuItems } from "../menu/MenuItems";
import DrawerListItem from "../menu/DrawerListItem";
import menuItemsByRole from "../menu/menuConfig";
import { useState } from "react";
import { useAuth } from "@/app/provider";

export default function MiniDrawer({ children }) {
  const [open, setOpen] = useState(true);
  const { userType, user } = useAuth();
  console.log("🚀 ~ MiniDrawer ~ userType:", userType);
  console.log("🚀 ~ MiniDrawer ~ user:", user?.tipo_usuario?.id_tipo);

  const pathname = usePathname();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const currentMenuItems = userType
    ? menuItemsByRole[userType || user?.tipo_usuario?.id_tipo]
    : [];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Box display={"flex"} justifyContent="space-between" width={"100%"}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              display={"flex"}
              direction="row"
              justifyContent="space-between"
              width={"100%"}
              alignItems={"center"}
            >
              <Typography variant="h6" noWrap component="div">
                Mi Aplicación
              </Typography>
              <Box display={"flex"} direction="row" justifyContent="end">
                <HeaderContent />
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {currentMenuItems.map((item) => (
            <DrawerListItem
              key={item.path}
              item={item}
              open={open}
              pathname={pathname}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, height: "100vh", overflow: "auto" }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
