"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tool-layout";
import { Search } from "lucide-react";

export default function Page() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: "" };
    try {
      const re = new RegExp(pattern, flags);
      const m = text.match(re);
      return { matches: m ? Array.from(m) : [], error: "" };
    } catch (e) {
      return { matches: [], error: e instanceof Error ? e.message : "Regex tidak valid" };
    }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => {
    if (!pattern || error) return text;
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      return text.replace(re, (m) => `<mark style="background:var(--primary);color:#fff;border-radius:3px;padding:0 2px">${m}</mark>`);
    } catch { return text; }
  }, [pattern, flags, text, error]);

  return (
    <ToolLayout title="Regex Tester" description="Uji ekspresi reguler secara langsung." icon={<Search size={24} color="var(--primary)" />}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Pattern</label>
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="\d+" className="input font-mono" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Flags</label>
          <input value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="g" className="input font-mono" />
        </div>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Teks untuk diuji..." className="textarea mt-3" rows={6} />
      {error && <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
      {!error && pattern && (
        <>
          <div className="card mt-4 p-4">
            <h3 className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Highlight ({matches.length} match)
            </h3>
            <div className="whitespace-pre-wrap break-words text-sm" dangerouslySetInnerHTML={{ __html: highlighted }} />
          </div>
          {matches.length > 0 && (
            <div className="mt-3 card p-4">
              <h3 className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Hasil Match</h3>
              <div className="flex flex-wrap gap-2">
                {matches.map((m, i) => (
                  <span key={i} className="rounded-lg px-2 py-1 font-mono text-xs" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </ToolLayout>
  );
}
