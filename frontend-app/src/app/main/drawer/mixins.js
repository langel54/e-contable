import { alpha } from "@mui/material/styles";



export const drawerWidth = 268;

const GAP = 10;

const RADIUS = 12;

const CLOSED_WIDTH = 48;



const paperBase = (theme, width) => ({

  width,

  margin: GAP,

  height: `calc(100vh - ${GAP * 2}px)`,

  top: GAP,

  borderRadius: RADIUS,

  border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.5 : 1)}`,

  boxShadow:

    theme.palette.mode === "dark"

      ? `0 24px 48px ${alpha("#000", 0.45)}, 0 0 0 1px ${alpha(theme.palette.common.white, 0.05)}`

      : `0 20px 40px ${alpha(theme.palette.grey[900], 0.08)}, 0 0 0 1px ${alpha(theme.palette.grey[900], 0.04)}`,

  backgroundColor:

    theme.palette.mode === "dark"

      ? alpha(theme.palette.background.paper, 0.88)

      : alpha(theme.palette.background.paper, 0.92),

  backdropFilter: "blur(20px) saturate(1.2)",

  overflowX: "hidden",

  boxSizing: "border-box",

  position: "fixed",

  left: 0,

});



export const openedMixin = (theme) => ({

  width: drawerWidth + GAP * 2,

  flexShrink: 0,

  transition: theme.transitions.create("width", {

    easing: theme.transitions.easing.easeInOut,

    duration: theme.transitions.duration.enteringScreen,

  }),

  overflowX: "hidden",

  "& .MuiDrawer-paper": paperBase(theme, drawerWidth),

});



export const closedMixin = (theme) => ({

  width: CLOSED_WIDTH + GAP * 2,

  flexShrink: 0,

  transition: theme.transitions.create("width", {

    easing: theme.transitions.easing.easeInOut,

    duration: theme.transitions.duration.leavingScreen,

  }),

  overflowX: "hidden",

  "& .MuiDrawer-paper": paperBase(theme, CLOSED_WIDTH),

});


