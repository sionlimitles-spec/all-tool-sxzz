"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Image as ImageIcon, Copy } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [dataUri, setDataUri] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setDataUri(String(reader.result));
    reader.readAsDataURL(f);
  };

  const copy = async () => { if (await copyText(dataUri)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  return (
    <ToolLayout title="Image to Base64" description="Konversi gambar jadi Base64 data URI." icon={<ImageIcon size={24} color="var(--primary)" />}>
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="input" />
      {dataUri && (
        <>
          <img src={dataUri} alt="Preview" className="mt-4 max-h-48 rounded-xl" />
          <button onClick={copy} className="btn-primary mt-3"><Copy size={14} />{copied ? "Tersalin!" : "Salin Data URI"}</button>
          <textarea value={dataUri} readOnly className="textarea mt-3" rows={6} />
        </>
      )}
    </ToolLayout>
  );
            }
