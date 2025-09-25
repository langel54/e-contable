import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { AccountBalance, AccountBalanceWallet } from "@mui/icons-material";

const menuItemsByRole = {
  1: [
    {
      text: "Inicio",
      path: "/main",
      icon: <HomeIcon />,
      allowedRoles: [1, 2, 3],
    },
    {
      text: "Dashboard",
      path: "/main/dashboard",
      icon: <BarChartIcon />,
      allowedRoles: [1],
    },
    {
      text: "Usuarios",
      path: "/main/users",
      icon: <PeopleIcon />,
      allowedRoles: [1],
      children: [
        { text: "Lista", path: "/main/users/list" },
        { text: "Crear", path: "/main/users/create" },
      ],
    },
    {
      text: "Personal",
      path: "/main/staff",
      icon: <GroupIcon />,
      allowedRoles: [1, 2],
    },
    {
      text: "Clientes",
      path: "/main/clients",
      icon: <PersonIcon />,
      allowedRoles: [1, 2, 3],
      children: [
        { text: "Filtro avanzado", path: "/main/clients-filter" },
        { text: "Gestión de Directorio", path: "/main/clients" },
      ],
    },
    {
      text: "Tributos",
      path: "/main/tributos-filter",
      icon: <AccountBalanceWallet />,
      allowedRoles: [1, 2, 3],
    },
    {
      text: "Reportes",
      path: "/main/reports",
      icon: <ReceiptIcon />,
      allowedRoles: [1, 2],
    },
    {
      text: "Configuración",
      path: "/main/settings",
      icon: <SettingsIcon />,
      allowedRoles: [1],
      children: [
        { text: "General", path: "/main/settings/general" },
        { text: "Seguridad", path: "/main/settings/security" },
      ],
    },
    {
      text: "Caja",
      path: "/main/incomes",
      icon: <AccountBalance />,
      allowedRoles: [1],
      children: [
        { text: "Ingresos", path: "/main/incomes" },
        { text: "Egresos", path: "/main/expenses" },
      ],
    },
  ],
  2: [
    { text: "Inicio", path: "/main", icon: <HomeIcon /> },
    { text: "Personal", path: "/main/staff", icon: <GroupIcon /> },
    { text: "Clientes", path: "/main/clients", icon: <PersonIcon /> },
    { text: "Reportes", path: "/main/reports", icon: <ReceiptIcon /> },
  ],
  3: [
    { text: "Inicio", path: "/main", icon: <HomeIcon /> },
    { text: "Clientes", path: "/main/clients", icon: <PersonIcon /> },
  ],
};

export default menuItemsByRole;
