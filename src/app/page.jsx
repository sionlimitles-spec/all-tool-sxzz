"use client";

import { useState, useEffect, useMemo } from "react";
import * as I from "lucide-react";
import * as T from "@/lib/tools";

/* ============ REGISTRY ============ */
const TOOLS = [
  { id: "word-counter", n: "Word Counter", d: "Hitung kata, karakter, kalimat, dan paragraf.", c: "text", i: "Hash", f: T.WordCounter },
  { id: "case-converter", n: "Case Converter", d: "Ubah kapitalisasi teks dengan cepat.", c: "text", i: "Type", f: T.CaseConverter },
  { id: "lorem-ipsum", n: "Lorem Ipsum", d: "Generator teks dummy untuk desain.", c: "text", i: "FileText", f: T.LoremIpsum },
  { id: "text-diff", n: "Text Diff", d: "Bandingkan dua teks dan lihat perbedaan.", c: "text", i: "GitCompare", f: T.TextDiff },
  { id: "remove-duplicates", n: "Remove Duplicates", d: "Hapus baris duplikat dari daftar.", c: "text", i: "ListX", f: T.RemoveDuplicates },
  { id: "text-repeater", n: "Text Repeater", d: "Ulangi teks sebanyak yang diinginkan.", c: "text", i: "Repeat", f: T.TextRepeater },
  { id: "fancy-text", n: "Fancy Text", d: "Ubah teks jadi gaya unik untuk medsos.", c: "text", i: "Sparkles", f: T.FancyText },
  { id: "reverse-text", n: "Reverse Text", d: "Balik urutan karakter dalam teks.", c: "text", i: "ArrowLeftRight", f: T.ReverseText },

  { id: "json-formatter", n: "JSON Formatter", d: "Format, validasi, dan minify JSON.", c: "developer", i: "Braces", f: T.JsonFormatter },
  { id: "base64", n: "Base64 Encoder", d: "Encode dan decode teks Base64.", c: "developer", i: "Binary", f: T.Base64Tool },
  { id: "url-encoder", n: "URL Encoder", d: "Encode dan decode URL untuk web.", c: "developer", i: "Link", f: T.UrlEncoder },
  { id: "html-encoder", n: "HTML Encoder", d: "Encode karakter khusus HTML.", c: "developer", i: "Code", f: T.HtmlEncoder },
  { id: "jwt-decoder", n: "JWT Decoder", d: "Decode JSON Web Token dengan mudah.", c: "developer", i: "Key", f: T.JwtDecoder },
  { id: "hash-generator", n: "Hash Generator", d: "Buat hash MD5, SHA-1, SHA-256, SHA-512.", c: "developer", i: "Shield", f: T.HashGenerator },
  { id: "uuid-generator", n: "UUID Generator", d: "Buat UUID v4 secara acak.", c: "developer", i: "Fingerprint", f: T.UuidGenerator },
  { id: "regex-tester", n: "Regex Tester", d: "Uji ekspresi reguler secara langsung.", c: "developer", i: "Search", f: T.RegexTester },
  { id: "timestamp-converter", n: "Timestamp Converter", d: "Konversi Unix timestamp ke tanggal.", c: "developer", i: "Clock", f: T.TimestampConverter },
  { id: "qr-generator", n: "QR Code Generator", d: "Buat QR code dari teks atau URL.", c: "developer", i: "QrCode", f: T.QrGenerator },

  { id: "image-compressor", n: "Image Compressor", d: "Kompres gambar tanpa kehilangan kualitas.", c: "image", i: "Minimize", f: T.ImageCompressor },
  { id: "image-resizer", n: "Image Resizer", d: "Ubah ukuran gambar sesuai kebutuhan.", c: "image", i: "Maximize", f: T.ImageResizer },
  { id: "image-to-base64", n: "Image to Base64", d: "Konversi gambar jadi Base64 data URI.", c: "image", i: "Image", f: T.ImageToBase64 },
  { id: "image-converter", n: "Image Converter", d: "Konversi antar format gambar.", c: "image", i: "RefreshCw", f: T.ImageConverter },

  { id: "bmi-calculator", n: "BMI Calculator", d: "Hitung indeks massa tubuh Anda.", c: "calculator", i: "Activity", f: T.BmiCalculator },
  { id: "age-calculator", n: "Age Calculator", d: "Hitung umur dari tanggal lahir.", c: "calculator", i: "Calendar", f: T.AgeCalculator },
  { id: "percentage", n: "Percentage", d: "Hitung persentase dengan mudah.", c: "calculator", i: "Percent", f: T.Percentage },
  { id: "loan-calculator", n: "Loan Calculator", d: "Simulasi cicilan pinjaman.", c: "calculator", i: "Wallet", f: T.LoanCalculator },
  { id: "unit-converter", n: "Unit Converter", d: "Konversi satuan panjang, berat, suhu.", c: "calculator", i: "Scale", f: T.UnitConverter },

  { id: "password-generator", n: "Password Generator", d: "Buat password kuat dan aman.", c: "security", i: "Lock", f: T.PasswordGenerator },
  { id: "password-strength", n: "Password Strength", d: "Cek kekuatan password Anda.", c: "security", i: "ShieldCheck", f: T.PasswordStrength },

  { id: "downloader-tiktok", n: "TikTok Downloader", d: "Unduh TikTok tanpa watermark.", c: "media", i: "Music", f: T.TikTokDownloader },
  { id: "downloader-youtube", n: "YouTube Downloader", d: "Unduh video YouTube kualitas HD.", c: "media", i: "Youtube", f: T.YouTubeDownloader },
  { id: "downloader-instagram", n: "Instagram Downloader", d: "Unduh konten Instagram (beta).", c: "media", i: "Instagram", f: T.InstagramDownloader },
  { id: "downloader-facebook", n: "Facebook Downloader", d: "Unduh video Facebook (beta).", c: "media", i: "Facebook", f: T.FacebookDownloader },
  { id: "temp-mail", n: "Temp Mail", d: "Email sementara untuk verifikasi.", c: "media", i: "Mail", f: T.TempMail },
  { id: "ip-lookup", n: "IP Lookup", d: "Cek lokasi dan info alamat IP.", c: "media", i: "Globe", f: T.IpLookup },

  { id: "color-picker", n: "Color Picker", d: "Konversi HEX, RGB, HSL dengan mudah.", c: "utility", i: "Palette", f: T.ColorPicker },
  { id: "cron-parser", n: "Cron Parser", d: "Baca ekspresi cron jadi kalimat.", c: "utility", i: "Timer", f: T.CronParser },
  { id: "barcode-generator", n: "Barcode Generator", d: "Buat barcode dari teks atau angka.", c: "utility", i: "Barcode", f: T.BarcodeGenerator },
  { id: "text-to-speech", n: "Text to Speech", d: "Ubah teks jadi suara.", c: "utility", i: "Volume2", f: T.TextToSpeech },
  { id: "random-string", n: "Random String", d: "Buat string acak dengan pola khusus.", c: "utility", i: "Shuffle", f: T.RandomString },
];

