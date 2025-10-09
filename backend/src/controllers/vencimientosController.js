const vencimientosService = require("../services/vencimientosService");

// Get vencimientos by filters
const getVencimientos = async (req, res) => {
  try {
    const { anio, mes, u_digito } = req.query;
    
    if (!anio || !mes || !u_digito) {
      return res.status(400).json({
        success: false,
        message: "Faltan parámetros requeridos: anio, mes, u_digito",
      });
    }

    const vencimientos = await vencimientosService.getVencimientosByFilters(
      anio,
      mes,
      u_digito
    );

    res.json({
      success: true,
      vencimientos,
      count: vencimientos.length,
    });
  } catch (error) {
    console.error("Error en getVencimientos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Get all vencimientos
const getAllVencimientos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await vencimientosService.getAllVencimientos(limit, offset);

    res.json({
      success: true,
      vencimientos: result.vencimientos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    console.error("Error en getAllVencimientos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Get vencimiento by ID
const getVencimientoById = async (req, res) => {
  try {
    const { id } = req.params;
    const vencimiento = await vencimientosService.getVencimientoById(id);

    if (!vencimiento) {
      return res.status(404).json({
        success: false,
        message: "Vencimiento no encontrado",
      });
    }

    res.json({
      success: true,
      vencimiento,
    });
  } catch (error) {
    console.error("Error en getVencimientoById:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Create vencimiento
const createVencimiento = async (req, res) => {
  try {
    const vencimientoData = req.body;
    const vencimiento = await vencimientosService.createVencimiento(vencimientoData);

    res.status(201).json({
      success: true,
      message: "Vencimiento creado exitosamente",
      vencimiento,
    });
  } catch (error) {
    console.error("Error en createVencimiento:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Update vencimiento
const updateVencimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const vencimientoData = req.body;
    
    const vencimiento = await vencimientosService.updateVencimiento(id, vencimientoData);

    if (!vencimiento) {
      return res.status(404).json({
        success: false,
        message: "Vencimiento no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Vencimiento actualizado exitosamente",
      vencimiento,
    });
  } catch (error) {
    console.error("Error en updateVencimiento:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Delete vencimiento
const deleteVencimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await vencimientosService.deleteVencimiento(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Vencimiento no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Vencimiento eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error en deleteVencimiento:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = {
  getVencimientos,
  getAllVencimientos,
  getVencimientoById,
  createVencimiento,
  updateVencimiento,
  deleteVencimiento,
};