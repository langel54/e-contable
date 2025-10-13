import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

const PagosTable = ({ pagos, loading, onDelete }) => {
  console.log("🚀 ~ PagosTable ~ pagos:", pagos);
  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 2, borderRadius: 2, boxShadow: 1 }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Importe</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Forma de Pago</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Detalles</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pagos.map((pago) => (
            <TableRow key={pago.idpagos} hover>
              <TableCell>{dayjs(pago.fecha_p).format("YYYY-MM-DD")}</TableCell>
              <TableCell>
                {Number(pago.importe_p).toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                {pago.descripcion_forma_pago || pago.idforma_pago_trib}
              </TableCell>
              <TableCell>{pago.detalles}</TableCell>
              <TableCell align="right">
                <IconButton
                  color="error"
                  onClick={() => onDelete(pago.idpagos)}
                  disabled={loading}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {pagos.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Typography color="text.secondary">
                    No hay pagos registrados.
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PagosTable;
