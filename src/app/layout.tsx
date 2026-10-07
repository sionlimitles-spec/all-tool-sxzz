import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";

export const metadata: Metadata = {
  title: "AllTool Pro - 40+ Alat Serbaguna",
  description: "40+ tools gratis: downloader TikTok, YouTube, Instagram, temp mail, JSON formatter, dan lainnya.",
  keywords: ["alltool", "downloader", "tiktok downloader", "youtube downloader", "temp mail"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7c3aed",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
