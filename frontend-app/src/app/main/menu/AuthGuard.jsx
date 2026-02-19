"use client";
import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/app/provider";
import { idTipoInList } from "@/app/config/roles";
import { getIdsForPath } from "@/app/config/routePermissions";

/**
 * Protege una vista/ruta: solo los id_tipo que estén en ids pueden verla.
 * Si no tiene permiso → redirige a /unauthorized.
 *
 * Uso:
 *   <AuthGuard ids={[1, 6]}>  <PaginaCaja />  </AuthGuard>
 *   <AuthGuard path="/main/users">  ...  </AuthGuard>   (usa getIdsForPath y protege por ruta)
 */
const AuthGuard = ({ children, ids: idsProp, path: pathProp }) => {
  const { userType, loadingAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const ids = useMemo(() => {
    if (idsProp != null && Array.isArray(idsProp)) return idsProp;
    if (pathProp != null) return getIdsForPath(pathProp);
    if (pathname) return getIdsForPath(pathname);
    return null;
  }, [idsProp, pathProp, pathname]);

  const hasAccess = useMemo(() => {
    if (ids == null) return true;
    if (userType == null) return false;
    return idTipoInList(userType, ids);
  }, [userType, ids]);

  useEffect(() => {
    if (loadingAuth) return;
    if (ids == null) return;
    if (userType != null && !hasAccess) {
      router.replace("/unauthorized");
    }
  }, [userType, hasAccess, loadingAuth, ids, router]);

  if (loadingAuth) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (ids != null && !hasAccess) return null;
  return children;
};

export default AuthGuard;
