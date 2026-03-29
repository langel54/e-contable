const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((item) => item.trim())
  : ["http://127.0.0.1:80", "http://localhost:80,http://127.0.0.1:3000", "http://localhost:3000"];
console.log("🚀 ~ allowedOrigins:", allowedOrigins);

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
};

module.exports = corsOptions;
