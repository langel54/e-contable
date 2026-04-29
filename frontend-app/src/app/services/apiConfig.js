/**
 * URL base del backend visto desde el navegador.
 * Por defecto "/api": Next.js reenvía al servidor Express (BACKEND_URL / rewrites).
 */
const raw = (process.env.NEXT_PUBLIC_API_URL || "/api").trim();
export const API_BASE = raw.replace(/\/$/, "");
