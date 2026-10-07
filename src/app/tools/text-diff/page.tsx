"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { GitCompare } from "lucide-react";

export default function Page() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const maxLen = Math.max(linesA.length, linesB.length);

  const diffs = Array.from({ length: maxLen }, (_, i) => ({
    a: linesA[i] ?? "",
    b: linesB[i] ?? "",
    same: linesA[i] === linesB[i],
  }));

  return (
    <ToolLayout title="Text Diff" description="Bandingkan dua teks baris per baris." icon={<GitCompare size={24} color="var(--primary)" />}>
      <div className="grid gap-3 md:grid-cols-2">
        <textarea value={a} onChange={(e) => setA(e.target.value)} placeholder="Teks pertama..." className="textarea" rows={10} />
        <textarea value={b} onChange={(e) => setB(e.target.value)} placeholder="Teks kedua..." className="textarea" rows={10} />
      </div>
      {(a || b) && (
        <div className="card mt-4 p-4">
          <h3 className="mb-3 text-sm font-semibold">Hasil Perbandingan</h3>
          <div className="font-mono text-xs">
            {diffs.map((d, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 border-b py-1 last:border-0" style={{ borderColor: "var(--border)" }}>
                <div style={{ color: d.same ? "var(--text)" : "#ef4444", background: d.same ? "transparent" : "rgba(239,68,68,0.08)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>
                  {d.a || " "}
                </div>
                <div style={{ color: d.same ? "var(--text)" : "#22c55e", background: d.same ? "transparent" : "rgba(34,197,94,0.08)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>
                  {d.b || " "}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
