"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Fingerprint, Copy, RefreshCw } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const [list, setList] = useState<string[]>([]);

  const gen = () => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = crypto.randomUUID();
      if (noDashes) id = id.replace(/-/g, "");
      if (uppercase) id = id.toUpperCase();
      arr.push(id);
    }
    setList(arr);
  };

  return (
    <ToolLayout title="UUID Generator" description="Buat UUID v4 acak." icon={<Fingerprint size={24} color="var(--primary)" />}>
      <div className="card p-5">
        <div className="flex flex-wrap items-center gap-3">
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="input w-24" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-violet-600" />
            Uppercase
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={noDashes} onChange={(e) => setNoDashes(e.target.checked)} className="accent-violet-600" />
            Tanpa tanda hubung
          </label>
          <button onClick={gen} className="btn-primary"><RefreshCw size={14} />Generate</button>
          {list.length > 0 && <button onClick={() => copyText(list.join("\n"))} className="btn-secondary"><Copy size={14} />Salin Semua</button>}
        </div>
      </div>
      {list.length > 0 && (
        <div className="mt-4 space-y-2">
          {list.map((id, i) => (
            <div key={i} className="card flex items-center justify-between p-3">
              <span className="break-all font-mono text-xs">{id}</span>
              <button onClick={() => copyText(id)} className="btn-ghost p-1 shrink-0"><Copy size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
