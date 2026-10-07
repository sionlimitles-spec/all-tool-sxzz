"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Code, Copy } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = () => {
    setOutput(
      input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
    );
  };

  const decode = () => {
    const el = document.createElement("textarea");
    el.innerHTML = input;
    setOutput(el.value);
  };

  const copy = async () => { if (await copyText(output)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  return (
    <ToolLayout title="HTML Encoder" description="Encode karakter khusus HTML." icon={<Code size={24} color="var(--primary)" />}>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="<div>Hello</div>" className="textarea" rows={6} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={encode} className="btn-primary">Encode</button>
        <button onClick={decode} className="btn-secondary">Decode</button>
        {output && <button onClick={copy} className="btn-secondary"><Copy size={14} />{copied ? "Tersalin!" : "Salin"}</button>}
      </div>
      {output && <textarea value={output} readOnly className="textarea mt-4" rows={6} />}
    </ToolLayout>
  );
}
