import { alpha } from "@mui/material/styles";

// ==============================|| TOKENS DE APP (ERP MODERNO) ||============================== //

export function getAppTokens(theme) {
  const { palette } = theme;
  const isDark = palette.mode === "dark";
  const primary = palette.primary.main;

  return {
    sidebar: {
      width: 268,
      gap: 14,
      radius: 12,
    },
    surface: {
      mainBackground: isDark
        ? `radial-gradient(1200px 600px at 10% -10%, ${alpha(primary, 0.22)} 0%, transparent 55%),
           radial-gradient(900px 500px at 90% 0%, ${alpha(palette.info.main, 0.12)} 0%, transparent 50%),
           ${palette.background.default}`
        : `radial-gradient(1200px 600px at 8% -12%, ${alpha(primary, 0.1)} 0%, transparent 55%),
           radial-gradient(800px 480px at 92% 4%, ${alpha(palette.info.main, 0.07)} 0%, transparent 50%),
           ${palette.background.default}`,
      cardGlow: isDark
        ? `0 1px 2px ${alpha("#000", 0.2)}, 0 4px 16px ${alpha("#000", 0.25)}`
        : `0 1px 2px ${alpha(palette.grey[900], 0.04)}, 0 6px 20px ${alpha(primary, 0.05)}`,
    },
    gradient: {
      primary: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
      primarySoft: `linear-gradient(135deg, ${alpha(primary, 0.14)} 0%, ${alpha(primary, 0.04)} 100%)`,
    },
  };
}

/** Tarjetas KPI: glass muy sutil (sin manchas ni halos fuertes) */
export function getKpiCardSx(theme, accent) {
  const isDark = theme.palette.mode === "dark";
  const paper = theme.palette.background.paper;

  return {
    height: "100%",
    position: "relative",
    overflow: "hidden",
    border: `1px solid ${theme.palette.divider}`,
    borderTop: `2px solid ${alpha(accent, isDark ? 0.45 : 0.35)}`,
    bgcolor: paper,
    backgroundImage: isDark
      ? `linear-gradient(180deg, ${alpha("#fff", 0.03)} 0%, transparent 28%)`
      : `linear-gradient(180deg, ${alpha("#fff", 0.55)} 0%, transparent 32%)`,
    boxShadow: theme.app?.surface?.cardGlow || theme.customShadows?.z1,
    transition: "box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s ease, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: -24,
      right: -24,
      width: 96,
      height: 96,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${alpha(accent, isDark ? 0.08 : 0.06)} 0%, transparent 72%)`,
      pointerEvents: "none",
      zIndex: 0,
    },
    "&:hover": {
      boxShadow: theme.customShadows?.z2,
      borderColor: alpha(accent, theme.palette.mode === "dark" ? 0.55 : 0.45),
      transform: "translateY(-4px)",
    },
  };
}

export function getKpiIconSx(theme, accent) {
  const isDark = theme.palette.mode === "dark";
  return {
    width: 40,
    height: 40,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 1.5,
    color: accent,
    bgcolor: alpha(accent, isDark ? 0.12 : 0.08),
    border: `1px solid ${alpha(accent, isDark ? 0.15 : 0.12)}`,
  };
}

// ——— Interacción sutil (clicables) ———

const INTERACTION_MS = "0.18s ease";

function tint(theme, colorKey, level = "hover") {
  const isDark = theme.palette.mode === "dark";
  const main = theme.palette[colorKey]?.main ?? theme.palette.primary.main;
  const levels = {
    hover: isDark ? 0.09 : 0.06,
    active: isDark ? 0.14 : 0.1,
    selected: isDark ? 0.12 : 0.08,
  };
  return alpha(main, levels[level] ?? levels.hover);
}

export function getInteractionTransition() {
  return {
    transition: `background-color ${INTERACTION_MS}, color ${INTERACTION_MS}, border-color ${INTERACTION_MS}, box-shadow ${INTERACTION_MS}`,
  };
}

export function getInteractionFocusRing(theme, colorKey = "primary") {
  const main = theme.palette[colorKey]?.main ?? theme.palette.primary.main;
  return {
    "&:focus-visible": {
      outline: `2px solid ${alpha(main, 0.45)}`,
      outlineOffset: 2,
    },
  };
}

/** Hover suave (text, outlined, icon, menú) */
export function getSubtleHover(theme, colorKey = "primary") {
  return {
    backgroundColor: tint(theme, colorKey, "hover"),
  };
}

export function getSubtleActive(theme, colorKey = "primary") {
  return {
    backgroundColor: tint(theme, colorKey, "active"),
  };
}

/** Hover en botones contained */
export function getSubtleContainedHover(theme, colorKey = "primary") {
  const c = theme.palette[colorKey];
  if (!c) return {};
  return {
    backgroundColor: c.dark,
  };
}

export function getSubtleContainedActive(theme, colorKey = "primary") {
  const c = theme.palette[colorKey];
  if (!c) return {};
  return {
    backgroundColor: c.darker ?? c.dark,
  };
}

/** Ítem de navegación lateral / menú */
export function getNavListItemSx(theme, active = false) {
  const primary = theme.palette.primary.main;

  const base = {
    borderRadius: 1.5,
    minHeight: 44,
    ...getInteractionTransition(),
    color: active ? "primary.main" : "text.secondary",
    fontWeight: active ? 600 : 500,
  };

  if (active) {
    return {
      ...base,
      backgroundColor: tint(theme, "primary", "selected"),
      boxShadow: `inset 3px 0 0 ${primary}`,
      "&:hover": {
        backgroundColor: tint(theme, "primary", "hover"),
      },
    };
  }

  return {
    ...base,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      color: "text.primary",
    },
  };
}

// ——— Navegación, menús, tabs y tablas ———

export function getTableHeaderBg(theme) {
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const paper = theme.palette.background.paper;
  return isDark
    ? `linear-gradient(180deg, ${alpha(primary, 0.1)} 0%, ${alpha(paper, 0.98)} 100%)`
    : `linear-gradient(180deg, ${alpha(primary, 0.05)} 0%, ${theme.palette.grey[50]} 100%)`;
}

/** Paper de menús desplegables (Popper, MuiMenu) */
export function getMenuPaperSx(theme) {
  const isDark = theme.palette.mode === "dark";
  return {
    borderRadius: 1.5,
    border: `1px solid ${theme.palette.divider}`,
    backgroundImage: isDark
      ? `linear-gradient(180deg, ${alpha("#fff", 0.04)} 0%, transparent 24%)`
      : `linear-gradient(180deg, ${alpha("#fff", 0.9)} 0%, transparent 30%)`,
    bgcolor: alpha(theme.palette.background.paper, isDark ? 0.95 : 0.98),
    backdropFilter: "blur(12px)",
    boxShadow: theme.customShadows?.z2,
    overflow: "hidden",
  };
}
