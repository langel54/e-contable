/**
 * Tabs del Dashboard (Inicio). ids = id_tipo que pueden ver cada tab.
 */
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ClientsDashboardPage from "./clients-dashboard/ClientsDashboardPage";
import CashDashboardPage from "./caja-dashboard/CashDashboardPage";
import TributosDashboardPage from "./tributos-dashboard/TributosDashboardPage";

export const DASHBOARD_TABS = [
  { id: "clientes", label: "Clientes", ids: [1, 2, 3, 6], component: ClientsDashboardPage, icon: <PeopleIcon /> },
  { id: "caja", label: "Caja", ids: [1, 6], component: CashDashboardPage, icon: <AccountBalanceIcon /> },
  { id: "tributos", label: "Tributos", ids: [1, 6], component: TributosDashboardPage, icon: <AccountBalanceWalletIcon /> },
];
