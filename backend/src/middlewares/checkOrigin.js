function checkOrigin(req, res, next) {
  const allowedOrigins = ["http://127.0.0.1:3000", "http://localhost:3000"]; // Asegúrate de incluir ambos orígenes

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin); // Permitir el origen
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    ); // Métodos permitidos
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    ); // Encabezados permitidos

    // Si la solicitud es un preflight (OPTIONS), responde con un 200
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    next(); // Continuar con la solicitud
  } else {
    res.status(403).json({ message: "Forbidden: Invalid origin" }); // Rechazar la solicitud
  }
}

module.exports = checkOrigin;
