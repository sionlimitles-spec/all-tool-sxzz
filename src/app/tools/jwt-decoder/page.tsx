"use client";

import { useState } from "react";
import ToolLayout from "@/components/tool-layout";
import { Key } from "lucide-react";

export default function Page() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) throw new Error("Format JWT tidak valid");
      const h = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
      const p = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      setHeader(JSON.stringify(h, null, 2));
      setPayload(JSON.stringify(p, null, 2));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal decode");
      setHeader("");
      setPayload("");
    }
  };

  return (
    <ToolLayout title="JWT Decoder" description="Decode JSON Web Token." icon={<Key size={24} color="var(--primary)" />}>
      <textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOi..." className="textarea" rows={4} />
      <button onClick={decode} className="btn-primary mt-3">Decode</button>
      {error && <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
      {header && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>HEADER</h3>
            <textarea value={header} readOnly className="textarea" rows={10} />
          </div>
          <div>
            <h3 className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>PAYLOAD</h3>
            <textarea value={payload} readOnly className="textarea" rows={10} />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
