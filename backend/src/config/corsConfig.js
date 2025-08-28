const cors = require("cors");

const corsOptions = {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000", "http://localhost:3001"], // Permitir ambos orígenes
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"], // Asegúrate de permitir Authorization
};

module.exports = corsOptions;
