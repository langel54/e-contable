const cors = require("cors");

const defaultOrigins = [
  "http://localhost",
  "http://127.0.0.1",
  "http://localhost:80",
  "http://127.0.0.1:80",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((item) => item.trim())
  : defaultOrigins;
console.log("🚀 ~ allowedOrigins:", allowedOrigins);

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
};

module.exports = corsOptions;
