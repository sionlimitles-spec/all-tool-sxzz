src/app/tools/fancy-text/page.tsx"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Sparkles, Copy } from "lucide-react";
import { copyText } from "@/lib/utils";

const maps = [
  { name: "Bold", upper: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭", lower: "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇" },
  { name: "Italic", upper: "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡", lower: "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻" },
  { name: "Script", upper: "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵", lower: "𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏" },
  { name: "Monospace", upper: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉", lower: "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣" },
  { name: "Double Struck", upper: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ", lower: "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫" },
  { name: "Circle", upper: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ", lower: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ" },
  { name: "Squared", upper: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉", lower: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉" },
];

const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const az = "abcdefghijklmnopqrstuvwxyz";

function convert(text: string, map: typeof maps[number]) {
  return text.split("").map((c) => {
    const i = AZ.indexOf(c);
    if (i >= 0) return map.upper[i];
    const j = az.indexOf(c);
    if (j >= 0) return map.lower[j];
    return c;
  }).join("");
}

export default function Page() {
  const [text, setText] = useState("Hello World");
  const [copied, setCopied] = useState("");

  const copy = async (val: string, name: string) => {
    if (await copyText(val)) {
      setCopied(name);
      setTimeout(() => setCopied(""), 1500);
    }
  };

  return (
    <ToolLayout title="Fancy Text" description="Ubah teks jadi gaya unik untuk medsos." icon={<Sparkles size={24} color="var(--primary)" />}>
      <input value={text} onChange={(e) => setText(e.target.value)} className="input" placeholder="Masukkan teks..." />
      <div className="mt-4 space-y-2">
        {maps.map((m) => {
          const result = convert(text, m);
          return (
            <div key={m.name} className="card flex items-center justify-between p-4">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{m.name}</div>
                <div className="mt-1 truncate text-base">{result}</div>
              </div>
              <button onClick={() => copy(result, m.name)} className="btn-ghost p-2 shrink-0">
                <Copy size={14} />
              </button>
            </div>
          );
        })}
      </div>
      {copied && <div className="mt-3 text-xs text-green-500">Tersalin: {copied}</div>}
    </ToolLayout>
  );
}
