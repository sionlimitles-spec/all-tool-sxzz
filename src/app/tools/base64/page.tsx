"use client";

import { useState } from "react";
import Link from "next/link";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setOutput("Gagal encode");
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
    } catch {
      setOutput("Base64 tidak valid");
    }
  };

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
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Base64 Encoder</h1>
          <p className="mt-2 text-neutral-500">Encode dan decode teks Base64.</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-700">Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mt-2 h-40 w-full border border-neutral-200 p-3 font-mono text-sm focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={encode} className="bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700">Encode</button>
              <button onClick={decode} className="border border-neutral-300 px-5 py-2 text-sm hover:border-neutral-900">Decode</button>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700">Output</label>
              <textarea
                value={output}
                readOnly
                className="mt-2 h-40 w-full border border-neutral-200 bg-neutral-50 p-3 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
