"use client";

import { useRef, useState } from "react";
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

const ENTER_DELAY = 90;
const LEAVE_DELAY = 140;

const DrawerListItem = ({ item, open }) => {
  const pathname = usePathname();

  // --- Drawer ABIERTO (Collapse por clic)
  const [submenuOpen, setSubmenuOpen] = useState(false);

  // --- Drawer CERRADO (Popper por hover)
  const anchorRef = useRef(null);
  const [hoverOpen, setHoverOpen] = useState(false);
  const enterTimer = useRef();
  const leaveTimer = useRef();

  const isActive = pathname === item.path;

  // Collapse toggle
  const handleToggleSubmenu = () => {
    if (item.children && open) setSubmenuOpen((v) => !v);
  };

  // Hover handlers (drawer cerrado)
  const openHover = () => {
    clearTimeout(leaveTimer.current);
    clearTimeout(enterTimer.current);
    enterTimer.current = setTimeout(() => setHoverOpen(true), ENTER_DELAY);
  };

  const scheduleCloseHover = () => {
    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHoverOpen(false), LEAVE_DELAY);
  };

  const cancelCloseHover = () => {
    clearTimeout(leaveTimer.current);
  };

  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          ref={anchorRef}
          component={item.children ? "button" : Link}
          href={item.children ? undefined : item.path}
          onClick={item.children && open ? handleToggleSubmenu : undefined}
          onMouseEnter={!open && item.children ? openHover : undefined}
          onMouseLeave={!open && item.children ? scheduleCloseHover : undefined}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "initial",
            px: 2.5,
            backgroundColor: isActive ? "rgba(0,0,0,0.04)" : "transparent",
            width: "100%",
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: isActive ? "primary.main" : "inherit",
            }}
          >
            {item.icon}
          </ListItemIcon>

          {open && (
            <ListItemText
              primary={item.text}
              sx={{
                opacity: open ? 1 : 0,
                color: isActive ? "primary.main" : "inherit",
                whiteSpace: "nowrap",
              }}
            />
          )}

          {item.children && (
            <Box sx={{ ml: "auto" }}>
              {open ? (
                submenuOpen ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              ) : (
                <ChevronRightIcon fontSize="small" />
              )}
            </Box>
          )}
        </ListItemButton>
      </ListItem>

      {/* Drawer ABIERTO → Collapse */}
      {item.children && open && (
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
                    pl: 6,
                    backgroundColor: isSubActive
                      ? "rgba(0,0,0,0.08)"
                      : "transparent",
                  }}
                >
                  {open && (
                    <ListItemText
                      primary={subItem.text}
                      sx={{ color: isSubActive ? "primary.main" : "inherit" }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}

      {/* Drawer CERRADO → Popper por hover */}
      {!open && item.children && (
        <Popper
          open={hoverOpen}
          anchorEl={anchorRef.current}
          placement="right"
          modifiers={[
            { name: "offset", options: { offset: [0, 6] } }, // un pequeño espacio
            { name: "preventOverflow", options: { boundary: "viewport" } },
          ]}
          keepMounted
          // Evita problemas de foco con el Drawer mini
          style={{ zIndex: 1300 }}
        >
          <ClickAwayListener onClickAway={() => setHoverOpen(false)}>
            <Paper
              elevation={3}
              onMouseEnter={cancelCloseHover}
              onMouseLeave={scheduleCloseHover}
              sx={{ minWidth: 200, py: 0 }}
            >
              <MenuList autoFocusItem={false} disablePadding>
                {item.children.map((subItem) => {
                  const isSubActive = pathname === subItem.path;
                  return (
                    <MenuItem
                      key={subItem.path}
                      component={Link}
                      href={subItem.path}
                      onClick={() => setHoverOpen(false)}
                      sx={{
                        backgroundColor: isSubActive
                          ? "rgba(0,0,0,0.08)"
                          : "transparent",
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      {subItem.text}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </>
  );
};

export default DrawerListItem;
