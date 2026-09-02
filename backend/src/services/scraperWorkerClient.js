/**
 * Cliente HTTP hacia el proceso «browser-worker» (sin Redis).
 * Variables: SCRAPER_WORKER_URL (p. ej. http://backend-worker:3101), SCRAPER_WORKER_SECRET (opcional).
 */

function baseUrl() {
  return (process.env.SCRAPER_WORKER_URL || "http://127.0.0.1:3101").replace(/\/$/, "");
}

function headers() {
  const h = { "Content-Type": "application/json" };
  const secret = process.env.SCRAPER_WORKER_SECRET;
  if (secret) {
    h["X-Internal-Token"] = secret;
  }
  return h;
}

async function startSunafilVerify() {
  const res = await fetch(`${baseUrl()}/internal/jobs/sunafil-verify`, {
    method: "POST",
    headers: headers(),
    body: "{}",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || res.statusText || "Error llamando al worker";
    throw new Error(msg);
  }
  return data;
}

async function startBuzonVerify() {
  const res = await fetch(`${baseUrl()}/internal/jobs/buzon-verify`, {
    method: "POST",
    headers: headers(),
    body: "{}",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || res.statusText || "Error llamando al worker";
    throw new Error(msg);
  }
  return data;
}

async function getJobProgress(jobId) {
  const res = await fetch(
    `${baseUrl()}/internal/jobs/${encodeURIComponent(jobId)}/progress`,
    { headers: headers() }
  );
  if (res.status === 404) {
    return { total: 0, done: 0, inProgress: false };
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || res.statusText || "Error leyendo progreso";
    throw new Error(msg);
  }
  return data;
}

module.exports = {
  startSunafilVerify,
  startBuzonVerify,
  getJobProgress,
};
