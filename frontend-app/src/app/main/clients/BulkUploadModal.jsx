import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Tooltip,
  TextField,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { createClienteProv } from "@/app/services/clienteProvService";
import { useNotification } from "@/app/context/NotificationContext";

// Registro uno por uno: cada petición es ligera y responde rápido (no colga el sistema)
const DELAY_BETWEEN_RECORDS_MS = 120;
// Máximo 100 filas de datos (aparte del encabezado); si hay más se muestra alerta
const MAX_EXCEL_ROWS = 100;

const TEMPLATE_COLUMNS = [
  { header: "Último Dígito", key: "u_digito", width: 15 },
  { header: "RUC", key: "ruc", width: 15 },
  { header: "Razón Social", key: "razonsocial", width: 35 },
  { header: "Régimen", key: "nregimen", width: 15 },
  { header: "Rubro", key: "nrubro", width: 15 },
  { header: "DNI", key: "dni", width: 12 },
  { header: "Usuario SOL", key: "c_usuario", width: 15 },
  { header: "Clave SOL", key: "c_passw", width: 15 },
  { header: "Honorario mensual", key: "montoref", width: 18 },
];

const BulkUploadModal = ({ open, handleClose, refreshTable }) => {
  const { showSuccess, showError } = useNotification();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [slowWarning, setSlowWarning] = useState(false);
  const [fileName, setFileName] = useState("");
  const slowWarningTimerRef = useRef(null);

  const downloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Plantilla Clientes");

    worksheet.columns = TEMPLATE_COLUMNS;

    // Add example row
    worksheet.addRow({
      u_digito: "0",
      ruc: "20123456789",
      razonsocial: "EMPRESA DE EJEMPLO S.A.C.",
      nregimen: "MYPE",
      nrubro: "SERVICIOS",
      dni: "12345678",
      c_usuario: "USUARIOSOL",
      c_passw: "CLAVESOL123",
      montoref: "150.00",
    });

    // Style the header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "plantilla_clientes.xlsx");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file);
      const worksheet = workbook.getWorksheet(1);
      
      const jsonData = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        const rowData = {};
        TEMPLATE_COLUMNS.forEach((col, index) => {
          const cellValue = row.getCell(index + 1).value;
          const raw = cellValue?.richText
            ? cellValue.richText.map((t) => t.text).join("")
            : cellValue?.text ?? cellValue;
          rowData[col.key] = raw != null ? String(raw).trim() : "";
        });
        const hasRuc = rowData.ruc !== "" && rowData.ruc != null;
        const hasDigito = rowData.u_digito !== "" && rowData.u_digito != null;
        if (hasRuc && hasDigito) {
          jsonData.push(rowData);
        }
      });

      if (jsonData.length > MAX_EXCEL_ROWS) {
        showError(
          `El archivo tiene ${jsonData.length} filas de datos. El máximo permitido es ${MAX_EXCEL_ROWS} filas (aparte del encabezado). Reduzca el archivo o divídalo en varios.`
        );
        setData([]);
        setFileName("");
        return;
      }

      setData(jsonData);
    } catch (error) {
      console.error("Error reading Excel:", error);
      showError("Error al leer el archivo Excel. Asegúrese de usar la plantilla correcta.");
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setData([]);
    setFileName("");
  };

  const handleCellChange = (rowIndex, key, value) => {
    setData((prev) =>
      prev.map((row, i) =>
        i === rowIndex ? { ...row, [key]: value } : row
      )
    );
  };

  const handleRemoveRow = (rowIndex) => {
    setData((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  // Aviso si la petición tarda mucho (el servidor puede no estar respondiendo)
  useEffect(() => {
    if (!uploading) {
      setSlowWarning(false);
      if (slowWarningTimerRef.current) {
        clearTimeout(slowWarningTimerRef.current);
        slowWarningTimerRef.current = null;
      }
      return;
    }
    slowWarningTimerRef.current = setTimeout(() => setSlowWarning(true), 12000);
    return () => {
      if (slowWarningTimerRef.current) clearTimeout(slowWarningTimerRef.current);
    };
  }, [uploading]);

  const handleProcessUpload = async () => {
    if (data.length === 0) return;

    // Solo enviar filas con RUC y Último dígito (evita error "obligatorios" por celdas vacías o editadas)
    const toSend = data.filter((row) => {
      const ruc = row.ruc != null ? String(row.ruc).trim() : "";
      const digito = row.u_digito != null ? String(row.u_digito).trim() : "";
      return ruc !== "" && digito !== "";
    });
    if (toSend.length === 0) {
      showError("No hay registros válidos. Todas las filas deben tener RUC y Último dígito.");
      return;
    }
    if (toSend.length < data.length) {
      showError(`${data.length - toSend.length} fila(s) sin RUC o Último dígito. Complete o elimine esas filas en la vista previa y vuelva a intentar.`);
      return;
    }

    setUploading(true);
    setUploadProgress({ done: 0, total: toSend.length });
    let totalCreated = 0;
    const errors = [];

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      // Estrictamente uno por uno: registrar uno, esperar a que resuelva, luego el siguiente
      for (let i = 0; i < toSend.length; i++) {
        const row = toSend[i];
        const payload = {
          ...row,
          u_digito: row.u_digito != null ? String(row.u_digito).trim() : "",
          ruc: row.ruc != null ? String(row.ruc).trim() : "",
        };
        try {
          await createClienteProv(payload); // espera a que termine antes de seguir
          totalCreated++;
          setUploadProgress((p) => ({ ...p, done: p.done + 1 }));
          // Quitar de la lista el que ya se creó; en la vista previa quedan solo los que fallan
          setData((prev) => {
            const idx = prev.findIndex(
              (r) =>
                String(r.ruc || "").trim() === String(payload.ruc || "").trim() &&
                String(r.u_digito || "").trim() === String(payload.u_digito || "").trim()
            );
            if (idx === -1) return prev;
            return prev.filter((_, j) => j !== idx);
          });
        } catch (err) {
          errors.push({ ruc: payload.ruc, razon: payload.razonsocial, error: err.message });
        }
        if (i < toSend.length - 1) await delay(DELAY_BETWEEN_RECORDS_MS); // pausa antes del siguiente
      }
      if (errors.length === 0) {
        showSuccess(`Se cargaron ${totalCreated} clientes correctamente.`);
        refreshTable();
        handleClose();
        clearData();
      } else if (totalCreated > 0) {
        const detalle = errors.slice(0, 3).map((e) => `${e.ruc}: ${e.error}`).join("; ");
        showError(
          `Se crearon ${totalCreated} de ${toSend.length}. Quedan ${errors.length} en la lista para corregir y volver a enviar. Errores: ${detalle}${errors.length > 3 ? ` y ${errors.length - 3} más.` : "."}`
        );
        refreshTable();
      } else {
        showError(errors[0]?.error || "No se pudo crear ningún registro. Corrija los datos y vuelva a intentar.");
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      showError(error.message || "Error al subir los datos masivos.");
    } finally {
      setUploading(false);
      setUploadProgress({ done: 0, total: 0 });
      setSlowWarning(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Carga Masiva de Clientes</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Box
            sx={{
              p: 4,
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              textAlign: "center",
              bgcolor: "background.neutral",
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
            component="label"
          >
            <input
              type="file"
              hidden
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
            <Typography variant="h6">
              {fileName || "Haz clic para seleccionar un archivo Excel"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Soporta .xlsx y .xls. Máximo {MAX_EXCEL_ROWS} filas (sin contar encabezados).
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              startIcon={<DownloadIcon />}
              onClick={downloadTemplate}
              variant="outlined"
            >
              Descargar Plantilla
            </Button>
            {data.length > 0 && (
              <Button
                startIcon={<DeleteIcon />}
                onClick={clearData}
                color="error"
                variant="outlined"
              >
                Limpiar Datos
              </Button>
            )}
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress /> Cargando Datos...
            </Box>
          ) : data.length > 0 ? (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Vista previa ({data.length} registros) — puede editar antes de confirmar
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {TEMPLATE_COLUMNS.map((col) => (
                        <TableCell key={col.key} sx={{ bgcolor: "background.paper", fontWeight: "bold" }}>
                          {col.header}
                        </TableCell>
                      ))}
                      <TableCell sx={{ bgcolor: "background.paper", fontWeight: "bold", width: 56 }} align="center">
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index} hover>
                        {TEMPLATE_COLUMNS.map((col) => (
                          <TableCell key={col.key} sx={{ py: 0.25, px: 0.75, verticalAlign: "middle" }}>
                            <TextField
                              size="small"
                              fullWidth
                              value={row[col.key] ?? ""}
                              onChange={(e) => handleCellChange(index, col.key, e.target.value)}
                              placeholder="-"
                              variant="standard"
                              sx={{
                                "& .MuiInput-root": { fontSize: "0.8125rem" },
                                "& .MuiInput-input": { py: 0.5 },
                              }}
                            />
                          </TableCell>
                        ))}
                        <TableCell sx={{ py: 0.25, px: 0.5, verticalAlign: "middle" }} align="center">
                          <Tooltip title="Eliminar fila">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveRow(index)}
                              aria-label="Eliminar fila"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Alert severity="info">
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Asegúrese de que su archivo Excel tenga los encabezados exactos de la plantilla.</Typography>
              <Typography variant="body2" component="span"><strong>Requeridos:</strong> Último Dígito, RUC.</Typography>
              <br />
              <Typography variant="body2" component="span"><strong>Por defecto (si no se envían):</strong> Facturador = Soluciones Contables, Estado = Activo, Declarado = No.</Typography>
              <br />
              <Typography variant="body2" component="span"><strong>Régimen y Rubro:</strong> Deben existir ya en el sistema (configuración). Si el valor no existe, se guardará el cliente sin régimen/rubro.</Typography>
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3 }} flexDirection="column" alignItems="stretch">
        {slowWarning && (
          <Alert severity="warning" sx={{ width: "100%", mb: 1 }}>
            La petición está tardando. Compruebe que el servidor backend esté en ejecución y que la variable{" "}
            <strong>NEXT_PUBLIC_API_URL</strong> apunte a la URL correcta (p. ej. http://localhost:3001/api). Si sigue sin responder, revise la consola del servidor.
          </Alert>
        )}
        {uploading && uploadProgress.total > 0 && (
          <Box sx={{ width: "100%", mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Registrando uno por uno: {uploadProgress.done} / {uploadProgress.total} registros
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
        )}
        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ width: "100%" }}>
          <Button onClick={handleClose} color="inherit" disabled={uploading}>
            Cancelar
          </Button>
          <Button
            onClick={handleProcessUpload}
            variant="contained"
            disabled={data.length === 0 || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            sx={{ minWidth: 150 }}
          >
            {uploading ? "Subiendo..." : "Confirmar Carga"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default BulkUploadModal;
