"use client";

import { useState } from "react";
import Link from "next/link";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

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
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">URL Encoder</h1>
          <p className="mt-2 text-neutral-500">Encode dan decode URL.</p>

          <div className="mt-8 space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://example.com/search?q=hello world"
              className="h-40 w-full border border-neutral-200 p-3 font-mono text-sm focus:border-neutral-900 focus:outline-none"
            />
            <div className="flex gap-2">
              <button onClick={() => setOutput(encodeURIComponent(input))} className="bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700">Encode</button>
              <button onClick={() => setOutput(decodeURIComponent(input))} className="border border-neutral-300 px-5 py-2 text-sm hover:border-neutral-900">Decode</button>
            </div>
            <textarea
              value={output}
              readOnly
              className="h-40 w-full border border-neutral-200 bg-neutral-50 p-3 font-mono text-sm"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
