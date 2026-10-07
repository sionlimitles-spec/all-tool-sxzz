"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Hash } from "lucide-react";

export default function Page() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paragraphs = text.split(/\n+/).filter((p) => p.trim()).length;
  const readingTime = Math.ceil(words / 200);

  const stats = [
    { label: "Kata", value: words },
    { label: "Karakter", value: chars },
    { label: "Tanpa Spasi", value: charsNoSpace },
    { label: "Kalimat", value: sentences },
    { label: "Paragraf", value: paragraphs },
    { label: "Menit Baca", value: readingTime },
  ];

  return (
    <ToolLayout title="Word Counter" description="Hitung kata, karakter, kalimat, dan paragraf." icon={<Hash size={24} color="var(--primary)" />}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis atau tempel teks di sini..." className="textarea" rows={10} />
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl font-bold gradient-text">{s.value}</div>
            <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <button onClick={() => setText("")} className="btn-secondary mt-4">Bersihkan</button>
    </ToolLayout>
  );
}
