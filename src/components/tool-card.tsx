"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { Heart } from "lucide-react";
import { Tool } from "@/lib/tools-registry";
import { useSettings } from "@/lib/settings-context";

export default function ToolCard({ tool }: { tool: Tool }) {
  const { isFavorite, toggleFavorite } = useSettings();
  const fav = isFavorite(tool.slug);

  const IconsAny = Icons as unknown as Record<
    string,
    React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
  >;
  const IconComp = IconsAny[tool.icon] ?? Icons.Wrench;

  return (
    <div className="card card-interactive group relative">
      <Link href={tool.href} className="flex flex-col gap-3 p-5">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
          style={{ background: "var(--primary-soft)" }}
        >
          <IconComp size={22} color="var(--primary)" strokeWidth={2} />
        </div>
        <div className="pr-6">
          <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--text)" }}>
            {tool.name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {tool.description}
          </p>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(tool.slug);
        }}
        className="absolute right-3 top-3 rounded-lg p-1.5 transition-colors hover:bg-[var(--primary-soft)]"
        aria-label="Favorite"
      >
        <Heart
          size={14}
          fill={fav ? "var(--primary)" : "none"}
          color={fav ? "var(--primary)" : "var(--text-soft)"}
        />
      </button>
    </div>
  );
}
