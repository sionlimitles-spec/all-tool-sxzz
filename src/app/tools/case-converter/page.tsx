"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Type, Copy } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const conversions = [
    { label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
    { label: "lowercase", fn: (s: string) => s.toLowerCase() },
    { label: "Title Case", fn: (s: string) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
    { label: "Sentence case", fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()) },
    { label: "camelCase", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { label: "snake_case", fn: (s: string) => s.trim().toLowerCase().replace(/\s+/g, "_") },
    { label: "kebab-case", fn: (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-") },
    { label: "aLtErNaTiNg", fn: (s: string) => s.split("").map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("") },
  ];

  const copy = async () => { if (await copyText(text)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  return (
    <ToolLayout title="Case Converter" description="Ubah kapitalisasi teks dengan cepat." icon={<Type size={24} color="var(--primary)" />}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Masukkan teks..." className="textarea" rows={6} />
      <div className="mt-4 flex flex-wrap gap-2">
        {conversions.map((c) => (
          <button key={c.label} onClick={() => setText(c.fn(text))} className="btn-secondary">{c.label}</button>
        ))}
        <button onClick={copy} className="btn-primary">
          <Copy size={14} />{copied ? "Tersalin!" : "Salin"}
        </button>
      </div>
    </ToolLayout>
  );
}
