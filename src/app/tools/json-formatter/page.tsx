"use client";

import { useState } from "react";
import Link from "next/link";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON tidak valid");
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON tidak valid");
      setOutput("");
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
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
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">JSON Formatter</h1>
          <p className="mt-2 text-neutral-500">Format dan validasi JSON.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-neutral-700">Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mt-2 h-80 w-full border border-neutral-200 p-3 font-mono text-sm focus:border-neutral-900 focus:outline-none"
                placeholder='{"name": "value"}'
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700">Output</label>
              <textarea
                value={output}
                readOnly
                className="mt-2 h-80 w-full border border-neutral-200 bg-neutral-50 p-3 font-mono text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={format} className="bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700">
              Format
            </button>
            <button onClick={minify} className="border border-neutral-300 px-5 py-2 text-sm hover:border-neutral-900">
              Minify
            </button>
            <button onClick={copyOutput} className="border border-neutral-300 px-5 py-2 text-sm hover:border-neutral-900">
              Copy
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      </section>
    </div>
  );
}
