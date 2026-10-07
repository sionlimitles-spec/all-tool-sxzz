"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { ListX, Copy } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [sort, setSort] = useState(false);
  const [copied, setCopied] = useState(false);

  const process = () => {
    const lines = text.split("\n");
    const seen = new Set<string>();
    const result: string[] = [];
    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }
    if (sort) result.sort();
    setOutput(result.join("\n"));
  };

  const copy = async () => { if (await copyText(output)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  const removed = text ? text.split("\n").length - output.split("\n").length : 0;

  return (
    <ToolLayout title="Remove Duplicates" description="Hapus baris duplikat dari daftar." icon={<ListX size={24} color="var(--primary)" />}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Satu item per baris..." className="textarea" rows={10} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="accent-violet-600" />
          Case sensitive
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} className="accent-violet-600" />
          Urutkan
        </label>
        <button onClick={process} className="btn-primary">Proses</button>
        {output && <button onClick={copy} className="btn-secondary"><Copy size={14} />{copied ? "Tersalin!" : "Salin"}</button>}
      </div>
      {output && (
        <>
          <div className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
            {removed} baris duplikat dihapus.
          </div>
          <textarea value={output} readOnly className="textarea mt-3" rows={10} />
        </>
      )}
    </ToolLayout>
  );
}
