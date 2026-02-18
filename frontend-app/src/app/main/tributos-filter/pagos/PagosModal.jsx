import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {
  getFormaPagoTrib,
  getPagosByTributo,
  addPago,
  deletePago,
} from "./pagosService";
import PagosTable from "./PagosTable";

const PagosModal = ({ tributo, onAfterSave }) => {
  const inputImporteRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [form, setForm] = useState({
    fecha_p: dayjs().format("YYYY-MM-DD"),
    importe_p: "",
    idforma_pago_trib: "",
    detalles: "",
  });

  const fetchPagos = async () => {
    setLoading(true);
    try {
      const pagosList = await getPagosByTributo(tributo.idtributos);
      setPagos(pagosList || []);
    } catch {
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormasPago = async () => {
    try {
      const data = await getFormaPagoTrib();
      setFormasPago(data?.formaPagoTribs || data || []);
    } catch {
      setFormasPago([]);
    }
  };

  useEffect(() => {
    if (tributo?.idtributos) {
      fetchPagos();
      fetchFormasPago();
    }
  }, [tributo]);

  useEffect(() => {
    inputImporteRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPago = async () => {
    if (!form.importe_p || !form.idforma_pago_trib || !form.fecha_p) {
      Swal.fire({
        title: "Campos requeridos",
        text: "Completa todos los campos obligatorios.",
        icon: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      await addPago(tributo.idtributos, form);
      setForm({
        fecha_p: dayjs().format("YYYY-MM-DD"),
        importe_p: "",
        idforma_pago_trib: "",
        detalles: "",
      });
      await fetchPagos();
      onAfterSave?.(); // notifica al padre que hubo cambios
    } catch (e) {
      Swal.fire({ title: "Error", text: e.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePago = async (idpagos) => {
    setLoading(true);
    try {
      await deletePago(idpagos);
      await fetchPagos();
    } catch (e) {
      Swal.fire({ title: "Error", text: e.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography
        variant="body2"
        align="center"
        sx={{
          mb: 1.5,
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'info.lighter',
          color: "text.primary",
          border: '1px solid',
          borderColor: 'divider',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
        }}
      >
        <span>Tributo:</span>
        <Typography component="span" fontWeight="bold" color="primary">
          {tributo?.cliente_prov?.razonsocial}
        </Typography>{" "}
        | {tributo?.tipo_trib?.descripcion_t} |{" "}
        <Typography component="span" fontWeight="bold">
          {tributo?.mes}-{tributo?.anio}
        </Typography>{" "}
        | S/ <Typography component="span" fontWeight="bold" color="primary">{tributo?.importe_reg}</Typography>
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2, p: 2, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="flex-start"
          flexWrap="wrap"
          useFlexGap
        >
          <TextField
            label="Fecha de Pago"
            type="date"
            name="fecha_p"
            value={form.fecha_p}
            onChange={handleChange}
            sx={{ width: { xs: "100%", sm: 200 } }}
          />
          <TextField
            label="Importe"
            name="importe_p"
            type="number"
            value={form.importe_p}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
            sx={{ width: { xs: "100%", sm: 200 } }}
            inputRef={inputImporteRef}
          />
          <TextField
            select
            label="Forma de Pago"
            name="idforma_pago_trib"
            value={form.idforma_pago_trib}
            onChange={handleChange}
            sx={{ width: { xs: "100%", sm: 200 } }}
          >
            {formasPago.map((fp) => (
              <MenuItem key={fp.idforma_pago_trib} value={fp.idforma_pago_trib}>
                {fp.descripcion}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Detalles"
            name="detalles"
            value={form.detalles}
            onChange={handleChange}
            sx={{ width: { xs: "100%", sm: 260 } }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 1, sm: 0 },
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={handleAddPago}
              disabled={loading}
              startIcon={<AddIcon />}
              sx={{
                px: 2,
                py: 1,
                fontWeight: "bold",
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
                minWidth: 150,
              }}
            >
              Agregar Pago
            </Button>
          </Box>
        </Stack>
      </Box>

      <PagosTable pagos={pagos} loading={loading} onDelete={handleDeletePago} />
    </>
  );
};

export default PagosModal;
