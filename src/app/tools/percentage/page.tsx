"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Percent } from "lucide-react";

export default function Page() {
  const [a, setA] = useState(10);
  const [b, setB] = useState(200);

  const r1 = (a / 100) * b;
  const r2 = (a / b) * 100;
  const r3 = ((b - a) / a) * 100;

  return (
    <ToolLayout title="Percentage Calculator" description="Hitung persentase dengan mudah." icon={<Percent size={24} color="var(--primary)" />}>
      <div className="card p-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium">Nilai A</label>
            <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} className="input mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium">Nilai B</label>
            <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} className="input mt-1" />
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {[
          { label: `${a}% dari ${b}`, value: r1.toFixed(2) },
          { label: `${a} adalah berapa % dari ${b}`, value: `${r2.toFixed(2)}%` },
          { label: `Perubahan dari ${a} ke ${b}`, value: `${r3.toFixed(2)}%` },
        ].map((r) => (
          <div key={r.label} className="card p-4">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{r.label}</div>
            <div className="mt-1 text-xl font-bold gradient-text">{r.value}</div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
