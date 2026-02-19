"use client";
import { useMemo } from "react";
import { useAuth } from "@/app/provider";

/**
 * Hook: true si el id_tipo del usuario está en la lista.
 * @param {number[]} ids - Lista de id_tipo permitidos (ej. [1, 6])
 * @returns {boolean}
 */
export function useIdTipoIn(ids) {
  const { userType } = useAuth();
  const idsKey = Array.isArray(ids) ? ids.join(",") : "";
  return useMemo(() => {
    if (!Array.isArray(ids) || ids.length === 0) return false;
    const idTipo = userType != null ? Number(userType) : null;
    if (idTipo == null || Number.isNaN(idTipo)) return false;
    return ids.some((id) => Number(id) === idTipo);
  }, [userType, idsKey]);
}

/**
 * Muestra el contenido solo si id_tipo del usuario está en la lista.
 * Caso contrario: oculta (o muestra fallback).
 *
 * @param {number[]} ids - Lista de id_tipo permitidos (ej. [1, 6])
 * @param {React.ReactNode} [fallback] - Opcional: qué mostrar si no tiene permiso (por defecto nada)
 *
 * @example
 * <ShowForIdTipo ids={[1, 6]}>
 *   <SeccionCaja />
 * </ShowForIdTipo>
 *
 * <ShowForIdTipo ids={[1]} fallback={<Typography>Solo administrador</Typography>}>
 *   <BotonEliminar />
 * </ShowForIdTipo>
 */
export default function ShowForIdTipo({ ids, children, fallback = null }) {
  const show = useIdTipoIn(ids);
  if (!show) return fallback;
  return children;
}
