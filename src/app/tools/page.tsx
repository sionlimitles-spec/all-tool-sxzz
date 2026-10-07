import Link from "next/link";

const tools = [
  { title: "JSON Formatter", href: "/tools/json-formatter" },
  { title: "Base64 Encoder", href: "/tools/base64" },
  { title: "Word Counter", href: "/tools/word-counter" },
  { title: "Case Converter", href: "/tools/case-converter" },
  { title: "URL Encoder", href: "/tools/url-encoder" },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-200 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">
            AllTool
          </Link>
          <Link href="/downloader" className="text-sm text-neutral-600 hover:text-neutral-900">
            Downloader
          </Link>
        </div>
      </nav>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Semua Tools</h1>
          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block border border-neutral-200 px-5 py-4 text-sm text-neutral-900 transition-colors hover:border-neutral-900"
              >
                {tool.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
