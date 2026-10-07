"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Link as LinkIcon, Copy } from "lucide-react";
import { copyText } from "@/lib/utils";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = async () => { if (await copyText(output)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  return (
    <ToolLayout title="URL Encoder" description="Encode dan decode URL." icon={<LinkIcon size={24} color="var(--primary)" />}>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="https://example.com/?q=hello world" className="textarea" rows={5} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => setOutput(encodeURIComponent(input))} className="btn-primary">Encode</button>
        <button onClick={() => setOutput(decodeURIComponent(input))} className="btn-secondary">Decode</button>
        <button onClick={() => setOutput(encodeURI(input))} className="btn-secondary">Encode URI</button>
        {output && <button onClick={copy} className="btn-secondary"><Copy size={14} />{copied ? "Tersalin!" : "Salin"}</button>}
      </div>
      {output && <textarea value={output} readOnly className="textarea mt-4" rows={5} />}
    </ToolLayout>
  );
}
