"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { Search, X } from "lucide-react";
import { TOOLS } from "@/lib/tools-registry";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";

interface Props { open: boolean; onClose: () => void }

export default function CommandPalette({ open, onClose }: Props) {
  const router = useRouter();
  const { lang } = useSettings();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return TOOLS.slice(0, 12);
    return TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords?.some((k) => k.includes(q))
    ).slice(0, 20);
  }, [query]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter" && filtered[selected]) {
        router.push(filtered[selected].href);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selected, onClose, router]);

  if (!open) return null;

  const IconsAny = Icons as unknown as Record<
    string,
    React.ComponentType<{ size?: number; color?: string }>
  >;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[10vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-3 border-b px-4 py-3"
          style={{ borderColor: "var(--border)" }}
        >
          <Search size={18} style={{ color: "var(--text-muted)" }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, "search")}
            className="flex-1 border-none bg-transparent text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
          <button onClick={onClose} className="btn-ghost p-1" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              {t(lang, "noResults")}
            </div>
          )}
          {filtered.map((tool, i) => {
            const IconComp = IconsAny[tool.icon] ?? Icons.Wrench;
            return (
              <button
                key={tool.slug}
                onClick={() => {
                  router.push(tool.href);
                  onClose();
                }}
                onMouseEnter={() => setSelected(i)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                style={{
                  background: selected === i ? "var(--primary-soft)" : "transparent",
                }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "var(--card)" }}
                >
                  <IconComp size={16} color="var(--primary)" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium" style={{ color: "var(--text)" }}>
                    {tool.name}
                  </div>
                  <div className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                    {tool.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="flex items-center justify-between border-t px-4 py-2 text-[10px]"
          style={{ borderColor: "var(--border)", color: "var(--text-soft)" }}
        >
          <span>Enter untuk buka</span>
          <span>Esc untuk tutup</span>
        </div>
      </div>
    </div>
  );
        }
