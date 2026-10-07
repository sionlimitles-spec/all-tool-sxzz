"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Maximize, Download } from "lucide-react";
import { downloadBlob } from "@/lib/utils";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [originalRatio, setOriginalRatio] = useState(1);
  const [result, setResult] = useState("");

  const handleFile = (f: File) => {
    setFile(f);
    const img = new Image();
    img.onload = () => {
      setOriginalRatio(img.width / img.height);
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = URL.createObjectURL(f);
  };

  const onWidthChange = (w: number) => {
    setWidth(w);
    if (keepRatio) setHeight(Math.round(w / originalRatio));
  };

  const onHeightChange = (h: number) => {
    setHeight(h);
    if (keepRatio) setWidth(Math.round(h * originalRatio));
  };

  const resize = async () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((r) => { img.onload = r; });
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
    setResult(canvas.toDataURL("image/png"));
  };

  const download = async () => {
    const res = await fetch(result);
    downloadBlob(await res.blob(), "resized.png");
  };

  return (
    <ToolLayout title="Image Resizer" description="Ubah ukuran gambar sesuai kebutuhan." icon={<Maximize size={24} color="var(--primary)" />}>
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="input" />
      {file && (
        <div className="mt-4 card p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">Lebar</label>
              <input type="number" value={width} onChange={(e) => onWidthChange(Number(e.target.value))} className="input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium">Tinggi</label>
              <input type="number" value={height} onChange={(e) => onHeightChange(Number(e.target.value))} className="input mt-1" />
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} className="accent-violet-600" />
            Jaga rasio aspek
          </label>
          <button onClick={resize} className="btn-primary mt-4">Ubah Ukuran</button>
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
