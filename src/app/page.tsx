"use client";

import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import ToolCard from "@/components/tool-card";
import CommandPalette from "@/components/command-palette";
import { TOOLS, CATEGORIES } from "@/lib/tools-registry";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";
import { Heart, Sparkles, Zap, Shield, Globe } from "lucide-react";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { lang, favorites } = useSettings();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(
    () => TOOLS.filter((tool) => activeCategory === "all" || tool.category === activeCategory),
    [activeCategory]
  );

  const favTools = useMemo(
    () => TOOLS.filter((tool) => favorites.includes(tool.slug)),
    [favorites]
  );

  return (
    <div className="min-h-screen bg-gradient-page">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <div className="md:ml-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onSearchClick={() => setPaletteOpen(true)}
        />
        <main className="px-4 py-8 md:px-8">
          <section className="mb-10">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium mb-4"
              style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--primary)" }}
            >
              <Sparkles size={12} />
              {TOOLS.length} tools • {t(lang, "version")} 2.0
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl leading-tight">
              <span className="gradient-text">{t(lang, "heroTitle")}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base" style={{ color: "var(--text-muted)" }}>
              {t(lang, "heroSubtitle")}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { icon: Zap, label: "Cepat", value: "Instan" },
                { icon: Shield, label: "Aman", value: "Privasi" },
                { icon: Globe, label: "Global", value: "50 Bahasa" },
                { icon: Sparkles, label: "Gratis", value: "Selamanya" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="card p-4">
                    <Icon size={20} style={{ color: "var(--primary)" }} />
                    <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      {s.label}
                    </div>
                    <div className="text-sm font-semibold">{s.value}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {favTools.length > 0 && (
            <section className="mb-10">
              <div className="mb-4 flex items-center gap-2">
                <Heart size={16} fill="var(--primary)" color="var(--primary)" />
                <h2 className="text-lg font-semibold">{t(lang, "favorites")}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {favTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="mb-4 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`chip ${activeCategory === cat.id ? "chip-active" : ""}`}
                >
                  {t(lang, cat.labelKey)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center" style={{ color: "var(--text-muted)" }}>
                {t(lang, "noResults")}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
                }
