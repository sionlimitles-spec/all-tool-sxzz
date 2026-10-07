"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { FileText, Copy, RefreshCw } from "lucide-react";
import { copyText } from "@/lib/utils";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

export default function Page() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const rand = (n: number) => WORDS[Math.floor(Math.random() * n)];

  const generate = () => {
    if (type === "words") {
      setOutput(Array.from({ length: count }, () => rand(WORDS.length)).join(" "));
    } else if (type === "sentences") {
      const sentences = Array.from({ length: count }, () => {
        const len = 10 + Math.floor(Math.random() * 10);
        const words = Array.from({ length: len }, () => rand(WORDS.length));
        return words.join(" ").replace(/^\w/, (c) => c.toUpperCase()) + ".";
      });
      setOutput(sentences.join(" "));
    } else {
      const paras = Array.from({ length: count }, () => {
        const sentences = Array.from({ length: 4 + Math.floor(Math.random() * 3) }, () => {
          const len = 8 + Math.floor(Math.random() * 10);
          const words = Array.from({ length: len }, () => rand(WORDS.length));
          return words.join(" ").replace(/^\w/, (c) => c.toUpperCase()) + ".";
        });
        return sentences.join(" ");
      });
      setOutput(paras.join("\n\n"));
    }
  };

  const copy = async () => { if (await copyText(output)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  return (
    <ToolLayout title="Lorem Ipsum" description="Generator teks dummy." icon={<FileText size={24} color="var(--primary)" />}>
      <div className="card p-5">
        <div className="flex flex-wrap items-center gap-3">
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="input w-24" />
          <select value={type} onChange={(e) => setType(e.target.value as never)} className="input w-40">
            <option value="paragraphs">Paragraf</option>
            <option value="sentences">Kalimat</option>
            <option value="words">Kata</option>
          </select>
          <button onClick={generate} className="btn-primary"><RefreshCw size={14} />Generate</button>
          {output && <button onClick={copy} className="btn-secondary"><Copy size={14} />{copied ? "Tersalin!" : "Salin"}</button>}
        </div>
      </div>
      {output && <textarea value={output} readOnly className="textarea mt-4" rows={12} />}
    </ToolLayout>
  );
}
