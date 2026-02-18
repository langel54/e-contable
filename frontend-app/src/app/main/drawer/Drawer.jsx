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
import { useState } from "react";
import { Stack } from "@mui/material";
import { Drawer } from "./CustomDrawer";
import { DrawerHeader } from "./DrawerHeader";
import DrawerListItem from "../menu/DrawerListItem";
import menuItemsByRole from "../menu/menuConfig";
import { useAuth } from "@/app/provider";
import SidebarFooter from "./SidebarFooter";

export default function MiniDrawer({ children }) {
  const [open, setOpen] = useState(true);
  const { userType, user } = useAuth();

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
      {/* Ya no usamos AppBar superior según el nuevo diseño */}
      
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
              <Box component="img" src="/images/logo.png" sx={{ height: 32, maxWidth: '140px' }} />
            )}
            <IconButton 
                onClick={handleDrawerToggle}
                sx={{ 
                    bgcolor: 'action.hover',
                    p: 0.5,
                    borderRadius: '50%'
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
          p: { xs: 2, md: 4 },
          minHeight: "100vh",
          minWidth: 0, // CRITICAL: allows flex item to shrink below content size
          width: '100%',
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          bgcolor: 'background.default',
          color: "text.primary",
          overflowX: 'hidden'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
