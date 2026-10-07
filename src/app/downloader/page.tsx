"use client";

import { useState } from "react";
import Link from "next/link";

export default function DownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDownload = async () => {
    if (!url) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Gagal mengunduh.");
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("content-disposition");
      let filename = "download";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match) filename = match[1];
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      setMessage("Berhasil diunduh.");
    } catch {
      setMessage("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-200 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">AllTool</Link>
          <Link href="/tools" className="text-sm text-neutral-600 hover:text-neutral-900">Tools</Link>
        </div>
      </nav>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Downloader</h1>
          <p className="mt-2 text-neutral-500">Masukkan URL file yang ingin diunduh.</p>

          <div className="mt-8 border border-neutral-200 p-6">
            <label className="text-sm font-medium text-neutral-700">URL File</label>
            <div className="mt-3 flex flex-col gap-3 md:flex-row">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/file.pdf"
                className="flex-1 border border-neutral-200 px-4 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              />
              <button
                onClick={handleDownload}
                disabled={loading}
                className="bg-neutral-900 px-6 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Download"}
              </button>
            </div>
            {message && <p className="mt-4 text-sm text-neutral-600">{message}</p>}
          </div>

          <div className="mt-8 text-sm text-neutral-500">
            <p className="font-medium text-neutral-700">Catatan:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Hanya untuk file publik yang dapat diakses langsung.</li>
              <li>Maksimal ukuran file 4 MB karena batas server.</li>
              <li>Pastikan Anda memiliki hak untuk mengunduh file tersebut.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
      }
