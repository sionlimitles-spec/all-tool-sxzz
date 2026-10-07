import Link from "next/link";

const tools = [
  { title: "JSON Formatter", description: "Format dan validasi JSON dengan cepat.", href: "/tools/json-formatter" },
  { title: "Base64 Encoder", description: "Encode dan decode teks Base64 secara instan.", href: "/tools/base64" },
  { title: "Word Counter", description: "Hitung kata, karakter, dan paragraf.", href: "/tools/word-counter" },
  { title: "Case Converter", description: "Ubah huruf besar, kecil, dan title case.", href: "/tools/case-converter" },
  { title: "URL Encoder", description: "Encode dan decode URL untuk web.", href: "/tools/url-encoder" },
  { title: "Universal Downloader", description: "Unduh file dari URL mana pun.", href: "/downloader" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-200 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">
            AllTool
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/tools" className="text-sm text-neutral-600 hover:text-neutral-900">
              Tools
            </Link>
            <Link href="/downloader" className="text-sm text-neutral-600 hover:text-neutral-900">
              Downloader
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Platform All-Tool
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-500">
            Kumpulan alat berguna untuk produktivitas harian. Cepat, bersih, dan tanpa gangguan.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block border border-neutral-200 p-6 transition-colors hover:border-neutral-900"
            >
              <h2 className="text-base font-medium text-neutral-900">{tool.title}</h2>
              <p className="mt-2 text-sm text-neutral-500">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-6 py-8">
        <div className="mx-auto max-w-5xl text-sm text-neutral-400">
          AllTool. Dibuat dengan Next.js, Vercel, dan Supabase.
        </div>
      </footer>
    </div>
  );
}
