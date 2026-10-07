"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Scale } from "lucide-react";

const UNITS: Record<string, { name: string; toBase: number }[]> = {
  panjang: [
    { name: "Meter", toBase: 1 },
    { name: "Kilometer", toBase: 1000 },
    { name: "Centimeter", toBase: 0.01 },
    { name: "Millimeter", toBase: 0.001 },
    { name: "Inch", toBase: 0.0254 },
    { name: "Foot", toBase: 0.3048 },
    { name: "Yard", toBase: 0.9144 },
    { name: "Mile", toBase: 1609.344 },
  ],
  berat: [
    { name: "Kilogram", toBase: 1 },
    { name: "Gram", toBase: 0.001 },
    { name: "Milligram", toBase: 0.000001 },
    { name: "Pound", toBase: 0.453592 },
    { name: "Ounce", toBase: 0.0283495 },
    { name: "Ton", toBase: 1000 },
  ],
  suhu: [
    { name: "Celsius", toBase: 1 },
    { name: "Fahrenheit", toBase: 1 },
    { name: "Kelvin", toBase: 1 },
  ],
};

export default function Page() {
  const [category, setCategory] = useState<"panjang" | "berat" | "suhu">("panjang");
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);

  const convert = (): number => {
    if (category === "suhu") {
      const names = UNITS.suhu.map((u) => u.name);
      const f = names[from], t = names[to];
      let celsius = value;
      if (f === "Fahrenheit") celsius = (value - 32) * 5 / 9;
      if (f === "Kelvin") celsius = value - 273.15;
      if (t === "Celsius") return celsius;
      if (t === "Fahrenheit") return celsius * 9 / 5 + 32;
      if (t === "Kelvin") return celsius + 273.15;
      return celsius;
    }
    const units = UNITS[category];
    return (value * units[from].toBase) / units[to].toBase;
  };

  const units = UNITS[category];

  return (
    <ToolLayout title="Unit Converter" description="Konversi satuan panjang, berat, suhu." icon={<Scale size={24} color="var(--primary)" />}>
      <div className="mb-3 flex gap-2">
        {(["panjang", "berat", "suhu"] as const).map((c) => (
          <button key={c} onClick={() => { setCategory(c); setFrom(0); setTo(1); }} className={`chip ${category === c ? "chip-active" : ""}`}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="card p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs font-medium">Nilai</label>
            <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="input mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium">Dari</label>
            <select value={from} onChange={(e) => setFrom(Number(e.target.value))} className="input mt-1">
              {units.map((u, i) => <option key={u.name} value={i}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Ke</label>
            <select value={to} onChange={(e) => setTo(Number(e.target.value))} className="input mt-1">
              {units.map((u, i) => <option key={u.name} value={i}>{u.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card mt-4 p-6 text-center">
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {value} {units[from].name} =
        </div>
        <div className="mt-2 text-3xl font-bold gradient-text">{convert().toLocaleString("id-ID", { maximumFractionDigits: 6 })}</div>
        <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{units[to].name}</div>
      </div>
    </ToolLayout>
  );
              }
