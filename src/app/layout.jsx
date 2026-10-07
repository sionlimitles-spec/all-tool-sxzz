import "./globals.css";

export const metadata = {
  title: "AllTool - 40+ Alat Serbaguna Gratis",
  description: "Downloader TikTok, YouTube, temp mail, dan 40+ tools gratis dalam satu platform.",
  keywords: ["alltool", "tools", "downloader", "tiktok", "youtube", "temp mail"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7c3aed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
