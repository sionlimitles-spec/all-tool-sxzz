import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    /* ============ TIKTOK ============ */
    if (action === "tiktok") {
      const { url } = body;
      if (!url || !/tiktok\.com|vt\.tiktok|vm\.tiktok/i.test(url)) {
        return NextResponse.json({ error: "URL TikTok tidak valid." }, { status: 400 });
      }
      const r = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        cache: "no-store",
      });
      const d = await r.json();
      if (d.code !== 0 || !d.data) {
        return NextResponse.json({ error: "Video tidak ditemukan atau privat." }, { status: 400 });
      }
      const v = d.data;
      return NextResponse.json({
        title: v.title || "tiktok-video",
        author: v.author?.unique_id || "",
        nickname: v.author?.nickname || "",
        cover: v.origin_cover || v.cover,
        video: v.hdplay || v.play,
        noWm: v.play,
        music: v.music,
        duration: v.duration,
        stats: {
          plays: v.play_count || 0,
          likes: v.digg_count || 0,
          comments: v.comment_count || 0,
          shares: v.share_count || 0,
        },
      });
    }

    /* ============ YOUTUBE ============ */
    if (action === "youtube") {
      const { url } = body;
      const m = String(url || "").match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
      if (!m) return NextResponse.json({ error: "URL YouTube tidak valid." }, { status: 400 });
      const vid = m[1];
      const thumbnail = `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;

      // Coba cobalt.tools
      const endpoints = [
        { u: "https://api.cobalt.tools/api/json", h: { "Content-Type": "application/json", Accept: "application/json" }, b: { url: `https://www.youtube.com/watch?v=${vid}`, vQuality: "720" } },
        { u: "https://co.wuk.sh/api/json", h: { "Content-Type": "application/json", Accept: "application/json" }, b: { url: `https://www.youtube.com/watch?v=${vid}`, vQuality: "720" } },
      ];

      for (const ep of endpoints) {
        try {
          const r = await fetch(ep.u, { method: "POST", headers: ep.h, body: JSON.stringify(ep.b), cache: "no-store" });
          if (r.ok) {
            const j = await r.json();
            if (j.url) {
              return NextResponse.json({
                videoId: vid,
                downloadUrl: j.url,
                title: j.filename || `YouTube ${vid}`,
                thumbnail,
                status: j.status,
              });
            }
          }
        } catch { continue; }
      }

      return NextResponse.json({
        error: "Server downloader sedang sibuk. Coba lagi beberapa saat.",
        videoId: vid,
        thumbnail,
      }, { status: 503 });
    }

    /* ============ INSTAGRAM (fallback) ============ */
    if (action === "instagram") {
      return NextResponse.json({
        error: "Instagram downloader memerlukan API berbayar. Gunakan TikTok Downloader yang gratis dan stabil.",
      }, { status: 503 });
    }

    /* ============ FACEBOOK (fallback) ============ */
    if (action === "facebook") {
      return NextResponse.json({
        error: "Facebook downloader memerlukan API berbayar. Gunakan TikTok Downloader yang gratis dan stabil.",
      }, { status: 503 });
    }

    /* ============ TEMP MAIL ============ */
    if (action === "tempmail-create") {
      const dr = await fetch("https://api.mail.tm/domains?page=1", { cache: "no-store" });
      const dd = await dr.json();
      const domains = dd["hydra:member"] || [];
      if (domains.length === 0) {
        return NextResponse.json({ error: "Domain temp mail tidak tersedia." }, { status: 500 });
      }
      const dom = domains[0].domain;
      const email = `${Math.random().toString(36).slice(2, 11)}${Date.now().toString(36).slice(-4)}@${dom}`;
      const pw = Math.random().toString(36).slice(2, 16);

      const cr = await fetch("https://api.mail.tm/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: email, password: pw }),
        cache: "no-store",
      });
      if (!cr.ok) {
        return NextResponse.json({ error: "Gagal membuat mailbox, coba lagi." }, { status: 400 });
      }

      const tr = await fetch("https://api.mail.tm/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: email, password: pw }),
        cache: "no-store",
      });
      const td = await tr.json();
      return NextResponse.json({ email, password: pw, token: td.token });
    }

    if (action === "tempmail-inbox") {
      const r = await fetch("https://api.mail.tm/messages?page=1", {
        headers: { Authorization: `Bearer ${body.token}` },
        cache: "no-store",
      });
      const j = await r.json();
      return NextResponse.json(j["hydra:member"] || []);
    }

    if (action === "tempmail-read") {
      const r = await fetch(`https://api.mail.tm/messages/${body.id}`, {
        headers: { Authorization: `Bearer ${body.token}` },
        cache: "no-store",
      });
      const j = await r.json();
      return NextResponse.json(j);
    }

    /* ============ IP LOOKUP ============ */
    if (action === "ip-lookup") {
      const target = body.ip ? `/${body.ip}` : "";
      const r = await fetch(`https://ipapi.co${target}/json/`, { cache: "no-store" });
      const j = await r.json();
      return NextResponse.json(j);
    }

    return NextResponse.json({ error: "Aksi tidak dikenal." }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "AllTool API" });
                                               }
