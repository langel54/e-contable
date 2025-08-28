import { NextResponse } from "next/server";

export function middleware(request) {
  // Verifica si existe el token en las cookies
  const token = request.cookies.get("token")?.value;

  // Rutas públicas (pueden ser accesibles sin autenticación)
  const publicRoutes = ["/authentication", "/api/login"];

  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // Si no hay token y la ruta no es pública, redirige a /authentication
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/authentication", request.url));
  }

  // Si hay token pero el usuario intenta acceder a una ruta pública, redirige al dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/main", request.url));
  }

  return NextResponse.next();
}

// Configura el matcher para aplicar el middleware solo a las rutas deseadas
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