const CATS = [
  { id: "all", n: "Semua" }, { id: "text", n: "Teks" }, { id: "developer", n: "Developer" },
  { id: "image", n: "Gambar" }, { id: "calculator", n: "Kalkulator" }, { id: "security", n: "Keamanan" },
  { id: "media", n: "Media" }, { id: "utility", n: "Utilitas" },
];

const LANGS = [
  ["id", "Indonesia"], ["en", "English"], ["ar", "العربية"], ["zh", "中文"], ["ja", "日本語"],
  ["ko", "한국어"], ["es", "Español"], ["fr", "Français"], ["de", "Deutsch"], ["it", "Italiano"],
  ["pt", "Português"], ["ru", "Русский"], ["hi", "हिन्दी"], ["th", "ไทย"], ["vi", "Tiếng Việt"],
  ["ms", "Bahasa Melayu"], ["tl", "Filipino"], ["tr", "Türkçe"], ["nl", "Nederlands"], ["pl", "Polski"],
  ["sv", "Svenska"], ["no", "Norsk"], ["da", "Dansk"], ["fi", "Suomi"], ["cs", "Čeština"],
  ["hu", "Magyar"], ["ro", "Română"], ["el", "Ελληνικά"], ["he", "עברית"], ["uk", "Українська"],
  ["fa", "فارسی"], ["bn", "বাংলা"], ["ta", "தமிழ்"], ["te", "తెలుగు"], ["mr", "मराठी"],
  ["gu", "ગુજરાતી"], ["ur", "اردو"], ["sw", "Kiswahili"], ["af", "Afrikaans"], ["sq", "Shqip"],
  ["hy", "Հայերեն"], ["ka", "ქართული"], ["az", "Azərbaycan"], ["kk", "Қазақша"], ["uz", "O'zbek"],
  ["mn", "Монгол"], ["km", "ខ្មែរ"], ["lo", "ລາວ"], ["my", "မြန်မာ"], ["ne", "नेपाली"],
];

