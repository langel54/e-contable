/**
 * Builds a URL with an #autologin hash containing encoded credentials.
 * Used by browser extensions to automate login.
 */
function buildAutologinUrl(base, ruc, usuario, password, origin) {
    const encodePayload = (obj) => {
        const json = JSON.stringify(obj);
        return Buffer.from(json, "utf8").toString("base64");
    };

    const payload = {
        u: String(ruc),
        usuario: String(usuario),
        p: String(password),
        ts: Date.now(),
        maxAgeMs: 2 * 60 * 1000,
        origin,
    };

    const b64 = encodePayload(payload);
    return `${base}#autologin=${b64}`;
}

module.exports = { buildAutologinUrl };
