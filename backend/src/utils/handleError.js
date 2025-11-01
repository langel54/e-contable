/**
 * Maneja los errores HTTP y envía una respuesta estandarizada.
 * @param {object} res - El objeto de respuesta de Express.
 * @param {string} message - Un mensaje de error descriptivo.
 * @param {number} code - El código de estado HTTP (por defecto 500).
 */
const handleHttpError = (res, message = "Algo salió mal", code = 500) => {
  res.status(code).json({ error: message });
};

module.exports = { handleHttpError };