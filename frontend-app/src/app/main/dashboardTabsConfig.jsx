/**
 * Tabs del Dashboard (Inicio). ids = id_tipo que pueden ver cada tab.
 */
import ClientsDashboardPage from "./clients-dashboard/ClientsDashboardPage";
import CashDashboardPage from "./caja-dashboard/CashDashboardPage";
import TributosDashboardPage from "./tributos-dashboard/TributosDashboardPage";

export const DASHBOARD_TABS = [
  { id: "clientes", label: "Clientes", ids: [1, 2, 3, 6], component: ClientsDashboardPage },
  { id: "caja", label: "Caja", ids: [1, 6], component: CashDashboardPage },
  { id: "tributos", label: "Tributos", ids: [1, 6], component: TributosDashboardPage },
];
