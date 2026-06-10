// 3D-Druck Preisrechner — Sync-Backend (Cloudflare Worker + KV)
//
// Speichert genau einen gemeinsamen Zustand (filaments/printers/settings) unter
// dem KV-Key "state". Lesen UND Schreiben verlangen einen Bearer-Token, der gegen
// das Secret API_TOKEN geprüft wird — das Frontend liegt öffentlich auf GitHub Pages,
// also darf hier nichts ohne Token gehen.

const KV_KEY = "state";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function authorized(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return env.API_TOKEN && token === env.API_TOKEN;
}

function validShape(d) {
  return d && typeof d === "object"
    && Array.isArray(d.filaments)
    && Array.isArray(d.printers)
    && d.settings && typeof d.settings === "object";
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (!authorized(request, env)) {
      return json({ error: "unauthorized" }, 401);
    }

    const { pathname } = new URL(request.url);
    if (pathname !== "/data") {
      return json({ error: "not found" }, 404);
    }

    if (request.method === "GET") {
      const raw = await env.KV.get(KV_KEY);
      return json(raw ? JSON.parse(raw) : {});
    }

    if (request.method === "PUT") {
      let data;
      try {
        data = await request.json();
      } catch {
        return json({ error: "invalid json" }, 400);
      }
      if (!validShape(data)) {
        return json({ error: "bad shape" }, 422);
      }
      await env.KV.put(KV_KEY, JSON.stringify(data));
      return json({ ok: true });
    }

    return json({ error: "method not allowed" }, 405);
  },
};
