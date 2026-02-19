/**
 * Rutas y menú: quién puede ver cada una.
 * Una sola regla: ids = lista de id_tipo (tabla usuarios). Si id_tipo está en ids → ve la ruta.
 */
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { AccountBalance, AccountBalanceWallet, Description } from "@mui/icons-material";
import { ROLE_IDS, ALL_ROLE_IDS } from "./roles";

const TODOS = ALL_ROLE_IDS; // [1,2,3,4,5,6]
const ADMIN_Y_MANAGER_OPERADOR = [ROLE_IDS.ADMIN, ROLE_IDS.MANAGER, ROLE_IDS.OPERADOR]; // 1,2,3
const SOLO_ADMIN = [ROLE_IDS.ADMIN]; // 1

/** Cada ítem: ids = id_tipo que pueden ver esta ruta (uno o varios) */
export const ROUTE_ITEMS = [
  { text: "Inicio", path: "/main", icon: <HomeIcon />, ids: TODOS },
  { text: "Usuarios", path: "/main/users", icon: <PeopleIcon />, ids: SOLO_ADMIN },
  {
    text: "Clientes",
    path: "/main/clients",
    icon: <PersonIcon />,
    ids: ADMIN_Y_MANAGER_OPERADOR,
    children: [
      { text: "Filtro avanzado", path: "/main/clients-filter", ids: ADMIN_Y_MANAGER_OPERADOR },
      { text: "Gestión de Directorio", path: "/main/clients", ids: ADMIN_Y_MANAGER_OPERADOR },
    ],
  },
  { text: "Tributos", path: "/main/tributos-filter", icon: <AccountBalanceWallet />, ids: ADMIN_Y_MANAGER_OPERADOR },
  {
    text: "Caja",
    path: "/main/incomes",
    icon: <AccountBalance />,
    ids: SOLO_ADMIN,
    children: [
      { text: "Ingresos", path: "/main/incomes", ids: SOLO_ADMIN },
      { text: "Egresos", path: "/main/expenses", ids: SOLO_ADMIN },
    ],
  },
  {
    text: "Reportes",
    path: "/main/estado-cuenta",
    icon: <Description />,
    ids: ADMIN_Y_MANAGER_OPERADOR,
    children: [
      { text: "Estado Cta por cliente", path: "/main/estado-cuenta", ids: ADMIN_Y_MANAGER_OPERADOR },
      { text: "Ingresos Anuales", path: "/main/incomes/annual-report", ids: ADMIN_Y_MANAGER_OPERADOR },
      { text: "Egresos Anuales", path: "/main/expenses/annual-report", ids: ADMIN_Y_MANAGER_OPERADOR },
    ],
  },
  { text: "Notas", path: "/main/notas", icon: <ReceiptIcon />, ids: ADMIN_Y_MANAGER_OPERADOR },
  {
    text: "Administración",
    path: "/main/admin",
    icon: <SettingsIcon />,
    ids: SOLO_ADMIN,
    children: [
      { text: "Facturadores", path: "/main/admin/facturadores", ids: SOLO_ADMIN },
      { text: "Conceptos", path: "/main/admin/conceptos", ids: SOLO_ADMIN },
      { text: "Tipos de Tributo", path: "/main/admin/tipos-tributo", ids: SOLO_ADMIN },
      { text: "Formas de Pago", path: "/main/admin/formas-pago", ids: SOLO_ADMIN },
      { text: "Vencimientos", path: "/main/admin/vencimientos", ids: SOLO_ADMIN },
      { text: "Buzón SOL", path: "/main/admin/buzon", ids: SOLO_ADMIN },
      { text: "Buzón SUNAFIL", path: "/main/admin/sunafil", ids: SOLO_ADMIN },
    ],
  },
  { text: "Gestión Cajas", path: "/main/admin/caja", icon: <AccountBalance />, ids: SOLO_ADMIN },
];

const normalizePath = (p) => (p || "").replace(/\/$/, "");

function findItemByPath(items, path) {
  for (const item of items) {
    if (normalizePath(item.path) === normalizePath(path)) return item;
    if (item.children) {
      const found = findItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Devuelve los id_tipo que pueden acceder a esta ruta (para proteger la vista).
 * Uso: <AuthGuard ids={getIdsForPath(pathname)}>  o  ids={getIdsForPath('/main/users')}
 * Si la ruta no está definida, retorna null (AuthGuard interpreta null = no restringir).
 */
export function getIdsForPath(path) {
  const item = findItemByPath(ROUTE_ITEMS, path);
  return item?.ids ?? null;
}
