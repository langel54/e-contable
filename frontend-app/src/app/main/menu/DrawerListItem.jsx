"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { alpha, useTheme } from "@mui/material/styles";

const DrawerListItem = ({ item, open }) => {
  const theme = useTheme();
  const pathname = usePathname();

  // --- Drawer ABIERTO (Collapse por clic)
  const [submenuOpen, setSubmenuOpen] = useState(false);

  // --- Drawer CERRADO (Popper por hover)
  const anchorRef = useRef(null);
  const [hoverOpen, setHoverOpen] = useState(false);
  const enterTimer = useRef();
  const leaveTimer = useRef();

  const isActive = pathname === item.path;
  const hasChildren = item.children && item.children.length > 0;
  
  // Check if any child is active to highlight parent
  const isChildActive = hasChildren && item.children.some(child => pathname === child.path);

  // Auto-expand if child is active and drawer is open
  useEffect(() => {
    if (open && isChildActive) {
      setSubmenuOpen(true);
    }
  }, [open, isChildActive]);

  // Collapse toggle
  const handleToggleSubmenu = () => {
    if (hasChildren && open) setSubmenuOpen((v) => !v);
  };

  // Hover handlers (drawer cerrado)
  const openHover = () => {
    clearTimeout(leaveTimer.current);
    clearTimeout(enterTimer.current); // Clear any pending open timer just in case
    setHoverOpen(true); // Open immediately on enter for snappier feel, or use small delay
  };

  const scheduleCloseHover = () => {
    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHoverOpen(false), 100);
  };

  const cancelCloseHover = () => {
    clearTimeout(leaveTimer.current);
  };

  const activeBackgroundColor = alpha(theme.palette.primary.main, 0.08);
  const hoverBackgroundColor = alpha(theme.palette.primary.main, 0.04);

  return (
    <>
      <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
        <ListItemButton
          ref={anchorRef}
          component={hasChildren ? "div" : Link}
          href={hasChildren ? undefined : item.path}
          onClick={hasChildren && open ? handleToggleSubmenu : undefined}
          onMouseEnter={!open && hasChildren ? openHover : undefined}
          onMouseLeave={!open && hasChildren ? scheduleCloseHover : undefined}
          sx={{
            minHeight: 48,
            mx: 1,
            borderRadius: 1.5,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            backgroundColor: isActive || (open && isChildActive) ? activeBackgroundColor : "transparent",
            color: isActive || (open && isChildActive) ? "primary.main" : "text.secondary",
            width: "auto", // Allow margin to work correctly
            transition: theme.transitions.create(['background-color', 'color'], {
              duration: theme.transitions.duration.shortest,
            }),
            "&:hover": {
              backgroundColor: isActive || (open && isChildActive) ? activeBackgroundColor : hoverBackgroundColor,
              color: isActive || (open && isChildActive) ? "primary.main" : "text.primary",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : "auto",
              justifyContent: "center",
              color: isActive || (open && isChildActive) ? "inherit" : "text.secondary",
              "& .MuiSku": { // Target icon if possible, or assume inherit works
                 fontSize: '1.5rem'
              }
            }}
          >
            {item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.text}
            sx={{
              opacity: open ? 1 : 0,
              display: open ? 'block' : 'none', // Hide completely when closed to avoid layout shifts if opacity animates
              m: 0,
              "& .MuiTypography-root": {
                fontWeight: isActive || (open && isChildActive) ? 600 : 400,
                fontSize: '0.875rem',
              }
            }}
          />

          {hasChildren && open && (
            <Box sx={{ ml: "auto", display: 'flex', alignItems: 'center', color: 'text.disabled' }}>
              {submenuOpen ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              )}
            </Box>
          )}
        </ListItemButton>
      </ListItem>

      {/* Drawer ABIERTO → Collapse */}
      {hasChildren && open && (
        <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((subItem) => {
              const isSubActive = pathname === subItem.path;
              return (
                <ListItemButton
                  key={subItem.path}
                  component={Link}
                  href={subItem.path}
                  sx={{
                    pl: 9, // Indent: 2.5(pad) + 2(icon) + 2(space) + extra
                    mx: 1,
                    borderRadius: 1.5,
                    mb: 0.5,
                    minHeight: 40,
                    width: 'auto',
                    backgroundColor: isSubActive
                      ? activeBackgroundColor
                      : "transparent",
                    color: isSubActive ? "primary.main" : "text.secondary",
                    "&:hover": {
                      backgroundColor: isSubActive ? activeBackgroundColor : hoverBackgroundColor,
                      color: isSubActive ? "primary.main" : "text.primary",
                    },
                  }}
                >
                  <ListItemText
                    primary={subItem.text}
                    sx={{ m: 0 }}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: isSubActive ? 500 : 400,
                      fontSize: '0.85rem'
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}

      {/* Drawer CERRADO → Popper por hover */}
      {!open && hasChildren && (
        <Popper
          open={hoverOpen}
          anchorEl={anchorRef.current}
          placement="right-start" 
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 12], // Vertical offset to align better with parent
              },
            },
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
                padding: 8,
              },
            },
          ]}
          sx={{ zIndex: 1300 }}
        >
          <Paper
            elevation={4}
            onMouseEnter={cancelCloseHover}
            onMouseLeave={scheduleCloseHover}
            sx={{
              mt: 0.5,
              ml: 1, // Add space between drawer and menu
              minWidth: 180,
              overflow: 'hidden',
              borderRadius: 2,
              backgroundImage: 'none',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: theme.shadows[8]
            }}
          >
            <MenuList disablePadding>
              {/* Optional: Show parent title in popup for context */}
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                />
              </Box>
            
              {item.children.map((subItem) => {
                const isSubActive = pathname === subItem.path;
                return (
                  <MenuItem
                    key={subItem.path}
                    component={Link}
                    href={subItem.path}
                    onClick={() => setHoverOpen(false)}
                    sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 1,
                      backgroundColor: isSubActive
                        ? activeBackgroundColor
                        : "transparent",
                      color: isSubActive ? "primary.main" : "text.primary",
                      "&:hover": {
                        backgroundColor: isSubActive ? activeBackgroundColor : hoverBackgroundColor,
                        color: isSubActive ? "primary.main" : "text.primary",
                      },
                      fontSize: '0.875rem'
                    }}
                  >
                    {subItem.text}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Paper>
        </Popper>
      )}
    </>
  );
};

export default DrawerListItem;
