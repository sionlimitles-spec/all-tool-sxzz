import "./globals.css";

export const metadata = {
  title: "AllTool Pro - 40+ Alat Serbaguna Gratis",
  description: "Downloader TikTok & YouTube tanpa watermark, temp mail, JSON formatter, dan 40+ tools gratis.",
  keywords: ["alltool", "downloader", "tiktok", "youtube", "temp mail"],
};

export const viewport = {
  width: "device-width", initialScale: 1, maximumScale: 5,
  themeColor: "#7c3aed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
