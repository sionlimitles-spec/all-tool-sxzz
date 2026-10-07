"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Activity } from "lucide-react";

export default function Page() {
  const [weight, setWeight] = useState(60);
  const [height, setHeight] = useState(170);

  const bmi = weight / Math.pow(height / 100, 2);
  const category = bmi < 18.5 ? "Kurus" : bmi < 25 ? "Normal" : bmi < 30 ? "Gemuk" : "Obesitas";
  const color = bmi < 18.5 ? "#3b82f6" : bmi < 25 ? "#22c55e" : bmi < 30 ? "#f59e0b" : "#ef4444";

  return (
    <ToolLayout title="BMI Calculator" description="Hitung indeks massa tubuh." icon={<Activity size={24} color="var(--primary)" />}>
      <div className="card p-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium">Berat (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="input mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium">Tinggi (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="input mt-1" />
          </div>
        </div>
      </div>
      <div className="card mt-4 p-6 text-center">
        <div className="text-5xl font-bold" style={{ color }}>{bmi.toFixed(1)}</div>
        <div className="mt-2 text-sm font-medium" style={{ color }}>{category}</div>
        <div className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
          Normal: 18.5 - 24.9 • Gemuk: 25 - 29.9 • Obesitas: 30+
        </div>
      </div>
    </ToolLayout>
  );
}
