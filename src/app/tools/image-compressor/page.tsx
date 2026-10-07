"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Minimize, Download } from "lucide-react";
import { downloadBlob, formatBytes } from "@/lib/utils";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const compress = async () => {
    if (!file) return;
    setLoading(true);
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    await new Promise((res) => { img.onload = res; });
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) setResult({ url: URL.createObjectURL(blob), size: blob.size });
        setLoading(false);
      },
      "image/jpeg",
      quality
    );
    URL.revokeObjectURL(url);
  };

  const download = async () => {
    if (!result) return;
    const res = await fetch(result.url);
    const blob = await res.blob();
    downloadBlob(blob, "compressed.jpg");
  };

  return (
    <ToolLayout title="Image Compressor" description="Kompres gambar tanpa kehilangan kualitas." icon={<Minimize size={24} color="var(--primary)" />}>
      <input type="file" accept="image/*" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(null); }} className="input" />
      {file && (
        <div className="mt-4 card p-5">
          <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
            Ukuran asli: {formatBytes(file.size)}
          </div>
          <label className="text-xs font-medium">Kualitas: {Math.round(quality * 100)}%</label>
          <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="mt-1 w-full accent-violet-600" />
          <button onClick={compress} disabled={loading} className="btn-primary mt-4">{loading ? "Memproses..." : "Kompres"}</button>
        </div>
      )}
      {result && (
        <div className="mt-4 card p-5">
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            Ukuran baru: {formatBytes(result.size)} ({file ? Math.round((1 - result.size / file.size) * 100) : 0}% lebih kecil)
          </div>
          <img src={result.url} alt="Result" className="mt-3 max-h-64 rounded-xl" />
          <button onClick={download} className="btn-primary mt-3"><Download size={14} />Unduh</button>
        </div>
      )}
    </ToolLayout>
  );
}
