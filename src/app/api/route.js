import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/* ============ UTILS ============ */
async function fetchWithTimeout(url, opts = {}, ms = 15000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    const r = await fetch(url, { ...opts, signal: c.signal, cache: "no-store" });
    clearTimeout(t);
    return r;
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

/* ============ TIKTOK (multi-endpoint) ============ */
async function tiktokDownload(url) {
  // Endpoint 1: tikwm.com (paling stabil)
  const endpoints = [
    { u: `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`, parse: (d) => d.code === 0 && d.data ? {
      title: d.data.title || "tiktok-video",
      author: d.data.author?.unique_id || "",
      nickname: d.data.author?.nickname || "",
      cover: d.data.origin_cover || d.data.cover,
      video: d.data.hdplay || d.data.play,
      noWm: d.data.play,
      music: d.data.music,
      duration: d.data.duration,
      stats: { plays: d.data.play_count || 0, likes: d.data.digg_count || 0, comments: d.data.comment_count || 0, shares: d.data.share_count || 0 },
    } : null },
    { u: `https://tikwm.com/api/?url=${encodeURIComponent(url)}`, parse: (d) => d.code === 0 && d.data ? {
      title: d.data.title || "tiktok-video",
      author: d.data.author?.unique_id || "",
      cover: d.data.cover,
      video: d.data.hdplay || d.data.play,
      noWm: d.data.play,
      music: d.data.music,
    } : null },
  ];
  for (const ep of endpoints) {
    try {
      const r = await fetchWithTimeout(ep.u, { headers: { "User-Agent": "Mozilla/5.0" } });
      const d = await r.json();
      const parsed = ep.parse(d);
      if (parsed) return parsed;
    } catch { continue; }
  }
  return null;
}

/* ============ YOUTUBE (multi-endpoint fallback) ============ */
function extractYtId(url) {
  const m = String(url || "").match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

async function youtubeDownload(url) {
  const vid = extractYtId(url);
  if (!vid) return { error: "URL YouTube tidak valid." };

  // Coba cobalt.tools instance publik
  const cobaltInstances = [
    "https://api.cobalt.tools/api/json",
    "https://co.wuk.sh/api/json",
    "https://cobalt-api.kwiatekmiki.com/api/json",
  ];

  for (const inst of cobaltInstances) {
    try {
      const r = await fetchWithTimeout(inst, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          url: `https://www.youtube.com/watch?v=${vid}`,
          vQuality: "720",
          isAudioOnly: false,
        }),
      }, 12000);
      if (r.ok) {
        const d = await r.json();
        if (d.url) {
          return {
            videoId: vid,
            downloadUrl: d.url,
            title: d.filename || `YouTube Video`,
            thumbnail: `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`,
          };
        }
      }
    } catch { continue; }
  }

  // Fallback: kembalikan thumbnail + pesan
  return {
    error: "Server downloader sedang sibuk. Coba lagi 10-30 detik lagi atau gunakan URL lain.",
    videoId: vid,
    thumbnail: `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`,
  };
}

/* ============ PROXY (untuk auto-download) ============ */
async function proxyStream(targetUrl, request) {
  const r = await fetchWithTimeout(targetUrl, {
    headers: { "User-Agent": request.headers.get("user-agent") || "Mozilla/5.0" },
  }, 30000);
  if (!r.ok) throw new Error(`Upstream ${r.status}`);

  const headers = new Headers();
  const ct = r.headers.get("content-type");
  const cl = r.headers.get("content-length");
  if (ct) headers.set("Content-Type", ct);
  if (cl) headers.set("Content-Length", cl);
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set("Access-Control-Allow-Origin", "*");

  return new NextResponse(r.body, { headers });
}

