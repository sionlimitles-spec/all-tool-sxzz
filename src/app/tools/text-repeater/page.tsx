"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Repeat, Copy } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState("\n");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const repeat = () => setOutput(Array.from({ length: count }, () => text).join(separator));
  const copy = async () => { if (await copyText(output)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  return (
    <ToolLayout title="Text Repeater" description="Ulangi teks berkali-kali." icon={<Repeat size={24} color="var(--primary)" />}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Teks yang akan diulang..." className="textarea" rows={4} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value))} className="input w-24" />
        <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="input w-44">
          <option value="\n">Baris Baru</option>
          <option value=" ">Spasi</option>
          <option value=", ">Koma</option>
          <option value="">Tanpa Pemisah</option>
        </select>
        <button onClick={repeat} className="btn-primary">Ulangi</button>
        {output && <button onClick={copy} className="btn-secondary"><Copy size={14} />{copied ? "Tersalin!" : "Salin"}</button>}
      </div>
      {output && <textarea value={output} readOnly className="textarea mt-4" rows={10} />}
    </ToolLayout>
  );
        }
