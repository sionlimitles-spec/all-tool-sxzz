"use client";

import Link from "next/link";
import { Menu, Search, Settings, Moon, Sun } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";

interface Props {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export default function Header({ onMenuClick, onSearchClick }: Props) {
  const { lang, theme, setTheme, isDark } = useSettings();

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-3 border-b px-4 py-3 backdrop-blur-xl md:px-8"
      style={{
        background: isDark ? "rgba(10,1,24,0.7)" : "rgba(255,255,255,0.7)",
        borderColor: "var(--border)",
      }}
    >
      <button
        onClick={onMenuClick}
        className="btn-ghost p-2 md:hidden"
        aria-label="Menu"
      >
        <Menu size={20} />
      </button>

      <button
        onClick={onSearchClick}
        className="flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all hover:border-[var(--primary)]"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          color: "var(--text-muted)",
        }}
      >
        <Search size={16} />
        <span className="flex-1 text-left">{t(lang, "search")}</span>
        <kbd
          className="hidden rounded border px-1.5 py-0.5 text-[10px] md:inline-block"
          style={{ borderColor: "var(--border)" }}
        >
          Ctrl K
        </kbd>
      </button>

      <button
        onClick={toggleTheme}
        className="btn-ghost p-2"
        aria-label="Toggle theme"
        title={isDark ? t(lang, "theme_light") : t(lang, "theme_dark")}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <Link href="/settings" className="btn-ghost p-2" aria-label="Settings">
        <Settings size={20} />
      </Link>
    </header>
  );
}
