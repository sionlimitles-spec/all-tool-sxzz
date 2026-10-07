"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import ToolCard from "@/components/tool-card";
import CommandPalette from "@/components/command-palette";
import { TOOLS, CATEGORIES } from "@/lib/tools-registry";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";

export default function ToolsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { lang } = useSettings();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = TOOLS.filter(
    (tool) => activeCategory === "all" || tool.category === activeCategory
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
          <h1 className="text-3xl font-bold tracking-tight gradient-text">{t(lang, "tools")}</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {TOOLS.length} alat tersedia.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
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

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