const ACCENTS = ["violet", "blue", "emerald", "rose", "amber", "pink"];
const ACCENT_HEX = { violet: "#7c3aed", blue: "#2563eb", emerald: "#059669", rose: "#e11d48", amber: "#d97706", pink: "#db2777" };

const Icon = ({ name, size = 18, color }) => {
  const C = I[name] || I.Wrench;
  return <C size={size} color={color} />;
};

/* ============ APP ============ */
export default function App() {
  const [page, setPage] = useState("home");
  const [current, setCurrent] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const [palette, setPalette] = useState(false);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [mounted, setMounted] = useState(false);

  const [settings, setSettings] = useState({
    lang: "id", theme: "light", accent: "violet", fontSize: "medium", favorites: [],
  });

  // Load settings
  useEffect(() => {
    const s = localStorage.getItem("alltool-settings");
    if (s) { try { setSettings((prev) => ({ ...prev, ...JSON.parse(s) })); } catch {} }
    setMounted(true);
  }, []);

  // Apply settings
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("alltool-settings", JSON.stringify(settings));
    const r = document.documentElement;
    let eff = settings.theme;
    if (eff === "system") eff = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    r.setAttribute("data-theme", eff);
    r.setAttribute("data-accent", settings.accent);
    r.setAttribute("data-fontsize", settings.fontSize);
  }, [settings, mounted]);

  // Command palette shortcut
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setPalette(true); }
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
        e.preventDefault(); setPalette(true);
      }
      if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const openTool = (id) => {
    const tool = TOOLS.find((t) => t.id === id);
    if (tool) { setCurrent(tool); setPage("tool"); setSidebar(false); setPalette(false); window.scrollTo(0, 0); }
  };

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => (cat === "all" || t.c === cat) &&
      (!search || t.n.toLowerCase().includes(search.toLowerCase()) || t.d.toLowerCase().includes(search.toLowerCase())));
  }, [cat, search]);

  const favTools = useMemo(() => TOOLS.filter((t) => settings.favorites.includes(t.id)), [settings.favorites]);

  const toggleFav = (id) => {
    setSettings((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id],
    }));
  };

  return (
    <div className="bg-page">
      {/* OVERLAY MOBILE */}
      <div className={`overlay ${sidebar ? "on" : ""}`} onClick={() => setSidebar(false)} />

      {/* SIDEBAR */}
      <aside className={`side ${sidebar ? "on" : ""}`}>
        <button onClick={() => { setPage("home"); setCurrent(null); setSidebar(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", marginBottom: 16 }}>
          <div className="ic" style={{ background: "var(--p)", color: "#fff" }}>
            <I.Sparkles size={20} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div className="grad" style={{ fontSize: 17, fontWeight: 700 }}>AllTool</div>
            <div className="soft" style={{ fontWeight: 500 }}>v1.0 · {TOOLS.length} tools</div>
          </div>
        </button>

        <nav className="col" style={{ gap: 4 }}>
          <NavItem active={page === "home"} onClick={() => { setPage("home"); setCurrent(null); setSidebar(false); }} icon="Home" label="Beranda" />
          <NavItem active={page === "tools"} onClick={() => { setPage("tools"); setCurrent(null); setSidebar(false); }} icon="Wrench" label="Semua Tools" badge={TOOLS.length} />
          <NavItem active={page === "settings"} onClick={() => { setPage("settings"); setCurrent(null); setSidebar(false); }} icon="Settings" label="Pengaturan" />
          <NavItem active={page === "about"} onClick={() => { setPage("about"); setCurrent(null); setSidebar(false); }} icon="Info" label="Tentang" />
        </nav>

        {favTools.length > 0 && (
          <>
            <div style={{ marginTop: 20, marginBottom: 8, padding: "0 8px" }}>
              <div className="soft" style={{ fontWeight: 600, letterSpacing: "0.05em" }}>FAVORIT ({favTools.length})</div>
            </div>
            <div className="col" style={{ gap: 4 }}>
              {favTools.map((t) => (
                <NavItem key={t.id} active={current?.id === t.id} onClick={() => openTool(t.id)} icon={t.i} label={t.n} />
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <div className="card" style={{ background: "var(--ps)", border: "none", padding: 12, textAlign: "center" }}>
            <div className="soft" style={{ color: "var(--p)", fontWeight: 600 }}>Made with Next.js</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        {/* HEADER */}
        <header className="hdr">
          <button className="btn-g" style={{ display: "flex" }} onClick={() => setSidebar(!sidebar)} aria-label="Menu">
            <I.Menu size={20} />
          </button>
          <button
            onClick={() => setPalette(true)}
            style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", border: "1px solid var(--bd)", borderRadius: 10, background: "var(--card)", color: "var(--mut)", fontSize: 13, textAlign: "left", maxWidth: 420 }}
          >
            <I.Search size={15} />
            <span style={{ flex: 1 }}>Cari tools...</span>
            <kbd className="kbd">Ctrl K</kbd>
          </button>
          <div style={{ flex: 1 }} />
          <button className="btn-g" onClick={() => setSettings((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" }))} aria-label="Theme">
            <Icon name={settings.theme === "dark" ? "Sun" : "Moon"} size={20} />
          </button>
          <button className="btn-g" onClick={() => { setPage("settings"); setCurrent(null); }} aria-label="Settings">
            <I.Settings size={20} />
          </button>
        </header>

        <main style={{ padding: "24px 22px", maxWidth: 1200, margin: "0 auto" }}>
          {page === "home" && <HomePage filtered={filtered} cat={cat} setCat={setCat} search={search} setSearch={setSearch} openTool={openTool} favTools={favTools} toggleFav={toggleFav} favorites={settings.favorites} />}
          {page === "tools" && <ToolsPage filtered={filtered} cat={cat} setCat={setCat} search={search} setSearch={setSearch} openTool={openTool} favorites={settings.favorites} toggleFav={toggleFav} />}
          {page === "tool" && current && <ToolPage tool={current} onBack={() => setPage("tools")} isFav={settings.favorites.includes(current.id)} toggleFav={() => toggleFav(current.id)} />}
          {page === "settings" && <SettingsPage settings={settings} setSettings={setSettings} />}
          {page === "about" && <AboutPage />}
        </main>
      </div>

      {/* COMMAND PALETTE */}
      {palette && <Palette onClose={() => setPalette(false)} openTool={openTool} />}
    </div>
  );
}

/* ============ SUB COMPONENTS ============ */
function NavItem({ active, onClick, icon, label, badge }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500,
      background: active ? "var(--p)" : "transparent", color: active ? "#fff" : "var(--text)", transition: "all 0.15s", width: "100%", textAlign: "left",
    }}>
      <Icon name={icon} size={16} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && <span style={{ fontSize: 11, opacity: 0.7 }}>{badge}</span>}
    </button>
  );
}

function ToolCard({ tool, openTool, isFav, toggleFav }) {
  return (
    <div className="card card-int" style={{ position: "relative", padding: 16 }} onClick={() => openTool(tool.id)}>
      <div className="ic" style={{ marginBottom: 12 }}>
        <Icon name={tool.i} size={20} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{tool.n}</div>
      <div className="mut" style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5 }}>{tool.d}</div>
      <button
        onClick={(e) => { e.stopPropagation(); toggleFav(); }}
        className="btn-g"
        style={{ position: "absolute", top: 10, right: 10, padding: 6 }}
      >
        <I.Heart size={14} fill={isFav ? "var(--p)" : "none"} color={isFav ? "var(--p)" : "var(--soft)"} />
      </button>
    </div>
  );
}

function HomePage({ filtered, cat, setCat, search, setSearch, openTool, favTools, toggleFav, favorites }) {
  return (
    <>
      <section style={{ marginBottom: 32 }}>
        <div className="pill" style={{ marginBottom: 14 }}>
          <I.Sparkles size={12} /> {TOOLS.length} tools · 100% gratis
        </div>
        <h1 className="h1">
          <span className="grad">Semua Alat.</span>
          <br />
          Satu Tempat.
        </h1>
        <p className="sub">40+ tools gratis untuk developer, desainer, dan produktivitas harian. Unduh TikTok tanpa watermark, YouTube, dan banyak lagi.</p>
      </section>

      {favTools.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <div className="row" style={{ marginBottom: 14 }}>
            <I.Heart size={16} fill="var(--p)" color="var(--p)" />
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Favorit Anda</h2>
          </div>
          <div className="grid">
            {favTools.map((t) => <ToolCard key={t.id} tool={t} openTool={openTool} isFav={true} toggleFav={() => toggleFav(t.id)} />)}
          </div>
        </section>
      )}

      <section>
        <div className="row" style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>Semua Tools</h2>
        </div>
        <div className="row" style={{ marginBottom: 16 }}>
          {CATS.map((c) => (
            <button key={c.id} className={`chip ${cat === c.id ? "active" : ""}`} onClick={() => setCat(c.id)}>{c.n}</button>
          ))}
        </div>
        <div className="grid">
          {filtered.map((t) => <ToolCard key={t.id} tool={t} openTool={openTool} isFav={favorites.includes(t.id)} toggleFav={() => toggleFav(t.id)} />)}
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: "var(--mut)" }}>
            <I.SearchX size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <div>Tidak ada tools ditemukan</div>
          </div>
        )}
      </section>
    </>
  );
}

