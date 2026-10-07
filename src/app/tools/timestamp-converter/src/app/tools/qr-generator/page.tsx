"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { QrCode, Download } from "lucide-react";

export default function Page() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");

  const qrUrl = text
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${fg.slice(1)}&bgcolor=${bg.slice(1)}`
    : "";

  return (
    <ToolLayout title="QR Code Generator" description="Buat QR code dari teks atau URL." icon={<QrCode size={24} color="var(--primary)" />}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Teks / URL</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" className="textarea" rows={4} />
          <label className="mt-3 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Ukuran: {size}px</label>
          <input type="range" min={100} max={600} step={50} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-1 w-full accent-violet-600" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs" style={{ color: "var(--text-muted)" }}>Warna QR</label>
              <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="input mt-1 h-10 p-1" />
            </div>
            <div>
              <label className="text-xs" style={{ color: "var(--text-muted)" }}>Warna Background</label>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="input mt-1 h-10 p-1" />
            </div>
          </div>
        </div>
        <div className="card flex flex-col items-center justify-center p-5">
          {qrUrl ? (
            <>
              <img src={qrUrl} alt="QR Code" className="rounded-xl" />
              <a href={qrUrl} download="qrcode.png" className="btn-primary mt-4"><Download size={14} />Unduh QR</a>
            </>
          ) : (
            <div className="text-center" style={{ color: "var(--text-muted)" }}>
              <QrCode size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">QR code akan muncul di sini.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
