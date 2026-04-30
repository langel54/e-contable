/**
 * Proceso dedicado: Playwright fuera del API HTTP.
 * Expone HTTP interno (sin Redis): encola trabajos en memoria y reporta progreso.
 *
 * Arranque: `npm run worker` o contenedor backend-worker.
 * Variables: SCRAPER_WORKER_PORT (default 3101), SCRAPER_WORKER_SECRET (opcional, compartida con el API).
 */
require("dotenv").config();

const express = require("express");
const { randomUUID } = require("crypto");
const sunafilService = require("../services/sunafilService");
const buzonService = require("../services/buzonService");

const jobState = new Map();

const sunafilQueue = [];
let sunafilRunning = false;

const buzonQueue = [];
let buzonRunning = false;

function requireInternalToken(req, res, next) {
  const secret = process.env.SCRAPER_WORKER_SECRET;
  if (!secret) return next();
  const token = req.headers["x-internal-token"];
  if (token !== secret) {
    return res.status(403).json({ error: "No autorizado" });
  }
  return next();
}

async function runSunafilPipeline() {
  if (sunafilRunning) return;
  const jobId = sunafilQueue[0];
  if (!jobId) return;

  sunafilRunning = true;
  try {
    await sunafilService.verifyMonitoredSunafil((p) => {
      jobState.set(jobId, { ...p, error: undefined });
    });
    const cur = jobState.get(jobId) || {};
    jobState.set(jobId, { ...cur, inProgress: false });
  } catch (err) {
    console.error("[browser-worker:sunafil]", err);
    const cur = jobState.get(jobId) || {};
    jobState.set(jobId, {
      ...cur,
      inProgress: false,
      error: err.message || String(err),
    });
  } finally {
    sunafilQueue.shift();
    sunafilRunning = false;
    setImmediate(() => {
      runSunafilPipeline().catch((e) =>
        console.error("[browser-worker:sunafil] pipeline:", e)
      );
    });
  }
}

async function runBuzonPipeline() {
  if (buzonRunning) return;
  const jobId = buzonQueue[0];
  if (!jobId) return;

  buzonRunning = true;
  try {
    await buzonService.verifyMonitoredBuzones((p) => {
      jobState.set(jobId, { ...p, error: undefined });
    });
    const cur = jobState.get(jobId) || {};
    jobState.set(jobId, { ...cur, inProgress: false });
  } catch (err) {
    console.error("[browser-worker:buzon]", err);
    const cur = jobState.get(jobId) || {};
    jobState.set(jobId, {
      ...cur,
      inProgress: false,
      error: err.message || String(err),
    });
  } finally {
    buzonQueue.shift();
    buzonRunning = false;
    setImmediate(() => {
      runBuzonPipeline().catch((e) =>
        console.error("[browser-worker:buzon] pipeline:", e)
      );
    });
  }
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/internal", requireInternalToken);

  app.post("/internal/jobs/sunafil-verify", (req, res) => {
    const jobId = randomUUID();
    jobState.set(jobId, { total: 0, done: 0, inProgress: true });
    sunafilQueue.push(jobId);
    runSunafilPipeline();
    res.status(202).json({
      jobId,
      message: "Verificación SUNAFIL encolada en el worker.",
    });
  });

  app.post("/internal/jobs/buzon-verify", (req, res) => {
    const jobId = randomUUID();
    jobState.set(jobId, { total: 0, done: 0, inProgress: true });
    buzonQueue.push(jobId);
    runBuzonPipeline();
    res.status(202).json({
      jobId,
      message: "Verificación buzón encolada en el worker.",
    });
  });

  app.get("/internal/jobs/:jobId/progress", (req, res) => {
    const { jobId } = req.params;
    if (!jobState.has(jobId)) {
      return res.status(404).json({ error: "Job no encontrado" });
    }
    const p = jobState.get(jobId);
    return res.json({
      total: p.total ?? 0,
      done: p.done ?? 0,
      inProgress: !!p.inProgress,
      ...(p.error ? { error: p.error } : {}),
    });
  });

  app.get("/internal/health", (req, res) => {
    res.json({ ok: true, service: "browser-worker" });
  });

  return app;
}

function startServer() {
  const port = parseInt(process.env.SCRAPER_WORKER_PORT || "3101", 10);
  const app = createApp();
  app.listen(port, "0.0.0.0", () => {
    console.log(
      `[browser-worker] HTTP interno en 0.0.0.0:${port} (sin Redis; cola en memoria)`
    );
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { createApp, startServer };
