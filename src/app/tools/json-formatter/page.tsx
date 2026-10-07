"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Braces, Copy, Minimize2, Maximize2, CheckCircle, XCircle } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON tidak valid");
      setOutput("");
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON tidak valid");
    }
  };

  const copy = async () => { if (await copyText(output)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  const valid = input && !error && output;

  return (
    <ToolLayout title="JSON Formatter" description="Format, validasi, dan minify JSON." icon={<Braces size={24} color="var(--primary)" />}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>INPUT</span>
            {input && (error ? <XCircle size={14} color="#ef4444" /> : <CheckCircle size={14} color="#22c55e" />)}
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"name": "value"}' className="textarea" rows={14} />
        </div>
        <div>
          <div className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>OUTPUT</div>
          <textarea value={output} readOnly className="textarea" rows={14} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={format} className="btn-primary"><Maximize2 size={14} />Format</button>
        <button onClick={minify} className="btn-secondary"><Minimize2 size={14} />Minify</button>
        {output && <button onClick={copy} className="btn-secondary"><Copy size={14} />{copied ? "Tersalin!" : "Salin"}</button>}
      </div>
      {error && <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
    </ToolLayout>
  );
          }
