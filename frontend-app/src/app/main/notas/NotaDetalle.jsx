"use client";
export default function NotaDetalle({ nota }) {
  return (
    <div style={{ border: "1px solid #eee", margin: "8px 0", padding: 8 }}>
      <div dangerouslySetInnerHTML={{ __html: nota.contenido }} />
      <div style={{ fontSize: 12, color: "#888" }}>
        Creado por: {nota.ncreador} | Última edición: {nota.fecha_ed?.slice(0, 10)} por {nota.neditor}
      </div>
    </div>
  );
}
