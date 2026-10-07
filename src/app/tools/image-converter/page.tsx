"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { RefreshCw, Download } from "lucide-react";
import { downloadBlob } from "@/lib/utils";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("image/png");
  const [result, setResult] = useState("");

  const convert = async () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((r) => { img.onload = r; });
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    setResult(canvas.toDataURL(format));
  };

  const download = async () => {
    const ext = format.split("/")[1];
    const res = await fetch(result);
    downloadBlob(await res.blob(), `converted.${ext}`);
  };

  return (
    <ToolLayout title="Image Converter" description="Konversi antar format gambar." icon={<RefreshCw size={24} color="var(--primary)" />}>
      <input type="file" accept="image/*" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(""); }} className="input" />
      {file && (
        <div className="mt-4 card p-5">
          <label className="text-xs font-medium">Format Tujuan</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="input mt-1">
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
          <button onClick={convert} className="btn-primary mt-4">Konversi</button>
        </div>
      )}
      {result && (
        <div className="mt-4 card p-5">
          <img src={result} alt="Result" className="max-h-64 rounded-xl" />
          <button onClick={download} className="btn-primary mt-3"><Download size={14} />Unduh</button>
        </div>
      )}
    </ToolLayout>
  );
}
