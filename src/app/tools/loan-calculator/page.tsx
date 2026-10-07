"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Wallet } from "lucide-react";

export default function Page() {
  const [amount, setAmount] = useState(10000000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(3);

  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  const monthly = monthlyRate === 0 ? amount / months : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const total = monthly * months;
  const interest = total - amount;

  const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });

  return (
    <ToolLayout title="Loan Calculator" description="Simulasi cicilan pinjaman." icon={<Wallet size={24} color="var(--primary)" />}>
      <div className="card p-5 space-y-3">
        <div>
          <label className="text-xs font-medium">Jumlah Pinjaman (Rp)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="input mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium">Bunga / Tahun (%)</label>
            <input type="number" step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="input mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium">Tenor (Tahun)</label>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="input mt-1" />
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          { label: "Cicilan / Bulan", value: fmt(monthly) },
          { label: "Total Bayar", value: fmt(total) },
          { label: "Total Bunga", value: fmt(interest) },
        ].map((r) => (
          <div key={r.label} className="card p-4">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{r.label}</div>
            <div className="mt-1 text-lg font-bold gradient-text">{r.value}</div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
