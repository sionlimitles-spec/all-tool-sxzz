"use client";

import { useState } from "react";
import Link from "next/link";

export default function WordCounter() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const paragraphs = text.split(/\n+/).filter((p) => p.trim()).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;

  const stats = [
    { label: "Kata", value: words },
    { label: "Karakter", value: chars },
    { label: "Karakter tanpa spasi", value: charsNoSpace },
    { label: "Paragraf", value: paragraphs },
    { label: "Kalimat", value: sentences },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-200 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">AllTool</Link>
          <Link href="/tools" className="text-sm text-neutral-600 hover:text-neutral-900">Tools</Link>
        </div>
      </nav>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Word Counter</h1>
          <p className="mt-2 text-neutral-500">Hitung kata, karakter, dan paragraf.</p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis atau tempel teks di sini..."
            className="mt-8 h-64 w-full border border-neutral-200 p-4 text-sm focus:border-neutral-900 focus:outline-none"
          />

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="border border-neutral-200 p-4">
                <div className="text-2xl font-semibold text-neutral-900">{s.value}</div>
                <div className="mt-1 text-xs text-neutral-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
