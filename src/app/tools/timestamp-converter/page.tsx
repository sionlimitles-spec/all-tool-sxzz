"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Clock, Copy } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  const toDate = () => {
    const n = Number(ts);
    const d = new Date(n < 1e12 ? n * 1000 : n);
    if (isNaN(d.getTime())) return "Tanggal tidak valid";
    return d.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "long" });
  };

  const toTs = () => {
    const d = new Date(date);
    return Math.floor(d.getTime() / 1000);
  };

  return (
    <ToolLayout title="Timestamp Converter" description="Konversi Unix timestamp ke tanggal." icon={<Clock size={24} color="var(--primary)" />}>
      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold">Timestamp → Tanggal</h3>
        <input value={ts} onChange={(e) => setTs(e.target.value)} className="input font-mono" />
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 rounded-xl p-3 text-sm font-mono" style={{ background: "var(--primary-soft)" }}>{toDate()}</div>
          <button onClick={() => copyText(toDate())} className="btn-ghost p-2"><Copy size={14} /></button>
        </div>
        <button onClick={() => setTs(String(Math.floor(Date.now() / 1000)))} className="btn-secondary mt-3">Sekarang</button>
      </div>

      <div className="card mt-4 p-5">
        <h3 className="mb-3 text-sm font-semibold">Tanggal → Timestamp</h3>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 rounded-xl p-3 font-mono text-sm" style={{ background: "var(--primary-soft)" }}>{toTs()}</div>
          <button onClick={() => copyText(String(toTs()))} className="btn-ghost p-2"><Copy size={14} /></button>
        </div>
      </div>
    </ToolLayout>
  );
}
