/**
 * Constantes que mapean id_tipo (tabla usuarios / tipo_usuario en BD).
 * 1 = más privilegios, 6 = menos privilegios.
 */
export const ROLE_IDS = {
  ADMIN: 1,
  MANAGER: 2,
  OPERADOR: 3,
  CONSULTA_AVANZADA: 4,
  CONSULTA: 5,
  LIMITADO: 6,
};

/** Nombres legibles para UI (opcional; los nombres pueden venir de la BD) */
export const ROLE_LABELS = {
  [ROLE_IDS.ADMIN]: "Administrador",
  [ROLE_IDS.MANAGER]: "Manager",
  [ROLE_IDS.OPERADOR]: "Operador",
  [ROLE_IDS.CONSULTA_AVANZADA]: "Consulta avanzada",
  [ROLE_IDS.CONSULTA]: "Consulta",
  [ROLE_IDS.LIMITADO]: "Limitado",
};

/** Todos los id_tipo (1 a 6) */
export const ALL_ROLE_IDS = [1, 2, 3, 4, 5, 6];

/**
 * True si el id_tipo del usuario está en la lista ids.
 * Usar para rutas y componentes: mismo criterio en todo el proyecto.
 */
export function idTipoInList(idTipo, ids) {
  if (idTipo == null || !Array.isArray(ids) || ids.length === 0) return false;
  const num = Number(idTipo);
  if (Number.isNaN(num)) return false;
  return ids.some((id) => Number(id) === num);
}
