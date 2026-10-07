"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Wrench, Download, Mail, Settings, Info, X, Sparkles, Heart,
} from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";

interface Props { open: boolean; onClose: () => void }

export default function Sidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const { lang, favorites } = useSettings();

  const items = [
    { href: "/", label: t(lang, "home"), icon: Home },
    { href: "/tools", label: t(lang, "tools"), icon: Wrench },
    { href: "/downloader", label: t(lang, "downloader"), icon: Download },
    { href: "/temp-mail", label: t(lang, "tempMail"), icon: Mail },
    { href: "/settings", label: t(lang, "settings"), icon: Settings },
    { href: "/about", label: t(lang, "about"), icon: Info },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between p-5">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "var(--primary)" }}
            >
              <Sparkles size={18} color="var(--primary-fg)" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold gradient-text leading-tight">AllTool</span>
              <span className="text-[10px] leading-tight" style={{ color: "var(--text-soft)" }}>
                Pro v2.0
              </span>
            </div>
          </Link>
          <button onClick={onClose} className="btn-ghost p-1.5 md:hidden" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
                style={{
                  background: active ? "var(--primary)" : "transparent",
                  color: active ? "var(--primary-fg)" : "var(--text)",
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {favorites.length > 0 && (
          <div className="border-t px-3 py-3" style={{ borderColor: "var(--border)" }}>
            <div className="mb-2 flex items-center gap-2 px-3 text-[11px] font-semibold uppercase" style={{ color: "var(--text-soft)" }}>
              <Heart size={12} />
              {t(lang, "favorites")} ({favorites.length})
            </div>
          </div>
        )}

        <div className="border-t px-3 py-3" style={{ borderColor: "var(--border)" }}>
          <div
            className="rounded-xl p-3 text-center text-[11px]"
            style={{ background: "var(--primary-soft)", color: "var(--text-muted)" }}
          >
            Made with Next.js + Vercel
          </div>
        </div>
      </aside>
    </>
  );
                }