/* ============ TEMP MAIL (retry multi-domain) ============ */
async function createTempMail() {
  // Ambil daftar domain
  let domains = [];
  try {
    const r = await fetchWithTimeout("https://api.mail.tm/domains?page=1", {}, 10000);
    const d = await r.json();
    domains = (d["hydra:member"] || []).map((x) => x.domain);
  } catch { throw new Error("Gagal mengambil domain temp mail."); }

  if (domains.length === 0) throw new Error("Domain temp mail tidak tersedia.");

  // Coba tiap domain hingga berhasil
  for (const dom of domains.slice(0, 3)) {
    const email = `${Math.random().toString(36).slice(2, 11)}${Date.now().toString(36).slice(-4)}@${dom}`;
    const pw = Math.random().toString(36).slice(2, 16);

    try {
      const cr = await fetchWithTimeout("https://api.mail.tm/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: email, password: pw }),
      }, 10000);

      if (!cr.ok) {
        // Jika 422 = email sudah ada, coba domain berikutnya
        // Jika 429 = rate limit, tunggu sebentar
        if (cr.status === 429) await new Promise((r) => setTimeout(r, 1500));
        continue;
      }

      const tr = await fetchWithTimeout("https://api.mail.tm/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: email, password: pw }),
      }, 10000);
      const td = await tr.json();
      if (!td.token) continue;

      return { email, password: pw, token: td.token, id: td.id };
    } catch { continue; }
  }

  throw new Error("Semua domain sedang sibuk. Coba lagi beberapa saat.");
}

/* ============ HANDLER ============ */
export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    /* ---- TIKTOK ---- */
    if (action === "tiktok") {
      const { url } = body;
      if (!url || !/tiktok\.com|vt\.tiktok|vm\.tiktok/i.test(url)) {
        return NextResponse.json({ error: "URL TikTok tidak valid." }, { status: 400 });
      }
      const data = await tiktokDownload(url);
      if (!data) return NextResponse.json({ error: "Video tidak ditemukan atau privat." }, { status: 400 });
      return NextResponse.json(data);
    }

    /* ---- YOUTUBE ---- */
    if (action === "youtube") {
      const data = await youtubeDownload(body.url);
      if (data.error) {
        return NextResponse.json(data, { status: data.videoId ? 503 : 400 });
      }
      return NextResponse.json(data);
    }

    /* ---- TEMP MAIL ---- */
    if (action === "tempmail-create") {
      const data = await createTempMail();
      return NextResponse.json(data);
    }

    if (action === "tempmail-inbox") {
      if (!body.token) return NextResponse.json([]);
      try {
        const r = await fetchWithTimeout("https://api.mail.tm/messages?page=1", {
          headers: { Authorization: `Bearer ${body.token}` },
        }, 10000);
        if (!r.ok) return NextResponse.json([]);
        const j = await r.json();
        return NextResponse.json(j["hydra:member"] || []);
      } catch { return NextResponse.json([]); }
    }

    if (action === "tempmail-read") {
      if (!body.token || !body.id) return NextResponse.json({ error: "Parameter kurang." }, { status: 400 });
      const r = await fetchWithTimeout(`https://api.mail.tm/messages/${body.id}`, {
        headers: { Authorization: `Bearer ${body.token}` },
      }, 10000);
      const j = await r.json();
      return NextResponse.json(j);
    }

    /* ---- IP LOOKUP ---- */
    if (action === "ip-lookup") {
      const target = body.ip ? `/${body.ip}` : "";
      const r = await fetchWithTimeout(`https://ipapi.co${target}/json/`, {}, 8000);
      const j = await r.json();
      return NextResponse.json(j);
    }

    /* ---- PROXY untuk auto-download ---- */
    if (action === "proxy-url") {
      const { url } = body;
      if (!url) return NextResponse.json({ error: "URL wajib." }, { status: 400 });
      return NextResponse.json({ proxy: `/api/proxy?url=${encodeURIComponent(url)}` });
    }

    return NextResponse.json({ error: "Aksi tidak dikenal." }, { status: 400 });
  } catch (e) {
    console.error("[API Error]", e);
    return NextResponse.json({ error: e.message || "Terjadi kesalahan server." }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const proxyUrl = searchParams.get("url");

  // Jika ada ?url= maka ini request proxy
  if (proxyUrl) {
    try {
      return await proxyStream(proxyUrl, req);
    } catch (e) {
      console.error("[Proxy Error]", e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    service: "AllTool API",
    version: "2.0",
    endpoints: ["tiktok", "youtube", "tempmail-create", "tempmail-inbox", "tempmail-read", "ip-lookup", "proxy"],
  });
}
