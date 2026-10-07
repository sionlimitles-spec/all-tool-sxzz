"use client";

import { useState } from "react";
import Link from "next/link";

export default function CaseConverter() {
  const [text, setText] = useState("");

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const toTitle = () =>
    setText(text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()));
  const toSentence = () =>
    setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()));

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
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Case Converter</h1>
          <p className="mt-2 text-neutral-500">Ubah kapitalisasi teks.</p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-8 h-64 w-full border border-neutral-200 p-4 text-sm focus:border-neutral-900 focus:outline-none"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={toUpper} className="bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700">UPPERCASE</button>
            <button onClick={toLower} className="border border-neutral-300 px-5 py-2 text-sm hover:border-neutral-900">lowercase</button>
            <button onClick={toTitle} className="border border-neutral-300 px-5 py-2 text-sm hover:border-neutral-900">Title Case</button>
            <button onClick={toSentence} className="border border-neutral-300 px-5 py-2 text-sm hover:border-neutral-900">Sentence case</button>
          </div>
        </div>
      </section>
    </div>
  );
            }
