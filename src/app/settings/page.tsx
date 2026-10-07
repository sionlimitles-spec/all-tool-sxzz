"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import CommandPalette from "@/components/command-palette";
import { useSettings } from "@/lib/settings-context";
import { LANGUAGES, t } from "@/lib/i18n";
import { Trash2, Search, Check } from "lucide-react";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const s = useSettings();
  const { lang } = s;

  const accents = [
    { id: "violet", color: "#7c3aed" },
    { id: "blue", color: "#2563eb" },
    { id: "emerald", color: "#059669" },
    { id: "rose", color: "#e11d48" },
    { id: "amber", color: "#d97706" },
    { id: "pink", color: "#db2777" },
  ] as const;

  const filteredLangs = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.native.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-page">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <div className="md:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} onSearchClick={() => setPaletteOpen(true)} />
        <main className="px-4 py-8 md:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold gradient-text">{t(lang, "settings")}</h1>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Sesuaikan tampilan, bahasa, dan preferensi aplikasi.
            </p>

            <div className="mt-8 space-y-4">
              <Card title={t(lang, "theme")}>
                <div className="flex flex-wrap gap-2">
                  {(["light", "dark", "system"] as const).map((th) => (
                    <button
                      key={th}
                      onClick={() => s.setTheme(th)}
                      className={`chip ${s.theme === th ? "chip-active" : ""}`}
                    >
                      {t(lang, th)}
                    </button>
                  ))}
                </div>
              </Card>

              <Card title={t(lang, "accentColor")}>
                <div className="flex flex-wrap gap-3">
                  {accents.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => s.setAccent(a.id)}
                      className="flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
                      style={{
                        background: a.color,
                        outline: s.accent === a.id ? "3px solid var(--primary)" : "none",
                        outlineOffset: "3px",
                      }}
                      aria-label={a.id}
                    >
                      {s.accent === a.id && <Check size={18} color="#fff" />}
                    </button>
                  ))}
                </div>
              </Card>

              <Card title={t(lang, "fontSize")}>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((fs) => (
                    <button
                      key={fs}
                      onClick={() => s.setFontSize(fs)}
                      className={`chip ${s.fontSize === fs ? "chip-active" : ""}`}
                    >
                      {t(lang, fs)}
                    </button>
                  ))}
                </div>
              </Card>

              <Card title={`${t(lang, "language")} (${LANGUAGES.length})`}>
                <div className="relative mb-3">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    placeholder="Cari bahasa..."
                    className="input pl-9"
                  />
                </div>
                <div
                  className="max-h-64 overflow-y-auto rounded-xl border"
                  style={{ borderColor: "var(--border)" }}
                >
                  {filteredLangs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => s.setLang(l.code)}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--primary-soft)]"
                      style={{
                        background: s.lang === l.code ? "var(--primary-soft)" : "transparent",
                        color: "var(--text)",
                      }}
                    >
                      <div>
                        <span className="font-medium">{l.native}</span>
                        <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
                          {l.name}
                        </span>
                      </div>
                      {s.lang === l.code && <Check size={14} style={{ color: "var(--primary)" }} />}
                    </button>
                  ))}
                </div>
              </Card>

              <Card title={t(lang, "resetData")}>
                <p className="mb-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  {t(lang, "resetWarning")}
                </p>
                <button onClick={s.reset} className="btn-secondary" style={{ color: "#e11d48", borderColor: "#e11d48" }}>
                  <Trash2 size={14} />
                  {t(lang, "resetData")}
                </button>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text)" }}>
        {title}
      </h2>
      {children}
    </div>
  );
                      }
