"use client";
import { Box } from "@mui/material";

export default function NotaDetalle({ nota }) {
  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", margin: "8px 0", padding: 1 }}>
      <div dangerouslySetInnerHTML={{ __html: nota.contenido }} />
      <Box component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
        Creado por: {nota.ncreador} | Última edición: {nota.fecha_ed?.slice(0, 10)} por {nota.neditor}
      </Box>
    </Box>
  );
}
