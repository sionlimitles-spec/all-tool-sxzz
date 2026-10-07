"use client";

import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import CommandPalette from "./command-palette";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function ToolLayout({ title, description, children, icon }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

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
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-start gap-4">
              {icon && (
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: "var(--primary-soft)" }}
                >
                  {icon}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold tracking-tight gradient-text">{title}</h1>
                {description && (
                  <p className="mt-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                    {description}
                  </p>
                )}
              </div>
            </div>
            <div className="animate-fade-in">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
