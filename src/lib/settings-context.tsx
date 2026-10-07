"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { LangCode } from "./i18n";

type Theme = "light" | "dark" | "system";
type Accent = "violet" | "blue" | "emerald" | "rose" | "amber" | "pink";
type FontSize = "small" | "medium" | "large";

interface Settings {
  lang: LangCode;
  theme: Theme;
  accent: Accent;
  fontSize: FontSize;
  favorites: string[];
}

interface SettingsContextValue extends Settings {
  setLang: (l: LangCode) => void;
  setTheme: (t: Theme) => void;
  setAccent: (a: Accent) => void;
  setFontSize: (f: FontSize) => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  reset: () => void;
  isDark: boolean;
}

const defaultSettings: Settings = {
  lang: "id",
  theme: "system",
  accent: "violet",
  fontSize: "medium",
  favorites: [],
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const ACCENTS: Record<Accent, { primary: string; hover: string; soft: string; border: string }> = {
  violet: { primary: "#7c3aed", hover: "#6d28d9", soft: "#ede9fe", border: "#d8b4fe" },
  blue: { primary: "#2563eb", hover: "#1d4ed8", soft: "#dbeafe", border: "#93c5fd" },
  emerald: { primary: "#059669", hover: "#047857", soft: "#d1fae5", border: "#6ee7b7" },
  rose: { primary: "#e11d48", hover: "#be123c", soft: "#ffe4e6", border: "#fda4af" },
  amber: { primary: "#d97706", hover: "#b45309", soft: "#fef3c7", border: "#fcd34d" },
  pink: { primary: "#db2777", hover: "#be185d", soft: "#fce7f3", border: "#f9a8d4" },
};

const DARK_ACCENTS: Record<Accent, { primary: string; hover: string; soft: string }> = {
  violet: { primary: "#a78bfa", hover: "#c4b5fd", soft: "#2e1065" },
  blue: { primary: "#60a5fa", hover: "#93c5fd", soft: "#1e3a8a" },
  emerald: { primary: "#34d399", hover: "#6ee7b7", soft: "#064e3b" },
  rose: { primary: "#fb7185", hover: "#fda4af", soft: "#881337" },
  amber: { primary: "#fbbf24", hover: "#fcd34d", soft: "#78350f" },
  pink: { primary: "#f472b6", hover: "#f9a8d4", soft: "#831843" },
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("alltool-settings");
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {}
    }
    setMounted(true);
  }, []);

  const applyTheme = useCallback((theme: Theme, accent: Accent, fontSize: FontSize) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    let effective: "light" | "dark" = "light";
    if (theme === "system") {
      effective = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      effective = theme;
    }

    root.setAttribute("data-theme", effective);
    root.setAttribute("data-fontsize", fontSize);
    setIsDark(effective === "dark");

    if (effective === "dark") {
      const acc = DARK_ACCENTS[accent];
      root.style.setProperty("--primary", acc.primary);
      root.style.setProperty("--primary-hover", acc.hover);
      root.style.setProperty("--primary-soft", acc.soft);
      root.style.setProperty("--border", "#2e1065");
      root.style.setProperty("--border-strong", "#5b21b6");
    } else {
      const acc = ACCENTS[accent];
      root.style.setProperty("--primary", acc.primary);
      root.style.setProperty("--primary-hover", acc.hover);
      root.style.setProperty("--primary-soft", acc.soft);
      root.style.setProperty("--border", "#ede9fe");
      root.style.setProperty("--border-strong", acc.border);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("alltool-settings", JSON.stringify(settings));
    applyTheme(settings.theme, settings.accent, settings.fontSize);

    if (settings.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system", settings.accent, settings.fontSize);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [settings, mounted, applyTheme]);

  const value: SettingsContextValue = {
    ...settings,
    isDark,
    setLang: (lang) => setSettings((s) => ({ ...s, lang })),
    setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
    setAccent: (accent) => setSettings((s) => ({ ...s, accent })),
    setFontSize: (fontSize) => setSettings((s) => ({ ...s, fontSize })),
    toggleFavorite: (slug) =>
      setSettings((s) => ({
        ...s,
        favorites: s.favorites.includes(slug)
          ? s.favorites.filter((f) => f !== slug)
          : [...s.favorites, slug],
      })),
    isFavorite: (slug) => settings.favorites.includes(slug),
    reset: () => {
      setSettings(defaultSettings);
      localStorage.removeItem("alltool-settings");
      localStorage.removeItem("alltool-recent");
    },
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
    }