function ToolsPage({ filtered, cat, setCat, search, setSearch, openTool, favorites, toggleFav }) {
  return (
    <>
      <h1 className="h1" style={{ marginBottom: 6 }}><span className="grad">Semua Tools</span></h1>
      <p className="sub" style={{ marginBottom: 20 }}>{TOOLS.length} alat tersedia. Klik untuk membuka.</p>
      <div className="row" style={{ marginBottom: 16 }}>
        {CATS.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? "active" : ""}`} onClick={() => setCat(c.id)}>{c.n}</button>
        ))}
      </div>
      <div className="grid">
        {filtered.map((t) => <ToolCard key={t.id} tool={t} openTool={openTool} isFav={favorites.includes(t.id)} toggleFav={() => toggleFav(t.id)} />)}
      </div>
    </>
  );
}

function ToolPage({ tool, onBack, isFav, toggleFav }) {
  const Comp = tool.f;
  return (
    <div className="fade">
      <button className="btn btn-g" onClick={onBack} style={{ marginBottom: 14, marginLeft: -8 }}>
        <I.ArrowLeft size={16} />Kembali
      </button>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div className="ic" style={{ width: 54, height: 54 }}>
          <Icon name={tool.i} size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 className="h1" style={{ fontSize: 26 }}>{tool.n}</h1>
          <p className="sub">{tool.d}</p>
        </div>
        <button className="btn btn-s" onClick={toggleFav}>
          <I.Heart size={14} fill={isFav ? "var(--p)" : "none"} color={isFav ? "var(--p)" : "currentColor"} />
          {isFav ? "Favorit" : "Favoritkan"}
        </button>
      </div>
      <Comp />
    </div>
  );
}

function SettingsPage({ settings, setSettings }) {
  const set = (k) => (v) => setSettings((s) => ({ ...s, [k]: v }));
  const [searchLang, setSearchLang] = useState("");
  const filtered = LANGS.filter(([, n]) => n.toLowerCase().includes(searchLang.toLowerCase()));

  return (
    <>
      <h1 className="h1" style={{ marginBottom: 6 }}><span className="grad">Pengaturan</span></h1>
      <p className="sub" style={{ marginBottom: 24 }}>Sesuaikan tampilan, bahasa, dan preferensi aplikasi.</p>

      <div className="col" style={{ maxWidth: 720 }}>
        <div className="card">
          <div className="tag" style={{ marginBottom: 12 }}>TEMA</div>
          <div className="row">
            {["light", "dark", "system"].map((t) => (
              <button key={t} className={`chip ${settings.theme === t ? "active" : ""}`} onClick={() => set("theme")(t)}>
                <Icon name={t === "light" ? "Sun" : t === "dark" ? "Moon" : "Monitor"} size={13} />
                {t === "light" ? "Terang" : t === "dark" ? "Gelap" : "Sistem"}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="tag" style={{ marginBottom: 12 }}>WARNA AKSEN</div>
          <div className="row" style={{ gap: 12 }}>
            {ACCENTS.map((a) => (
              <button
                key={a}
                onClick={() => set("accent")(a)}
                style={{
                  width: 42, height: 42, borderRadius: "50%", background: ACCENT_HEX[a],
                  outline: settings.accent === a ? `3px solid ${ACCENT_HEX[a]}` : "none",
                  outlineOffset: 3, display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "transform 0.15s",
                }}
              >
                {settings.accent === a && <I.Check size={18} color="#fff" />}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="tag" style={{ marginBottom: 12 }}>UKURAN HURUF</div>
          <div className="row">
            {["small", "medium", "large"].map((f) => (
              <button key={f} className={`chip ${settings.fontSize === f ? "active" : ""}`} onClick={() => set("fontSize")(f)}>
                {f === "small" ? "Kecil" : f === "medium" ? "Sedang" : "Besar"}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="tag" style={{ marginBottom: 12 }}>BAHASA ({LANGS.length})</div>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <I.Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--mut)" }} />
            <input className="inp" style={{ paddingLeft: 34 }} value={searchLang} onChange={(e) => setSearchLang(e.target.value)} placeholder="Cari bahasa..." />
          </div>
          <div style={{ maxHeight: 280, overflowY: "auto", border: "1px solid var(--bd)", borderRadius: 10 }}>
            {filtered.map(([code, name]) => (
              <button
                key={code}
                onClick={() => set("lang")(code)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
                  padding: "10px 14px", fontSize: 13, background: settings.lang === code ? "var(--ps)" : "transparent",
                  color: settings.lang === code ? "var(--p)" : "var(--text)", borderBottom: "1px solid var(--bd)", textAlign: "left",
                }}
              >
                <span style={{ fontWeight: settings.lang === code ? 600 : 400 }}>{name}</span>
                {settings.lang === code && <I.Check size={14} />}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="tag" style={{ marginBottom: 8 }}>RESET DATA</div>
          <p className="mut" style={{ marginBottom: 12 }}>Hapus semua preferensi dan mulai dari awal.</p>
          <button className="btn btn-s" style={{ color: "#e11d48", borderColor: "#e11d48" }}
            onClick={() => { localStorage.clear(); setSettings({ lang: "id", theme: "light", accent: "violet", fontSize: "medium", favorites: [] }); }}>
            <I.Trash2 size={14} />Reset Semua Data
          </button>
        </div>
      </div>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <h1 className="h1" style={{ marginBottom: 6 }}><span className="grad">Tentang AllTool</span></h1>
      <p className="sub" style={{ marginBottom: 24 }}>Platform kumpulan alat serbaguna gratis untuk semua orang.</p>

      <div className="col" style={{ maxWidth: 720 }}>
        <div className="card">
          <p className="mut" style={{ lineHeight: 1.7 }}>
            AllTool adalah platform kumpulan alat serbaguna yang dapat digunakan secara gratis.
            Terdiri dari {TOOLS.length} alat yang mencakup teks, developer, gambar, kalkulator, keamanan, media, dan utilitas.
            Semua alat dirancang untuk cepat, bersih, tanpa iklan, dan tanpa gangguan.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {[
            { i: "Zap", t: "Cepat", d: "Semua alat dioptimalkan untuk performa maksimal." },
            { i: "Shield", t: "Aman", d: "Data Anda diproses di browser, tidak dikirim ke server." },
            { i: "Globe", t: "Multi Bahasa", d: "Tersedia dalam 50 bahasa dunia." },
            { i: "Sparkles", t: "Gratis", d: "Selamanya gratis tanpa iklan yang mengganggu." },
          ].map((f) => (
            <div key={f.t} className="card">
              <div className="ic" style={{ width: 40, height: 40 }}>
                <Icon name={f.i} size={18} />
              </div>
              <h3 style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>{f.t}</h3>
              <p className="mut" style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5 }}>{f.d}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ textAlign: "center", padding: 24 }}>
          <div className="soft" style={{ marginBottom: 6 }}>DIBUAT DENGAN</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Next.js · Vercel · Tailwind CSS · Lucide Icons</div>
          <div className="soft" style={{ marginTop: 6 }}>AllTool v1.0 · 2025</div>
        </div>
      </div>
    </>
  );
}

function Palette({ onClose, openTool }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const list = useMemo(() => {
    if (!q) return TOOLS.slice(0, 12);
    return TOOLS.filter((t) => t.n.toLowerCase().includes(q.toLowerCase()) || t.d.toLowerCase().includes(q.toLowerCase())).slice(0, 20);
  }, [q]);

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, list.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && list[sel]) { openTool(list[sel].id); onClose(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [list, sel, openTool, onClose]);

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--bd)" }}>
          <I.Search size={18} style={{ color: "var(--mut)" }} />
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari tools..."
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15 }}
          />
          <button className="btn-g" onClick={onClose}><I.X size={16} /></button>
        </div>
        <div style={{ maxHeight: "55vh", overflowY: "auto", padding: 8 }}>
          {list.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--mut)", fontSize: 13 }}>Tidak ditemukan</div>}
          {list.map((t, i) => (
            <button
              key={t.id} onClick={() => { openTool(t.id); onClose(); }} onMouseEnter={() => setSel(i)}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px", borderRadius: 10, background: sel === i ? "var(--ps)" : "transparent", textAlign: "left" }}
            >
              <div className="ic" style={{ width: 34, height: 34 }}>
                <Icon name={t.i} size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: sel === i ? "var(--p)" : "var(--text)" }}>{t.n}</div>
                <div className="mut" style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.d}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 18px", borderTop: "1px solid var(--bd)", fontSize: 11, color: "var(--soft)" }}>
          <span>Enter untuk buka</span><span>Esc untuk tutup</span>
        </div>
      </div>
    </div>
  );
   }
