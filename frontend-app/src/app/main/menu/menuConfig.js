/**
 * Menú: se construye desde routePermissions. Solo se muestran rutas cuyo ids incluye al usuario.
 */
import { idTipoInList } from "@/app/config/roles";
import { ROUTE_ITEMS } from "@/app/config/routePermissions";
import { ALL_ROLE_IDS } from "@/app/config/roles";

function filterItem(item, idTipo) {
  if (!idTipoInList(idTipo, item.ids)) return null;
  const filtered = { text: item.text, path: item.path, icon: item.icon };
  if (item.children?.length) {
    const children = item.children.map((c) => filterItem(c, idTipo)).filter(Boolean);
    if (children.length) filtered.children = children;
  }
  return filtered;
}

/** Ítems del menú que puede ver este id_tipo (tabla usuarios). */
export function getMenuForRole(idTipo) {
  if (idTipo == null || idTipo === "") return [];
  const num = Number(idTipo);
  if (Number.isNaN(num)) return [];
  return ROUTE_ITEMS.map((item) => filterItem(item, num)).filter(Boolean);
}

const menuItemsByRole = Object.fromEntries(ALL_ROLE_IDS.map((id) => [id, getMenuForRole(id)]));
export default menuItemsByRole;
