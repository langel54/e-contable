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
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { getMenuPaperSx } from "@/app/themes/appTokens";

const DrawerListItem = ({ item, open, isSubmenuOpen, onSetSubmenuOpen }) => {
  const theme = useTheme();
  const pathname = usePathname();

  const submenuOpen = isSubmenuOpen;
  const setSubmenuOpen = onSetSubmenuOpen;

  const anchorRef = useRef(null);
  const [hoverOpen, setHoverOpen] = useState(false);
  const leaveTimer = useRef();

  const isActive = pathname === item.path;
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive =
    hasChildren && item.children.some((child) => pathname === child.path);
  const isParentHighlighted = isActive || (open && isChildActive);

  useEffect(() => {
    if (open && isChildActive && typeof setSubmenuOpen === "function") {
      setSubmenuOpen(true);
    }
  }, [open, isChildActive, setSubmenuOpen]);

  const handleToggleSubmenu = () => {
    if (hasChildren && open && typeof setSubmenuOpen === "function") {
      setSubmenuOpen(!submenuOpen);
    }
  };

  const openHover = () => {
    clearTimeout(leaveTimer.current);
    setHoverOpen(true);
  };

  const scheduleCloseHover = () => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHoverOpen(false), 100);
  };

  const cancelCloseHover = () => {
    clearTimeout(leaveTimer.current);
  };

  const itemLayoutSx = {
    mx: 1.25,
    px: 2,
    width: "auto",
    justifyContent: open ? "initial" : "center",
  };

  return (
    <>
      <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
        <ListItemButton
          ref={anchorRef}
          selected={isParentHighlighted}
          component={hasChildren ? "div" : Link}
          href={hasChildren ? undefined : item.path}
          onClick={hasChildren && open ? handleToggleSubmenu : undefined}
          onMouseEnter={!open && hasChildren ? openHover : undefined}
          onMouseLeave={!open && hasChildren ? scheduleCloseHover : undefined}
          sx={itemLayoutSx}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : "auto",
              justifyContent: "center",
              color: "inherit",
              "& .MuiSvgIcon-root": { fontSize: "1.25rem" },
            }}
          >
            {item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.text}
            sx={{
              opacity: open ? 1 : 0,
              display: open ? "block" : "none",
              m: 0,
            }}
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: isParentHighlighted ? 600 : 500,
              fontSize: "0.875rem",
            }}
          />

          {hasChildren && open && (
            <Box sx={{ ml: "auto", display: "flex", color: "text.disabled" }}>
              {submenuOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </Box>
          )}
        </ListItemButton>
      </ListItem>

      {hasChildren && open && (
        <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((subItem) => {
              const isSubActive = pathname === subItem.path;
              return (
                <ListItemButton
                  key={subItem.path}
                  selected={isSubActive}
                  component={Link}
                  href={subItem.path}
                  sx={{
                    pl: 9,
                    mx: 1,
                    mb: 0.5,
                    minHeight: 40,
                    width: "auto",
                  }}
                >
                  <ListItemText
                    primary={subItem.text}
                    sx={{ m: 0 }}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: isSubActive ? 600 : 400,
                      fontSize: "0.85rem",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}

      {!open && hasChildren && (
        <Popper
          open={hoverOpen}
          anchorEl={anchorRef.current}
          placement="right-start"
          modifiers={[
            { name: "offset", options: { offset: [0, 12] } },
            { name: "preventOverflow", options: { boundary: "viewport", padding: 8 } },
          ]}
          sx={{ zIndex: 1300 }}
        >
          <Paper
            onMouseEnter={cancelCloseHover}
            onMouseLeave={scheduleCloseHover}
            sx={{ mt: 0.5, ml: 1, minWidth: 200, ...getMenuPaperSx(theme) }}
          >
            <MenuList disablePadding sx={{ py: 0.75, px: 0.5 }}>
              <Box
                sx={{
                  px: 2,
                  py: 1.25,
                  mb: 0.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ variant: "subtitle2", fontWeight: 600 }}
                />
              </Box>

              {item.children.map((subItem) => {
                const isSubActive = pathname === subItem.path;
                return (
                  <MenuItem
                    key={subItem.path}
                    selected={isSubActive}
                    component={Link}
                    href={subItem.path}
                    onClick={() => setHoverOpen(false)}
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
