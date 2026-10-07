"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Binary, Copy, ArrowLeftRight } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setOutput("Error: input tidak valid");
    }
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const copy = async () => { if (await copyText(output)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  return (
    <ToolLayout title="Base64 Encoder" description="Encode dan decode teks Base64." icon={<Binary size={24} color="var(--primary)" />}>
      <div className="mb-3 flex gap-2">
        {(["encode", "decode"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`chip ${mode === m ? "chip-active" : ""}`}>
            {m === "encode" ? "Encode" : "Decode"}
          </button>
        ))}
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? "Teks biasa..." : "Base64..."} className="textarea" rows={6} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={process} className="btn-primary">{mode === "encode" ? "Encode" : "Decode"}</button>
        {output && <button onClick={swap} className="btn-secondary"><ArrowLeftRight size={14} />Tukar</button>}
        {output && <button onClick={copy} className="btn-secondary"><Copy size={14} />{copied ? "Tersalin!" : "Salin"}</button>}
      </div>
      {output && <textarea value={output} readOnly className="textarea mt-4" rows={6} />}
    </ToolLayout>
  );
}
