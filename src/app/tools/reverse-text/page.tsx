"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { ArrowLeftRight, Copy } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"chars" | "words" | "lines">("chars");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const reverse = () => {
    if (mode === "chars") setOutput(text.split("").reverse().join(""));
    else if (mode === "words") setOutput(text.split(/\s+/).reverse().join(" "));
    else setOutput(text.split("\n").reverse().join("\n"));
  };

  const copy = async () => { if (await copyText(output)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  return (
    <ToolLayout title="Reverse Text" description="Balik urutan karakter, kata, atau baris." icon={<ArrowLeftRight size={24} color="var(--primary)" />}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Masukkan teks..." className="textarea" rows={6} />
      <div className="mt-3 flex flex-wrap gap-2">
        {(["chars", "words", "lines"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`chip ${mode === m ? "chip-active" : ""}`}>
            {m === "chars" ? "Karakter" : m === "words" ? "Kata" : "Baris"}
          </button>
        ))}
        <button onClick={reverse} className="btn-primary">Balik</button>
        {output && <button onClick={copy} className="btn-secondary"><Copy size={14} />{copied ? "Tersalin!" : "Salin"}</button>}
      </div>
      {output && <textarea value={output} readOnly className="textarea mt-4" rows={6} />}
    </ToolLayout>
  );
}
