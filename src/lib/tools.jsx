"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import * as I from "lucide-react";

export const copy = async (t) => {
  try { await navigator.clipboard.writeText(t); return true; }
  catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch { return false; }
  }
};

const fmt = (n) => !n ? "0" : n > 1e6 ? (n / 1e6).toFixed(1) + "M" : n > 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n);

const F = ({ label, ...p }) => (
  <div style={{ flex: 1, minWidth: 100 }}>
    <div className="tag" style={{ marginBottom: 5 }}>{label}</div>
    <input className="inp" {...p} />
  </div>
);

/* ============ TEXT TOOLS ============ */
export function WordCounter() {
  const [t, setT] = useState("");
  const w = t.trim() ? t.trim().split(/\s+/).length : 0;
  const s = t.split(/[.!?]+/).filter((x) => x.trim()).length;
  const p = t.split(/\n+/).filter((x) => x.trim()).length;
  const stats = [
    ["Kata", w], ["Karakter", t.length], ["Tanpa Spasi", t.replace(/\s/g, "").length],
    ["Kalimat", s], ["Paragraf", p], ["Menit Baca", Math.ceil(w / 200)],
  ];
  return (
    <div className="col">
      <textarea className="txa" rows={10} value={t} onChange={(e) => setT(e.target.value)} placeholder="Tulis atau tempel teks di sini..." />
      <div className="grid">
        {stats.map(([l, v]) => (
          <div key={l} className="card">
            <div className="stat">{v}</div>
            <div className="mut" style={{ marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-s" onClick={() => setT("")} style={{ alignSelf: "flex-start" }}>Bersihkan</button>
    </div>
  );
}

export function CaseConverter() {
  const [t, setT] = useState("");
  const ops = [
    ["UPPERCASE", (s) => s.toUpperCase()],
    ["lowercase", (s) => s.toLowerCase()],
    ["Title Case", (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())],
    ["Sentence", (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())],
    ["camelCase", (s) => s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase())],
    ["snake_case", (s) => s.trim().toLowerCase().replace(/\s+/g, "_")],
    ["kebab-case", (s) => s.trim().toLowerCase().replace(/\s+/g, "-")],
    ["aLtErNaTiNg", (s) => s.split("").map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("")],
  ];
  return (
    <div className="col">
      <textarea className="txa" rows={7} value={t} onChange={(e) => setT(e.target.value)} placeholder="Masukkan teks..." />
      <div className="row">
        {ops.map(([l, f]) => (
          <button key={l} className="btn btn-s" onClick={() => setT(f(t))}>{l}</button>
        ))}
        <button className="btn btn-p" onClick={() => copy(t)}><I.Copy size={14} />Copy</button>
      </div>
    </div>
  );
}

export function LoremIpsum() {
  const [n, setN] = useState(3);
  const [type, setType] = useState("paragraphs");
  const [out, setOut] = useState("");
  const W = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur".split(" ");
  const gen = () => {
    const r = () => W[Math.floor(Math.random() * W.length)];
    if (type === "words") return setOut(Array.from({ length: n }, r).join(" "));
    if (type === "sentences")
      return setOut(
        Array.from({ length: n }, () =>
          Array.from({ length: 10 + Math.floor(Math.random() * 8) }, r).join(" ").replace(/^\w/, (c) => c.toUpperCase()) + "."
        ).join(" ")
      );
    setOut(
      Array.from({ length: n }, () =>
        Array.from({ length: 4 + Math.floor(Math.random() * 3) }, () =>
          Array.from({ length: 10 + Math.floor(Math.random() * 6) }, r).join(" ").replace(/^\w/, (c) => c.toUpperCase()) + "."
        ).join(" ")
      ).join("\n\n")
    );
  };
  return (
    <div className="col">
      <div className="card">
        <div className="row">
          <div style={{ width: 100 }}>
            <div className="tag" style={{ marginBottom: 5 }}>Jumlah</div>
            <input type="number" className="inp" value={n} onChange={(e) => setN(+e.target.value)} min={1} max={50} />
          </div>
          <div style={{ width: 150 }}>
            <div className="tag" style={{ marginBottom: 5 }}>Tipe</div>
            <select className="inp" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="paragraphs">Paragraf</option>
              <option value="sentences">Kalimat</option>
              <option value="words">Kata</option>
            </select>
          </div>
          <button className="btn btn-p" onClick={gen} style={{ alignSelf: "flex-end" }}><I.RefreshCw size={14} />Generate</button>
          {out && <button className="btn btn-s" style={{ alignSelf: "flex-end" }} onClick={() => copy(out)}><I.Copy size={14} />Copy</button>}
        </div>
      </div>
      {out && <textarea className="txa" rows={12} value={out} readOnly />}
    </div>
  );
}

export function TextDiff() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const A = a.split("\n");
  const B = b.split("\n");
  const max = Math.max(A.length, B.length);
  return (
    <div className="col">
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <textarea className="txa" rows={8} value={a} onChange={(e) => setA(e.target.value)} placeholder="Teks pertama..." />
        <textarea className="txa" rows={8} value={b} onChange={(e) => setB(e.target.value)} placeholder="Teks kedua..." />
      </div>
      {(a || b) && (
        <div className="card" style={{ fontFamily: "monospace", fontSize: 12 }}>
          {Array.from({ length: max }, (_, i) => {
            const same = A[i] === B[i];
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "3px 0" }}>
                <span style={{ background: same ? "transparent" : "rgba(239,68,68,0.12)", color: same ? "var(--text)" : "#ef4444", padding: "3px 8px", borderRadius: 6 }}>{A[i] || " "}</span>
                <span style={{ background: same ? "transparent" : "rgba(34,197,94,0.12)", color: same ? "var(--text)" : "#22c55e", padding: "3px 8px", borderRadius: 6 }}>{B[i] || " "}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RemoveDuplicates() {
  const [t, setT] = useState("");
  const [out, setOut] = useState("");
  const [ci, setCi] = useState(true);
  const [sort, setSort] = useState(false);
  const go = () => {
    const seen = new Set();
    const r = [];
    for (const line of t.split("\n")) {
      const k = ci ? line : line.toLowerCase();
      if (!seen.has(k)) { seen.add(k); r.push(line); }
    }
    if (sort) r.sort();
    setOut(r.join("\n"));
  };
  const removed = t ? t.split("\n").length - (out ? out.split("\n").length : 0) : 0;
  return (
    <div className="col">
      <textarea className="txa" rows={8} value={t} onChange={(e) => setT(e.target.value)} placeholder="Satu item per baris..." />
      <div className="row">
        <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
          <input type="checkbox" checked={ci} onChange={(e) => setCi(e.target.checked)} />Case sensitive
        </label>
        <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
          <input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} />Urutkan
        </label>
        <button className="btn btn-p" onClick={go}>Proses</button>
        {out && <button className="btn btn-s" onClick={() => copy(out)}><I.Copy size={14} />Copy</button>}
      </div>
      {out && (
        <>
          <div className="mut">{removed} baris duplikat dihapus</div>
          <textarea className="txa" rows={8} value={out} readOnly />
        </>
      )}
    </div>
  );
}

export function TextRepeater() {
  const [t, setT] = useState("");
  const [n, setN] = useState(5);
  const [sep, setSep] = useState("\n");
  const [out, setOut] = useState("");
  return (
    <div className="col">
      <textarea className="txa" rows={4} value={t} onChange={(e) => setT(e.target.value)} placeholder="Teks yang akan diulang..." />
      <div className="row">
        <div style={{ width: 90 }}>
          <div className="tag" style={{ marginBottom: 5 }}>Jumlah</div>
          <input type="number" className="inp" value={n} onChange={(e) => setN(+e.target.value)} min={1} max={500} />
        </div>
        <div style={{ width: 150 }}>
          <div className="tag" style={{ marginBottom: 5 }}>Pemisah</div>
          <select className="inp" value={sep} onChange={(e) => setSep(e.target.value)}>
            <option value="\n">Baris baru</option>
            <option value=" ">Spasi</option>
            <option value=", ">Koma</option>
            <option value="">Tanpa</option>
          </select>
        </div>
        <button className="btn btn-p" style={{ alignSelf: "flex-end" }} onClick={() => setOut(Array.from({ length: n }, () => t).join(sep))}>Ulangi</button>
        {out && <button className="btn btn-s" style={{ alignSelf: "flex-end" }} onClick={() => copy(out)}><I.Copy size={14} />Copy</button>}
      </div>
      {out && <textarea className="txa" rows={8} value={out} readOnly />}
    </div>
  );
}

export function FancyText() {
  const [t, setT] = useState("Hello World");
  const [copied, setCopied] = useState("");
  const maps = [
    ["Bold", "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭", "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇"],
    ["Italic", "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡", "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻"],
    ["Script", "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵", "𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏"],
    ["Mono", "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉", "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣"],
    ["Circle", "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ", "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ"],
    ["Squared", "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉", "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"],
  ];
  const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const az = "abcdefghijklmnopqrstuvwxyz";
  const conv = (txt, up, lo) =>
    txt.split("").map((c) => {
      const i = AZ.indexOf(c);
      if (i >= 0) return up[i];
      const j = az.indexOf(c);
      if (j >= 0) return lo[j];
      return c;
    }).join("");
  const cp = async (v, n) => { if (await copy(v)) { setCopied(n); setTimeout(() => setCopied(""), 1500); } };
  return (
    <div className="col">
      <input className="inp" value={t} onChange={(e) => setT(e.target.value)} />
      {maps.map(([n, up, lo]) => (
        <div key={n} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="tag">{n}</div>
            <div style={{ fontSize: 16, marginTop: 4, wordBreak: "break-all" }}>{conv(t, up, lo)}</div>
          </div>
          <button className="btn btn-g" onClick={() => cp(conv(t, up, lo), n)}><I.Copy size={14} /></button>
        </div>
      ))}
      {copied && <div style={{ color: "#22c55e", fontSize: 12 }}>Tersalin: {copied}</div>}
    </div>
  );
}

export function ReverseText() {
  const [t, setT] = useState("");
  const [m, setM] = useState("chars");
  const [out, setOut] = useState("");
  const go = () =>
    m === "chars" ? setOut(t.split("").reverse().join(""))
    : m === "words" ? setOut(t.split(/\s+/).reverse().join(" "))
    : setOut(t.split("\n").reverse().join("\n"));
  return (
    <div className="col">
      <textarea className="txa" rows={5} value={t} onChange={(e) => setT(e.target.value)} />
      <div className="row">
        {[["chars", "Karakter"], ["words", "Kata"], ["lines", "Baris"]].map(([k, l]) => (
          <button key={k} className={`chip ${m === k ? "active" : ""}`} onClick={() => setM(k)}>{l}</button>
        ))}
        <button className="btn btn-p" onClick={go}>Balik</button>
        {out && <button className="btn btn-s" onClick={() => copy(out)}><I.Copy size={14} />Copy</button>}
      </div>
      {out && <textarea className="txa" rows={5} value={out} readOnly />}
    </div>
  );
}

/* ============ DEVELOPER TOOLS ============ */
export function JsonFormatter() {
  const [i, setI] = useState("");
  const [o, setO] = useState("");
  const [e, setE] = useState("");
  const [copied, setCopied] = useState(false);
  const fmt2 = (min) => {
    try { const p = JSON.parse(i); setO(min ? JSON.stringify(p) : JSON.stringify(p, null, 2)); setE(""); }
    catch (err) { setE(err.message); setO(""); }
  };
  const cp = async () => { if (await copy(o)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };
  return (
    <div className="col">
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <div className="tag" style={{ marginBottom: 5 }}>INPUT</div>
          <textarea className="txa" rows={14} value={i} onChange={(e) => setI(e.target.value)} placeholder='{"name":"value"}' />
        </div>
        <div>
          <div className="tag" style={{ marginBottom: 5 }}>OUTPUT</div>
          <textarea className="txa" rows={14} value={o} readOnly />
        </div>
      </div>
      <div className="row">
        <button className="btn btn-p" onClick={() => fmt2(false)}><I.Maximize2 size={14} />Format</button>
        <button className="btn btn-s" onClick={() => fmt2(true)}><I.Minimize2 size={14} />Minify</button>
        {o && <button className="btn btn-s" onClick={cp}><I.Copy size={14} />{copied ? "Tersalin!" : "Copy"}</button>}
      </div>
      {e && <div style={{ padding: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#ef4444", fontSize: 13 }}>{e}</div>}
    </div>
  );
}

export function Base64Tool() {
  const [i, setI] = useState("");
  const [o, setO] = useState("");
  const [m, setM] = useState("encode");
  const go = () => {
    try { setO(m === "encode" ? btoa(unescape(encodeURIComponent(i))) : decodeURIComponent(escape(atob(i)))); }
    catch { setO("Input tidak valid"); }
  };
  return (
    <div className="col">
      <div className="row">
        {["encode", "decode"].map((x) => (
          <button key={x} className={`chip ${m === x ? "active" : ""}`} onClick={() => setM(x)}>{x === "encode" ? "Encode" : "Decode"}</button>
        ))}
      </div>
      <textarea className="txa" rows={6} value={i} onChange={(e) => setI(e.target.value)} />
      <div className="row">
        <button className="btn btn-p" onClick={go}>{m === "encode" ? "Encode" : "Decode"}</button>
        {o && <button className="btn btn-s" onClick={() => copy(o)}><I.Copy size={14} />Copy</button>}
      </div>
      {o && <textarea className="txa" rows={6} value={o} readOnly />}
    </div>
  );
}

export function UrlEncoder() {
  const [i, setI] = useState("");
  const [o, setO] = useState("");
  return (
    <div className="col">
      <textarea className="txa" rows={4} value={i} onChange={(e) => setI(e.target.value)} placeholder="https://example.com/?q=hello world" />
      <div className="row">
        <button className="btn btn-p" onClick={() => setO(encodeURIComponent(i))}>Encode</button>
        <button className="btn btn-s" onClick={() => setO(decodeURIComponent(i))}>Decode</button>
        <button className="btn btn-s" onClick={() => setO(encodeURI(i))}>Encode URI</button>
        {o && <button className="btn btn-s" onClick={() => copy(o)}><I.Copy size={14} />Copy</button>}
      </div>
      {o && <textarea className="txa" rows={4} value={o} readOnly />}
    </div>
  );
}

export function HtmlEncoder() {
  const [i, setI] = useState("");
  const [o, setO] = useState("");
  const enc = () => setO(i.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"));
  const dec = () => { const el = document.createElement("textarea"); el.innerHTML = i; setO(el.value); };
  return (
    <div className="col">
      <textarea className="txa" rows={5} value={i} onChange={(e) => setI(e.target.value)} placeholder="<div>Hello</div>" />
      <div className="row">
        <button className="btn btn-p" onClick={enc}>Encode</button>
        <button className="btn btn-s" onClick={dec}>Decode</button>
        {o && <button className="btn btn-s" onClick={() => copy(o)}><I.Copy size={14} />Copy</button>}
      </div>
      {o && <textarea className="txa" rows={5} value={o} readOnly />}
    </div>
  );
}

export function JwtDecoder() {
  const [t, setT] = useState("");
  const [h, setH] = useState("");
  const [p, setP] = useState("");
  const [e, setE] = useState("");
  const go = () => {
    try {
      const parts = t.split(".");
      if (parts.length < 2) throw new Error("Format JWT tidak valid");
      const d = (x) => JSON.parse(atob(x.replace(/-/g, "+").replace(/_/g, "/")));
      setH(JSON.stringify(d(parts[0]), null, 2));
      setP(JSON.stringify(d(parts[1]), null, 2));
      setE("");
    } catch (err) { setE(err.message); setH(""); setP(""); }
  };
  return (
    <div className="col">
      <textarea className="txa" rows={3} value={t} onChange={(e) => setT(e.target.value)} placeholder="eyJhbGciOi..." />
      <button className="btn btn-p" style={{ alignSelf: "flex-start" }} onClick={go}>Decode</button>
      {e && <div style={{ padding: 12, background: "rgba(239,68,68,0.1)", borderRadius: 10, color: "#ef4444", fontSize: 13 }}>{e}</div>}
      {h && (
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>HEADER</div>
            <textarea className="txa" rows={10} value={h} readOnly />
          </div>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>PAYLOAD</div>
            <textarea className="txa" rows={10} value={p} readOnly />
          </div>
        </div>
      )}
    </div>
  );
}

export function HashGenerator() {
  const [i, setI] = useState("");
  const [list, setList] = useState([]);
  const sha = async (algo, txt) => {
    const b = await crypto.subtle.digest(algo, new TextEncoder().encode(txt));
    return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
  };
  const md5 = (s) => {
    function cmn(q, a, b, x, ss, t) { a = ((a + q) | 0) + ((x + t) | 0) | 0; return (((a << ss) | (a >>> (32 - ss))) + b) | 0; }
    function ff(a, b, c, d, x, ss, t) { return cmn((b & c) | (~b & d), a, b, x, ss, t); }
    function gg(a, b, c, d, x, ss, t) { return cmn((b & d) | (c & ~d), a, b, x, ss, t); }
    function hh(a, b, c, d, x, ss, t) { return cmn(b ^ c ^ d, a, b, x, ss, t); }
    function ii(a, b, c, d, x, ss, t) { return cmn(c ^ (b | ~d), a, b, x, ss, t); }
    function cy(x, k) {
      let a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586); c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426); c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417); c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101); c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632); c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083); c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690); c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784); c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463); c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353); c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222); c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835); c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415); c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606); c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744); c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379); c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = (a + x[0]) | 0; x[1] = (b + x[1]) | 0; x[2] = (c + x[2]) | 0; x[3] = (d + x[3]) | 0;
    }
    function blk(s) { const m = []; for (let i = 0; i < 64; i += 4) m[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24); return m; }
    function rh(n) { const h = "0123456789abcdef"; let s = ""; for (let j = 0; j < 4; j++) s += h.charAt((n >> (j * 8 + 4)) & 15) + h.charAt((n >> (j * 8)) & 15); return s; }
    let N = s.length, i; const st = [1732584193, -271733879, -1732584194, 271733878];
    for (i = 64; i <= N; i += 64) cy(st, blk(s.substring(i - 64, i)));
    s = s.substring(i - 64); const tl = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) tl[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tl[i >> 2] |= 128 << ((i % 4) << 3);
    if (i > 55) { cy(st, tl); for (i = 0; i < 16; i++) tl[i] = 0; }
    tl[14] = N * 8; cy(st, tl);
    return st.map(rh).join("");
  };
  const go = async () => {
    if (!i) return;
    const [a, b, c] = await Promise.all([sha("SHA-1", i), sha("SHA-256", i), sha("SHA-512", i)]);
    setList([["MD5", md5(i)], ["SHA-1", a], ["SHA-256", b], ["SHA-512", c]]);
  };
  return (
    <div className="col">
      <textarea className="txa" rows={3} value={i} onChange={(e) => setI(e.target.value)} placeholder="Teks yang akan di-hash..." />
      <button className="btn btn-p" style={{ alignSelf: "flex-start" }} onClick={go}>Generate Hash</button>
      <div className="col">
        {list.map(([n, v]) => (
          <div key={n} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="tag">{n}</span>
              <button className="btn btn-g" onClick={() => copy(v)}><I.Copy size={14} /></button>
            </div>
            <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 11, wordBreak: "break-all", lineHeight: 1.5 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UuidGenerator() {
  const [n, setN] = useState(5);
  const [up, setUp] = useState(false);
  const [nd, setNd] = useState(false);
  const [list, setList] = useState([]);
  const go = () => {
    const a = [];
    for (let i = 0; i < n; i++) {
      let u = crypto.randomUUID();
      if (nd) u = u.replace(/-/g, "");
      if (up) u = u.toUpperCase();
      a.push(u);
    }
    setList(a);
  };
  return (
    <div className="col">
      <div className="card">
        <div className="row">
          <div style={{ width: 100 }}>
            <div className="tag" style={{ marginBottom: 5 }}>Jumlah</div>
            <input type="number" className="inp" value={n} onChange={(e) => setN(+e.target.value)} min={1} max={100} />
          </div>
          <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, alignSelf: "flex-end" }}>
            <input type="checkbox" checked={up} onChange={(e) => setUp(e.target.checked)} />Uppercase
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, alignSelf: "flex-end" }}>
            <input type="checkbox" checked={nd} onChange={(e) => setNd(e.target.checked)} />Tanpa tanda hubung
          </label>
          <button className="btn btn-p" style={{ alignSelf: "flex-end" }} onClick={go}><I.RefreshCw size={14} />Generate</button>
          {list.length > 0 && <button className="btn btn-s" style={{ alignSelf: "flex-end" }} onClick={() => copy(list.join("\n"))}><I.Copy size={14} />Semua</button>}
        </div>
      </div>
      <div className="col">
        {list.map((u, i) => (
          <div key={i} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "monospace", fontSize: 12, wordBreak: "break-all", flex: 1 }}>{u}</span>
            <button className="btn btn-g" onClick={() => copy(u)}><I.Copy size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegexTester() {
  const [p, setP] = useState("");
  const [f, setF] = useState("g");
  const [t, setT] = useState("");
  const { matches, err, hl } = useMemo(() => {
    if (!p) return { matches: [], err: "", hl: t };
    try {
      const re = new RegExp(p, f);
      const m = t.match(re);
      const re2 = new RegExp(p, f.includes("g") ? f : f + "g");
      const hl = t.replace(re2, (x) => `<mark style="background:var(--p);color:#fff;border-radius:4px;padding:1px 3px">${x}</mark>`);
      return { matches: m ? Array.from(m) : [], err: "", hl };
    } catch (e) { return { matches: [], err: e.message, hl: t }; }
  }, [p, f, t]);
  return (
    <div className="col">
      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div>
          <div className="tag" style={{ marginBottom: 5 }}>PATTERN</div>
          <input className="inp" style={{ fontFamily: "monospace" }} value={p} onChange={(e) => setP(e.target.value)} placeholder="\d+" />
        </div>
        <div>
          <div className="tag" style={{ marginBottom: 5 }}>FLAGS</div>
          <input className="inp" style={{ fontFamily: "monospace" }} value={f} onChange={(e) => setF(e.target.value)} placeholder="g" />
        </div>
      </div>
      <textarea className="txa" rows={6} value={t} onChange={(e) => setT(e.target.value)} placeholder="Teks untuk diuji..." />
      {err && <div style={{ padding: 12, background: "rgba(239,68,68,0.1)", borderRadius: 10, color: "#ef4444", fontSize: 13 }}>{err}</div>}
      {p && !err && (
        <div className="card">
          <div className="tag">HIGHLIGHT ({matches.length} MATCH)</div>
          <div style={{ marginTop: 8, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 13, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: hl }} />
          {matches.length > 0 && (
            <div className="row" style={{ marginTop: 10 }}>
              {matches.map((m, i) => (
                <span key={i} style={{ padding: "3px 9px", borderRadius: 6, background: "var(--ps)", color: "var(--p)", fontFamily: "monospace", fontSize: 11 }}>{m}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TimestampConverter() {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [dt, setDt] = useState(new Date().toISOString().slice(0, 16));
  const toDate = () => { const n = +ts; const d = new Date(n < 1e12 ? n * 1000 : n); return isNaN(d) ? "Invalid" : d.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "long" }); };
  const toTs = () => Math.floor(new Date(dt).getTime() / 1000);
  return (
    <div className="col">
      <div className="card">
        <div className="tag" style={{ marginBottom: 8 }}>TIMESTAMP → TANGGAL</div>
        <input className="inp" style={{ fontFamily: "monospace" }} value={ts} onChange={(e) => setTs(e.target.value)} />
        <div style={{ marginTop: 10, padding: 12, background: "var(--ps)", borderRadius: 10, fontFamily: "monospace", fontSize: 13 }}>{toDate()}</div>
        <button className="btn btn-s" style={{ marginTop: 8 }} onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>Sekarang</button>
      </div>
      <div className="card">
        <div className="tag" style={{ marginBottom: 8 }}>TANGGAL → TIMESTAMP</div>
        <input type="datetime-local" className="inp" value={dt} onChange={(e) => setDt(e.target.value)} />
        <div style={{ marginTop: 10, padding: 12, background: "var(--ps)", borderRadius: 10, fontFamily: "monospace", fontSize: 13 }}>{toTs()}</div>
      </div>
    </div>
  );
}

export function QrGenerator() {
  const [t, setT] = useState("");
  const [s, setS] = useState(300);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const url = t ? `https://api.qrserver.com/v1/create-qr-code/?size=${s}x${s}&data=${encodeURIComponent(t)}&color=${fg.slice(1)}&bgcolor=${bg.slice(1)}` : "";
  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div className="card">
        <div className="tag" style={{ marginBottom: 8 }}>TEKS / URL</div>
        <textarea className="txa" rows={4} value={t} onChange={(e) => setT(e.target.value)} placeholder="https://example.com" />
        <div className="mut" style={{ marginTop: 10 }}>Ukuran: {s}px</div>
        <input type="range" min={100} max={600} step={50} value={s} onChange={(e) => setS(+e.target.value)} style={{ width: "100%", accentColor: "var(--p)" }} />
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 10 }}>
          <div>
            <div className="soft">WARNA QR</div>
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} style={{ width: "100%", height: 40, border: "none", borderRadius: 8, marginTop: 4 }} />
          </div>
          <div>
            <div className="soft">BACKGROUND</div>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} style={{ width: "100%", height: 40, border: "none", borderRadius: 8, marginTop: 4 }} />
          </div>
        </div>
      </div>
      <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {url ? (
          <>
            <img src={url} alt="QR" style={{ borderRadius: 12 }} />
            <a className="btn btn-p" style={{ marginTop: 12 }} href={url} download="qrcode.png"><I.Download size={14} />Unduh</a>
          </>
        ) : (
          <div className="mut" style={{ textAlign: "center" }}>
            <I.QrCode size={44} style={{ opacity: 0.3, margin: "0 auto 8px" }} />
            <div>QR code akan muncul di sini</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ IMAGE TOOLS ============ */
export function ImageCompressor() {
  const [f, setF] = useState(null);
  const [q, setQ] = useState(0.7);
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(false);
  const go = async () => {
    if (!f) return;
    setLoading(true);
    const img = new Image();
    img.src = URL.createObjectURL(f);
    await new Promise((x) => { img.onload = x; });
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    c.getContext("2d").drawImage(img, 0, 0);
    c.toBlob((b) => { if (b) setR({ url: URL.createObjectURL(b), size: b.size }); setLoading(false); }, "image/jpeg", q);
  };
  const dl = async () => {
    const res = await fetch(r.url);
    const b = await res.blob();
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u; a.download = "compressed.jpg"; a.click();
  };
  return (
    <div className="col">
      <input type="file" className="inp" accept="image/*" onChange={(e) => { setF(e.target.files?.[0] || null); setR(null); }} />
      {f && (
        <div className="card">
          <div className="mut">Ukuran asli: {(f.size / 1024).toFixed(1)} KB</div>
          <div className="tag" style={{ marginTop: 10 }}>KUALITAS: {Math.round(q * 100)}%</div>
          <input type="range" min={0.1} max={1} step={0.05} value={q} onChange={(e) => setQ(+e.target.value)} style={{ width: "100%", accentColor: "var(--p)", marginTop: 4 }} />
          <button className="btn btn-p" style={{ marginTop: 12 }} disabled={loading} onClick={go}>{loading ? "Memproses..." : "Kompres"}</button>
        </div>
      )}
      {r && (
        <div className="card">
          <div className="mut">Baru: {(r.size / 1024).toFixed(1)} KB ({Math.round((1 - r.size / f.size) * 100)}% lebih kecil)</div>
          <img src={r.url} style={{ marginTop: 12, maxHeight: 250, borderRadius: 12, objectFit: "contain" }} />
          <button className="btn btn-p" style={{ marginTop: 12 }} onClick={dl}><I.Download size={14} />Unduh</button>
        </div>
      )}
    </div>
  );
}

export function ImageResizer() {
  const [f, setF] = useState(null);
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [ratio, setRatio] = useState(1);
  const [keep, setKeep] = useState(true);
  const [r, setR] = useState("");
  const hf = (file) => {
    setF(file); setR("");
    const img = new Image();
    img.onload = () => { setRatio(img.width / img.height); setW(img.width); setH(img.height); };
    img.src = URL.createObjectURL(file);
  };
  const go = async () => {
    const img = new Image();
    img.src = URL.createObjectURL(f);
    await new Promise((x) => { img.onload = x; });
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    setR(c.toDataURL("image/png"));
  };
  return (
    <div className="col">
      <input type="file" className="inp" accept="image/*" onChange={(e) => e.target.files?.[0] && hf(e.target.files[0])} />
      {f && (
        <div className="card">
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <div className="tag" style={{ marginBottom: 5 }}>LEBAR</div>
              <input type="number" className="inp" value={w} onChange={(e) => { const v = +e.target.value; setW(v); if (keep) setH(Math.round(v / ratio)); }} />
            </div>
            <div>
              <div className="tag" style={{ marginBottom: 5 }}>TINGGI</div>
              <input type="number" className="inp" value={h} onChange={(e) => { const v = +e.target.value; setH(v); if (keep) setW(Math.round(v * ratio)); }} />
            </div>
          </div>
          <label style={{ display: "flex", gap: 6, marginTop: 10, fontSize: 13, alignItems: "center" }}>
            <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} />Jaga rasio aspek
          </label>
          <button className="btn btn-p" style={{ marginTop: 12 }} onClick={go}>Ubah Ukuran</button>
        </div>
      )}
      {r && (
        <div className="card">
          <img src={r} style={{ maxHeight: 250, borderRadius: 12 }} />
          <a className="btn btn-p" style={{ marginTop: 12, display: "inline-flex" }} href={r} download="resized.png"><I.Download size={14} />Unduh</a>
        </div>
      )}
    </div>
  );
}

export function ImageToBase64() {
  const [d, setD] = useState("");
  const [copied, setCopied] = useState(false);
  const hf = (f) => { const r = new FileReader(); r.onload = () => setD(String(r.result)); r.readAsDataURL(f); };
  const cp = async () => { if (await copy(d)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };
  return (
    <div className="col">
      <input type="file" className="inp" accept="image/*" onChange={(e) => e.target.files?.[0] && hf(e.target.files[0])} />
      {d && (
        <>
          <img src={d} style={{ maxHeight: 200, borderRadius: 12, objectFit: "contain" }} />
          <button className="btn btn-p" style={{ alignSelf: "flex-start" }} onClick={cp}><I.Copy size={14} />{copied ? "Tersalin!" : "Salin Data URI"}</button>
          <textarea className="txa" rows={6} value={d} readOnly />
        </>
      )}
    </div>
  );
}

export function ImageConverter() {
  const [f, setF] = useState(null);
  const [fmt, setFmt] = useState("image/png");
  const [r, setR] = useState("");
  const go = async () => {
    const img = new Image();
    img.src = URL.createObjectURL(f);
    await new Promise((x) => { img.onload = x; });
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d");
    if (fmt === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.drawImage(img, 0, 0);
    setR(c.toDataURL(fmt));
  };
  return (
    <div className="col">
      <input type="file" className="inp" accept="image/*" onChange={(e) => { setF(e.target.files?.[0] || null); setR(""); }} />
      {f && (
        <div className="card">
          <div className="tag" style={{ marginBottom: 5 }}>FORMAT TUJUAN</div>
          <select className="inp" value={fmt} onChange={(e) => setFmt(e.target.value)}>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
          <button className="btn btn-p" style={{ marginTop: 12 }} onClick={go}>Konversi</button>
        </div>
      )}
      {r && (
        <div className="card">
          <img src={r} style={{ maxHeight: 200, borderRadius: 12 }} />
          <a className="btn btn-p" style={{ marginTop: 12, display: "inline-flex" }} href={r} download={`converted.${fmt.split("/")[1]}`}><I.Download size={14} />Unduh</a>
        </div>
      )}
    </div>
  );
}

/* ============ CALCULATORS ============ */
export function BmiCalculator() {
  const [w, setW] = useState(60);
  const [h, setH] = useState(170);
  const bmi = w / Math.pow(h / 100, 2);
  const cat = bmi < 18.5 ? "Kurus" : bmi < 25 ? "Normal" : bmi < 30 ? "Gemuk" : "Obesitas";
  const c = bmi < 18.5 ? "#3b82f6" : bmi < 25 ? "#22c55e" : bmi < 30 ? "#f59e0b" : "#ef4444";
  return (
    <div className="col">
      <div className="card">
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>BERAT (KG)</div>
            <input type="number" className="inp" value={w} onChange={(e) => setW(+e.target.value)} />
          </div>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>TINGGI (CM)</div>
            <input type="number" className="inp" value={h} onChange={(e) => setH(+e.target.value)} />
          </div>
        </div>
      </div>
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 52, fontWeight: 700, color: c, letterSpacing: "-0.02em" }}>{bmi.toFixed(1)}</div>
        <div style={{ marginTop: 6, color: c, fontWeight: 600, fontSize: 16 }}>{cat}</div>
        <div className="mut" style={{ marginTop: 16 }}>Normal: 18.5 – 24.9 · Gemuk: 25 – 29.9 · Obesitas: 30+</div>
      </div>
    </div>
  );
}

export function AgeCalculator() {
  const [b, setB] = useState("2000-01-01");
  const calc = () => {
    const bd = new Date(b), n = new Date();
    if (isNaN(bd)) return null;
    let y = n.getFullYear() - bd.getFullYear(), m = n.getMonth() - bd.getMonth(), d = n.getDate() - bd.getDate();
    if (d < 0) { m--; d += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const td = Math.floor((n - bd) / 86400000);
    return { y, m, d, td, tw: Math.floor(td / 7), th: td * 24 };
  };
  const r = calc();
  return (
    <div className="col">
      <div className="card">
        <div className="tag" style={{ marginBottom: 5 }}>TANGGAL LAHIR</div>
        <input type="date" className="inp" value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      {r && (
        <div className="grid">
          {[["Tahun", r.y], ["Bulan", r.m], ["Hari", r.d], ["Total Hari", r.td.toLocaleString("id-ID")], ["Total Minggu", r.tw.toLocaleString("id-ID")], ["Total Jam", r.th.toLocaleString("id-ID")]].map(([l, v]) => (
            <div key={l} className="card">
              <div className="stat">{v}</div>
              <div className="mut" style={{ marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Percentage() {
  const [a, setA] = useState(10);
  const [b, setB] = useState(200);
  return (
    <div className="col">
      <div className="card">
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>NILAI A</div>
            <input type="number" className="inp" value={a} onChange={(e) => setA(+e.target.value)} />
          </div>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>NILAI B</div>
            <input type="number" className="inp" value={b} onChange={(e) => setB(+e.target.value)} />
          </div>
        </div>
      </div>
      {[[`${a}% dari ${b}`, ((a / 100) * b).toFixed(2)], [`${a} adalah berapa % dari ${b}`, ((a / b) * 100).toFixed(2) + "%"], [`Perubahan ${a} → ${b}`, (((b - a) / a) * 100).toFixed(2) + "%"]].map(([l, v]) => (
        <div key={l} className="card">
          <div className="mut">{l}</div>
          <div className="stat" style={{ marginTop: 4, fontSize: 26 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

export function LoanCalculator() {
  const [amt, setAmt] = useState(10000000);
  const [rate, setRate] = useState(10);
  const [y, setY] = useState(3);
  const mr = rate / 100 / 12, mn = y * 12;
  const monthly = mr === 0 ? amt / mn : (amt * mr) / (1 - Math.pow(1 + mr, -mn));
  const total = monthly * mn, interest = total - amt;
  const f = (n) => "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
  return (
    <div className="col">
      <div className="card">
        <div className="tag" style={{ marginBottom: 5 }}>JUMLAH PINJAMAN (Rp)</div>
        <input type="number" className="inp" value={amt} onChange={(e) => setAmt(+e.target.value)} />
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>BUNGA / TAHUN (%)</div>
            <input type="number" step={0.1} className="inp" value={rate} onChange={(e) => setRate(+e.target.value)} />
          </div>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>TENOR (TAHUN)</div>
            <input type="number" className="inp" value={y} onChange={(e) => setY(+e.target.value)} />
          </div>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {[["Cicilan / Bulan", f(monthly)], ["Total Bayar", f(total)], ["Total Bunga", f(interest)]].map(([l, v]) => (
          <div key={l} className="card">
            <div className="mut">{l}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--p)", marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UnitConverter() {
  const [c, setC] = useState("panjang");
  const [v, setV] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);
  const U = {
    panjang: [["Meter", 1], ["Kilometer", 1000], ["Centimeter", 0.01], ["Millimeter", 0.001], ["Inch", 0.0254], ["Foot", 0.3048], ["Yard", 0.9144], ["Mile", 1609.344]],
    berat: [["Kilogram", 1], ["Gram", 0.001], ["Milligram", 1e-6], ["Pound", 0.453592], ["Ounce", 0.0283495], ["Ton", 1000]],
    suhu: [["Celsius", 1], ["Fahrenheit", 1], ["Kelvin", 1]],
  };
  const convert = () => {
    if (c === "suhu") {
      const n = U.suhu.map((x) => x[0]), f = n[from], t = n[to];
      let cl = v;
      if (f === "Fahrenheit") cl = (v - 32) * 5 / 9;
      if (f === "Kelvin") cl = v - 273.15;
      if (t === "Celsius") return cl;
      if (t === "Fahrenheit") return cl * 9 / 5 + 32;
      if (t === "Kelvin") return cl + 273.15;
      return cl;
    }
    const u = U[c];
    return (v * u[from][1]) / u[to][1];
  };
  return (
    <div className="col">
      <div className="row">
        {["panjang", "berat", "suhu"].map((x) => (
          <button key={x} className={`chip ${c === x ? "active" : ""}`} onClick={() => { setC(x); setFrom(0); setTo(1); }}>
            {x[0].toUpperCase() + x.slice(1)}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>NILAI</div>
            <input type="number" className="inp" value={v} onChange={(e) => setV(+e.target.value)} />
          </div>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>DARI</div>
            <select className="inp" value={from} onChange={(e) => setFrom(+e.target.value)}>
              {U[c].map((u, i) => <option key={u[0]} value={i}>{u[0]}</option>)}
            </select>
          </div>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>KE</div>
            <select className="inp" value={to} onChange={(e) => setTo(+e.target.value)}>
              {U[c].map((u, i) => <option key={u[0]} value={i}>{u[0]}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="card" style={{ textAlign: "center", padding: 26 }}>
        <div className="mut">{v} {U[c][from][0]} =</div>
        <div className="stat" style={{ fontSize: 30, marginTop: 8 }}>{convert().toLocaleString("id-ID", { maximumFractionDigits: 6 })}</div>
        <div className="mut" style={{ marginTop: 4 }}>{U[c][to][0]}</div>
      </div>
    </div>
  );
}

/* ============ SECURITY ============ */
export function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [up, setUp] = useState(true);
  const [lo, setLo] = useState(true);
  const [num, setNum] = useState(true);
  const [sym, setSym] = useState(true);
  const [pw, setPw] = useState("");
  const [copied, setCopied] = useState(false);
  const gen = useCallback(() => {
    let ch = "";
    if (up) ch += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lo) ch += "abcdefghijklmnopqrstuvwxyz";
    if (num) ch += "0123456789";
    if (sym) ch += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!ch) ch = "abcdefghijklmnopqrstuvwxyz";
    const a = new Uint32Array(len);
    crypto.getRandomValues(a);
    let s = "";
    for (let i = 0; i < len; i++) s += ch[a[i] % ch.length];
    setPw(s);
  }, [len, up, lo, num, sym]);
  useEffect(() => { gen(); }, [gen]);
  const strength = pw.length >= 20 && up && lo && num && sym ? "Sangat Kuat" : pw.length >= 12 ? "Kuat" : "Lemah";
  const c = strength === "Sangat Kuat" ? "#22c55e" : strength === "Kuat" ? "#eab308" : "#ef4444";
  const cp = async () => { if (await copy(pw)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };
  return (
    <div className="col">
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 14, border: "1px solid var(--bd)", borderRadius: 12, fontFamily: "monospace", fontSize: 13, wordBreak: "break-all", background: "var(--ps)" }}>
          <span style={{ flex: 1 }}>{pw}</span>
          <button className="btn btn-g" onClick={cp}><I.Copy size={14} /></button>
          <button className="btn btn-g" onClick={gen}><I.RefreshCw size={14} /></button>
        </div>
        <div style={{ marginTop: 10, color: c, fontSize: 12, fontWeight: 600 }}>Kekuatan: {strength} {copied && "• Tersalin!"}</div>
      </div>
      <div className="card">
        <div className="tag" style={{ marginBottom: 5 }}>PANJANG: {len}</div>
        <input type="range" min={4} max={64} value={len} onChange={(e) => setLen(+e.target.value)} style={{ width: "100%", accentColor: "var(--p)" }} />
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
          {[["Huruf Besar", up, setUp], ["Huruf Kecil", lo, setLo], ["Angka", num, setNum], ["Simbol", sym, setSym]].map(([l, v, s]) => (
            <label key={l} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
              <input type="checkbox" checked={v} onChange={(e) => s(e.target.checked)} />{l}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PasswordStrength() {
  const [pw, setPw] = useState("");
  const a = useMemo(() => {
    const c = { length: pw.length >= 12, upper: /[A-Z]/.test(pw), lower: /[a-z]/.test(pw), numbers: /\d/.test(pw), symbols: /[^A-Za-z0-9]/.test(pw), long: pw.length >= 16 };
    const score = Object.values(c).filter(Boolean).length;
    let pool = 0;
    if (/[a-z]/.test(pw)) pool += 26;
    if (/[A-Z]/.test(pw)) pool += 26;
    if (/\d/.test(pw)) pool += 10;
    if (/[^A-Za-z0-9]/.test(pw)) pool += 32;
    const entropy = pw.length * Math.log2(pool || 1);
    const crack = entropy > 0 ? Math.pow(2, entropy) / 1e10 : 0;
    return { score, checks: c, entropy, crack };
  }, [pw]);
  const lv = ["Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat", "Sempurna"];
  const cl = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a", "#059669"];
  const fmtTime = (s) => {
    if (s < 1) return "Instan";
    if (s < 60) return `${s.toFixed(0)} detik`;
    if (s < 3600) return `${(s / 60).toFixed(0)} menit`;
    if (s < 86400) return `${(s / 3600).toFixed(0)} jam`;
    if (s < 31536000) return `${(s / 86400).toFixed(0)} hari`;
    if (s < 31536000 * 1000) return `${(s / 31536000).toFixed(0)} tahun`;
    return "Miliaran tahun";
  };
  return (
    <div className="col">
      <input type="password" className="inp" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Masukkan password..." />
      {pw && (
        <>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: cl[a.score], fontWeight: 700, fontSize: 15 }}>{lv[a.score]}</span>
              <span className="mut">Skor: {a.score}/6</span>
            </div>
            <div style={{ height: 8, background: "var(--bd)", borderRadius: 4, marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: `${(a.score / 6) * 100}%`, height: "100%", background: cl[a.score], transition: "0.3s" }} />
            </div>
          </div>
          <div className="card">
            <div className="mut">Perkiraan waktu crack</div>
            <div style={{ marginTop: 4, fontSize: 20, fontWeight: 700, color: cl[a.score] }}>{fmtTime(a.crack)}</div>
            <div className="soft" style={{ marginTop: 4 }}>Entropi: {a.entropy.toFixed(0)} bits</div>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {[["Min 12 karakter", a.checks.length], ["Huruf besar", a.checks.upper], ["Huruf kecil", a.checks.lower], ["Angka", a.checks.numbers], ["Simbol", a.checks.symbols], ["Min 16 karakter", a.checks.long]].map(([l, v]) => (
              <div key={l} style={{ padding: 11, border: `1px solid ${v ? "#22c55e" : "var(--bd)"}`, borderRadius: 10, fontSize: 12, color: v ? "#22c55e" : "var(--mut)", display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>{v ? "OK" : "X"}</span> {l}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ============ MEDIA / DOWNLOADER ============ */
export function TikTokDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState(null);
  const [e, setE] = useState("");
  const go = async () => {
    if (!url) return;
    setLoading(true); setE(""); setR(null);
    try {
      const res = await fetch("/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "tiktok", url }) });
      const d = await res.json();
      if (!res.ok) setE(d.error || "Gagal"); else setR(d);
    } catch { setE("Kesalahan jaringan."); }
    setLoading(false);
  };
  return (
    <div className="col">
      <div className="card">
        <div className="tag" style={{ marginBottom: 8 }}>URL VIDEO TIKTOK</div>
        <div className="row">
          <input className="inp" style={{ flex: 1, minWidth: 200 }} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.tiktok.com/@user/video/..." />
          <button className="btn btn-p" disabled={loading || !url} onClick={go}>
            {loading ? <I.Loader2 size={14} className="spin" /> : <I.Download size={14} />}
            {loading ? "Memproses..." : "Download"}
          </button>
        </div>
        {e && <div style={{ marginTop: 10, padding: 10, background: "rgba(239,68,68,0.1)", borderRadius: 8, color: "#ef4444", fontSize: 13 }}>{e}</div>}
      </div>
      {r && (
        <div className="card fade">
          <div className="grid" style={{ gridTemplateColumns: "1fr 1.2fr" }}>
            <img src={r.cover} style={{ width: "100%", borderRadius: 12, objectFit: "cover" }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{r.title}</div>
              <div className="mut" style={{ marginTop: 6 }}>@{r.author} {r.nickname && `• ${r.nickname}`}</div>
              <div className="row" style={{ marginTop: 10 }}>
                {[["Play", r.stats?.plays], ["Like", r.stats?.likes], ["Komen", r.stats?.comments], ["Share", r.stats?.shares]].map(([l, v]) => (
                  <div key={l} style={{ padding: "4px 10px", border: "1px solid var(--bd)", borderRadius: 8, fontSize: 11 }}>
                    <span style={{ color: "var(--mut)" }}>{l}:</span> <b>{fmt(v)}</b>
                  </div>
                ))}
              </div>
              <div className="col" style={{ marginTop: 14 }}>
                <a className="btn btn-p" href={r.noWm} target="_blank" rel="noopener"><I.Download size={14} />Tanpa Watermark</a>
                <a className="btn btn-s" href={r.video} target="_blank" rel="noopener"><I.Download size={14} />HD</a>
                {r.music && <a className="btn btn-s" href={r.music} target="_blank" rel="noopener"><I.Music size={14} />Audio</a>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function YouTubeDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState(null);
  const [e, setE] = useState("");
  const [fb, setFb] = useState("");
  const go = async () => {
    if (!url) return;
    setLoading(true); setE(""); setR(null); setFb("");
    try {
      const res = await fetch("/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "youtube", url }) });
      const d = await res.json();
      if (!res.ok) { setE(d.error || "Gagal"); if (d.videoId) setFb(d.videoId); }
      else setR(d);
    } catch { setE("Kesalahan jaringan."); }
    setLoading(false);
  };
  return (
    <div className="col">
      <div className="card">
        <div className="tag" style={{ marginBottom: 8 }}>URL VIDEO YOUTUBE</div>
        <div className="row">
          <input className="inp" style={{ flex: 1, minWidth: 200 }} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          <button className="btn btn-p" disabled={loading || !url} onClick={go}>
            {loading ? <I.Loader2 size={14} className="spin" /> : <I.Youtube size={14} />}
            {loading ? "Memproses..." : "Download"}
          </button>
        </div>
        {e && <div style={{ marginTop: 10, padding: 10, background: "rgba(239,68,68,0.1)", borderRadius: 8, color: "#ef4444", fontSize: 13 }}>{e}</div>}
      </div>
      {fb && !r && (
        <div className="card">
          <img src={`https://img.youtube.com/vi/${fb}/maxresdefault.jpg`} style={{ width: "100%", borderRadius: 12 }} />
          <div className="mut" style={{ marginTop: 10 }}>Thumbnail berhasil diambil. Server downloader sedang sibuk, coba lagi beberapa saat.</div>
        </div>
      )}
      {r && (
        <div className="card fade">
          <img src={r.thumbnail} style={{ width: "100%", borderRadius: 12 }} />
          <div style={{ fontWeight: 600, marginTop: 12 }}>{r.title}</div>
          <div className="row" style={{ marginTop: 12 }}>
            <a className="btn btn-p" href={r.downloadUrl} target="_blank" rel="noopener"><I.Download size={14} />Unduh</a>
            <a className="btn btn-s" href={r.downloadUrl} target="_blank" rel="noopener"><I.ExternalLink size={14} />Buka</a>
          </div>
        </div>
      )}
      <div className="card" style={{ background: "var(--ps)", border: "none" }}>
        <div className="soft">CATATAN</div>
        <div className="mut" style={{ marginTop: 4 }}>Server downloader pihak ketiga dapat berubah sewaktu-waktu. Jika gagal, coba lagi beberapa saat.</div>
      </div>
    </div>
  );
}

export function InstagramDownloader() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="row" style={{ gap: 8, marginBottom: 8 }}><I.Info size={16} style={{ color: "var(--p)" }} /><b>Instagram Downloader (Beta)</b></div>
      <p className="mut">Layanan Instagram downloader memerlukan API berbayar. Untuk saat ini gunakan TikTok Downloader yang gratis, stabil, dan tanpa watermark.</p>
    </div>
  );
}

export function FacebookDownloader() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="row" style={{ gap: 8, marginBottom: 8 }}><I.Info size={16} style={{ color: "var(--p)" }} /><b>Facebook Downloader (Beta)</b></div>
      <p className="mut">Layanan Facebook downloader memerlukan API berbayar. Untuk saat ini gunakan TikTok Downloader yang gratis, stabil, dan tanpa watermark.</p>
    </div>
  );
}

export function TempMail() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const create = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "tempmail-create" }) });
      const d = await r.json();
      if (d.email && d.token) {
        setEmail(d.email); setToken(d.token); setMsgs([]); setDetail(null);
        localStorage.setItem("alltool-mail", JSON.stringify({ email: d.email, token: d.token }));
      }
    } catch {}
    setLoading(false);
  }, []);
  const inbox = useCallback(async (tk) => {
    if (!tk) return;
    setLoading(true);
    try {
      const r = await fetch("/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "tempmail-inbox", token: tk }) });
      const d = await r.json();
      setMsgs(Array.isArray(d) ? d : []);
    } catch {}
    setLoading(false);
  }, []);
  const open = async (id) => {
    setLoading(true);
    try {
      const r = await fetch("/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "tempmail-read", token, id }) });
      setDetail(await r.json());
    } catch {}
    setLoading(false);
  };
  useEffect(() => {
    const s = localStorage.getItem("alltool-mail");
    if (s) {
      try { const { email: e, token: tk } = JSON.parse(s); setEmail(e); setToken(tk); inbox(tk); } catch {}
    } else create();
  }, [create, inbox]);
  const cp = async () => { if (await copy(email)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };
  return (
    <div className="col">
      <div className="card">
        <div className="tag" style={{ marginBottom: 8 }}>ALAMAT EMAIL SEMENTARA</div>
        <div className="row">
          <div className="inp" style={{ flex: 1, minWidth: 200, fontFamily: "monospace", fontSize: 12, wordBreak: "break-all", background: "var(--ps)" }}>
            {email || "Memuat..."}
          </div>
          <button className="btn btn-s" onClick={cp}><I.Copy size={14} />{copied ? "Tersalin!" : "Salin"}</button>
          <button className="btn btn-p" disabled={loading} onClick={create}><I.RefreshCw size={14} />Baru</button>
        </div>
      </div>
      {detail ? (
        <div className="card fade">
          <button className="btn btn-g" onClick={() => setDetail(null)} style={{ marginBottom: 10 }}><I.ArrowLeft size={14} />Kembali</button>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{detail.subject || "(Tanpa subjek)"}</div>
          <div className="mut" style={{ marginTop: 4 }}>Dari: {detail.from?.address}</div>
          <div style={{ marginTop: 14, padding: 14, border: "1px solid var(--bd)", borderRadius: 10, fontSize: 13, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {detail.text || "(Tidak ada isi teks)"}
          </div>
        </div>
      ) : (
        <>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <b style={{ fontSize: 15 }}>Kotak Masuk ({msgs.length})</b>
            <button className="btn btn-s" disabled={loading} onClick={() => inbox(token)}>
              {loading ? <I.Loader2 size={14} className="spin" /> : <I.RefreshCw size={14} />}Refresh
            </button>
          </div>
          {msgs.length === 0 && !loading && (
            <div className="card" style={{ textAlign: "center", padding: 44, color: "var(--mut)" }}>
              <I.Mail size={36} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
              <div style={{ fontSize: 13 }}>Belum ada email masuk</div>
            </div>
          )}
          {msgs.map((m) => (
            <button key={m.id} className="card card-int" style={{ textAlign: "left", width: "100%" }} onClick={() => open(m.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.subject || "(Tanpa subjek)"}</div>
                  <div className="mut" style={{ marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.from?.address}</div>
                  <div className="mut" style={{ marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.intro}</div>
                </div>
                <div className="soft" style={{ flexShrink: 0 }}>{new Date(m.createdAt).toLocaleTimeString("id-ID")}</div>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

export function IpLookup() {
  const [ip, setIp] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [e, setE] = useState("");
  const go = async (target = "") => {
    setLoading(true); setE(""); setData(null);
    try {
      const r = await fetch("/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "ip-lookup", ip: target }) });
      const d = await r.json();
      if (d.error) setE(d.reason || "Tidak ditemukan"); else setData(d);
    } catch { setE("Gagal mengambil data."); }
    setLoading(false);
  };
  useEffect(() => { go(); }, []);
  const rows = [["IP", "ip"], ["Kota", "city"], ["Region", "region"], ["Negara", "country_name"], ["Kode Negara", "country_code"], ["Kode Pos", "postal"], ["Latitude", "latitude"], ["Longitude", "longitude"], ["Zona Waktu", "timezone"], ["ISP", "org"], ["ASN", "asn"]];
  return (
    <div className="col">
      <div className="card">
        <div className="row">
          <input className="inp" style={{ flex: 1, minWidth: 200, fontFamily: "monospace" }} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="Kosongkan untuk IP Anda..." />
          <button className="btn btn-p" disabled={loading} onClick={() => go(ip)}>
            {loading ? <I.Loader2 size={14} className="spin" /> : <I.Globe size={14} />}Cek IP
          </button>
        </div>
        {e && <div style={{ marginTop: 10, padding: 10, background: "rgba(239,68,68,0.1)", borderRadius: 8, color: "#ef4444", fontSize: 13 }}>{e}</div>}
      </div>
      {data && (
        <div className="card">
          {rows.map(([l, k]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--bd)" }}>
              <span className="mut">{l}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{String(data[k] ?? "-")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ UTILITY ============ */
export function ColorPicker() {
  const [c, setC] = useState("#7c3aed");
  const [copied, setCopied] = useState("");
  const h2r = (h) => {
    const x = h.replace("#", "");
    return { r: parseInt(x.slice(0, 2), 16) || 0, g: parseInt(x.slice(2, 4), 16) || 0, b: parseInt(x.slice(4, 6), 16) || 0 };
  };
  const r2h = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (mx + mn) / 2;
    if (mx !== mn) {
      const d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };
  const rgb = h2r(c);
  const hsl = r2h(rgb.r, rgb.g, rgb.b);
  const fmts = [["HEX", c.toUpperCase()], ["RGB", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`], ["HSL", `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`]];
  const pal = ["#7c3aed", "#a78bfa", "#c4b5fd", "#ede9fe", "#0ea5e9", "#06b6d4", "#14b8a6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#f43f5e", "#1e293b", "#334155", "#64748b", "#94a3b8"];
  const cp = async (v, n) => { if (await copy(v)) { setCopied(n); setTimeout(() => setCopied(""), 1500); } };
  return (
    <div className="col">
      <div className="card">
        <div className="row" style={{ gap: 18 }}>
          <input type="color" value={c} onChange={(e) => setC(e.target.value)} style={{ width: 80, height: 80, border: "none", borderRadius: 14, cursor: "pointer", boxShadow: "var(--shadow)" }} />
          <input className="inp" style={{ flex: 1, minWidth: 150, fontFamily: "monospace", fontSize: 15 }} value={c} onChange={(e) => setC(e.target.value)} />
        </div>
        <div className="col" style={{ marginTop: 14 }}>
          {fmts.map(([n, v]) => (
            <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, border: "1px solid var(--bd)", borderRadius: 10 }}>
              <div>
                <div className="mut">{n}</div>
                <div style={{ fontFamily: "monospace", fontSize: 14, marginTop: 2 }}>{v}</div>
              </div>
              <button className="btn btn-g" onClick={() => cp(v, n)}><I.Copy size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="tag" style={{ marginBottom: 10 }}>PALET CEPAT</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8 }}>
          {pal.map((x) => (
            <button key={x} onClick={() => setC(x)} style={{ aspectRatio: 1, background: x, borderRadius: 12, cursor: "pointer", transition: "transform 0.15s" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ))}
        </div>
      </div>
      {copied && <div style={{ color: "#22c55e", fontSize: 12, fontWeight: 500 }}>Tersalin: {copied}</div>}
    </div>
  );
}

export function CronParser() {
  const [c, setC] = useState("*/5 * * * *");
  const presets = [["Setiap menit", "* * * * *"], ["Setiap 5 menit", "*/5 * * * *"], ["Setiap jam", "0 * * * *"], ["Harian 00:00", "0 0 * * *"], ["Senin 09:00", "0 9 * * 1"], ["Tanggal 1", "0 0 1 * *"]];
  const parts = c.trim().split(/\s+/);
  const desc = () => {
    if (parts.length !== 5) return "Format tidak valid. Gunakan 5 field: menit jam hari bulan minggu";
    const [m, h, d, mo, dw] = parts;
    let s = "";
    if (m.startsWith("*/")) s += `Setiap ${m.slice(2)} menit`;
    else if (m === "*") s += "Setiap menit";
    else s += `Pada menit ${m}`;
    if (h !== "*") s += `, jam ${h}`;
    if (d !== "*") s += `, tanggal ${d}`;
    if (mo !== "*") s += `, bulan ${mo}`;
    if (dw !== "*") s += `, hari ke-${dw}`;
    return s + ".";
  };
  return (
    <div className="col">
      <input className="inp" style={{ fontFamily: "monospace", fontSize: 15 }} value={c} onChange={(e) => setC(e.target.value)} />
      <div className="row">
        {presets.map(([l, v]) => (
          <button key={v} className="chip" onClick={() => setC(v)}>{l}</button>
        ))}
      </div>
      <div className="card">
        <div className="tag" style={{ marginBottom: 6 }}>PENJELASAN</div>
        <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>{desc()}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {["Menit", "Jam", "Hari", "Bulan", "Minggu"].map((f, i) => (
          <div key={f} className="card" style={{ textAlign: "center", padding: 12 }}>
            <div className="soft">{f}</div>
            <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--p)", marginTop: 6, fontSize: 15 }}>{parts[i] || "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarcodeGenerator() {
  const [t, setT] = useState("1234567890");
  const [ty, setTy] = useState("code128");
  const url = t ? `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(t)}&code=${ty.toUpperCase()}&dpi=96` : "";
  return (
    <div className="col">
      <div className="card">
        <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>TEKS / ANGKA</div>
            <input className="inp" style={{ fontFamily: "monospace" }} value={t} onChange={(e) => setT(e.target.value)} />
          </div>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>FORMAT</div>
            <select className="inp" value={ty} onChange={(e) => setTy(e.target.value)}>
              <option value="code128">Code 128</option>
              <option value="code39">Code 39</option>
              <option value="ean13">EAN-13</option>
              <option value="upca">UPC-A</option>
              <option value="qrcode">QR Code</option>
            </select>
          </div>
        </div>
      </div>
      {url && (
        <div className="card" style={{ textAlign: "center" }}>
          <img src={url} style={{ maxWidth: "100%", margin: "0 auto" }} />
          <a className="btn btn-p" style={{ marginTop: 14 }} href={url} download="barcode.png"><I.Download size={14} />Unduh</a>
        </div>
      )}
    </div>
  );
}

export function TextToSpeech() {
  const [t, setT] = useState("");
  const [voices, setVoices] = useState([]);
  const [v, setV] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const up = () => {
      const x = window.speechSynthesis.getVoices();
      setVoices(x);
      if (x.length && !v) setV(x[0].name);
    };
    up();
    window.speechSynthesis.onvoiceschanged = up;
    return () => window.speechSynthesis.cancel();
  }, [v]);
  const speak = () => {
    if (!t) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    const voice = voices.find((x) => x.name === v);
    if (voice) u.voice = voice;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => setPlaying(false);
    u.onstart = () => setPlaying(true);
    window.speechSynthesis.speak(u);
  };
  const stop = () => { window.speechSynthesis.cancel(); setPlaying(false); };
  return (
    <div className="col">
      <textarea className="txa" rows={6} value={t} onChange={(e) => setT(e.target.value)} placeholder="Teks untuk diucapkan..." />
      <div className="card">
        <div className="tag" style={{ marginBottom: 5 }}>SUARA</div>
        <select className="inp" value={v} onChange={(e) => setV(e.target.value)}>
          {voices.map((x) => <option key={x.name} value={x.name}>{x.name} ({x.lang})</option>)}
        </select>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>KECEPATAN: {rate.toFixed(1)}x</div>
            <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} style={{ width: "100%", accentColor: "var(--p)" }} />
          </div>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>NADA: {pitch.toFixed(1)}</div>
            <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(+e.target.value)} style={{ width: "100%", accentColor: "var(--p)" }} />
          </div>
        </div>
      </div>
      <div className="row">
        <button className="btn btn-p" disabled={!t || playing} onClick={speak}><I.Play size={14} />Putar</button>
        <button className="btn btn-s" disabled={!playing} onClick={stop}><I.Square size={14} />Stop</button>
      </div>
    </div>
  );
}

export function RandomString() {
  const [len, setLen] = useState(16);
  const [n, setN] = useState(5);
  const [up, setUp] = useState(true);
  const [lo, setLo] = useState(true);
  const [num, setNum] = useState(true);
  const [sym, setSym] = useState(false);
  const [list, setList] = useState([]);
  const go = () => {
    let ch = "";
    if (up) ch += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lo) ch += "abcdefghijklmnopqrstuvwxyz";
    if (num) ch += "0123456789";
    if (sym) ch += "!@#$%^&*()_+-=";
    if (!ch) ch = "abcdefghijklmnopqrstuvwxyz";
    const r = [];
    for (let i = 0; i < n; i++) {
      const a = new Uint32Array(len);
      crypto.getRandomValues(a);
      let s = "";
      for (let j = 0; j < len; j++) s += ch[a[j] % ch.length];
      r.push(s);
    }
    setList(r);
  };
  return (
    <div className="col">
      <div className="card">
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>PANJANG: {len}</div>
            <input type="range" min={4} max={128} value={len} onChange={(e) => setLen(+e.target.value)} style={{ width: "100%", accentColor: "var(--p)" }} />
          </div>
          <div>
            <div className="tag" style={{ marginBottom: 5 }}>JUMLAH</div>
            <input type="number" className="inp" value={n} onChange={(e) => setN(+e.target.value)} min={1} max={100} />
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
          {[["Huruf Besar", up, setUp], ["Huruf Kecil", lo, setLo], ["Angka", num, setNum], ["Simbol", sym, setSym]].map(([l, v, s]) => (
            <label key={l} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
              <input type="checkbox" checked={v} onChange={(e) => s(e.target.checked)} />{l}
            </label>
          ))}
        </div>
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn btn-p" onClick={go}><I.RefreshCw size={14} />Generate</button>
          {list.length > 0 && <button className="btn btn-s" onClick={() => copy(list.join("\n"))}><I.Copy size={14} />Copy Semua</button>}
        </div>
      </div>
      <div className="col">
        {list.map((s, i) => (
          <div key={i} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "monospace", fontSize: 12, wordBreak: "break-all", flex: 1 }}>{s}</span>
            <button className="btn btn-g" onClick={() => copy(s)}><I.Copy size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
        }
