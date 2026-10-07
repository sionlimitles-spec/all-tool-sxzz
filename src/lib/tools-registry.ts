export type Category =
  | "text" | "developer" | "image" | "calculator"
  | "security" | "media" | "utility";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: Category;
  icon: string;
  href: string;
  keywords?: string[];
}

export const CATEGORIES: { id: Category | "all"; labelKey: string }[] = [
  { id: "all", labelKey: "allCategories" },
  { id: "text", labelKey: "text" },
  { id: "developer", labelKey: "developer" },
  { id: "image", labelKey: "image" },
  { id: "calculator", labelKey: "calculator" },
  { id: "security", labelKey: "security" },
  { id: "media", labelKey: "media" },
  { id: "utility", labelKey: "utility" },
];

export const TOOLS: Tool[] = [
  // TEXT (8)
  { slug: "word-counter", name: "Word Counter", description: "Hitung kata, karakter, kalimat, dan paragraf.", category: "text", icon: "Hash", href: "/tools/word-counter", keywords: ["kata", "count"] },
  { slug: "case-converter", name: "Case Converter", description: "Ubah kapitalisasi teks dengan cepat.", category: "text", icon: "Type", href: "/tools/case-converter", keywords: ["huruf", "upper", "lower"] },
  { slug: "lorem-ipsum", name: "Lorem Ipsum", description: "Generator teks dummy untuk desain dan mockup.", category: "text", icon: "FileText", href: "/tools/lorem-ipsum" },
  { slug: "text-diff", name: "Text Diff", description: "Bandingkan dua teks dan temukan perbedaan.", category: "text", icon: "GitCompare", href: "/tools/text-diff" },
  { slug: "remove-duplicates", name: "Remove Duplicates", description: "Hapus baris duplikat dari daftar teks.", category: "text", icon: "ListX", href: "/tools/remove-duplicates" },
  { slug: "text-repeater", name: "Text Repeater", description: "Ulangi teks sebanyak yang diinginkan.", category: "text", icon: "Repeat", href: "/tools/text-repeater" },
  { slug: "fancy-text", name: "Fancy Text", description: "Ubah teks jadi gaya unik dan menarik.", category: "text", icon: "Sparkles", href: "/tools/fancy-text" },
  { slug: "reverse-text", name: "Reverse Text", description: "Balik urutan karakter dalam teks.", category: "text", icon: "ArrowLeftRight", href: "/tools/reverse-text" },

  // DEVELOPER (10)
  { slug: "json-formatter", name: "JSON Formatter", description: "Format, validasi, dan minify JSON.", category: "developer", icon: "Braces", href: "/tools/json-formatter" },
  { slug: "base64", name: "Base64 Encoder", description: "Encode dan decode teks Base64.", category: "developer", icon: "Binary", href: "/tools/base64" },
  { slug: "url-encoder", name: "URL Encoder", description: "Encode dan decode URL untuk web.", category: "developer", icon: "Link", href: "/tools/url-encoder" },
  { slug: "html-encoder", name: "HTML Encoder", description: "Encode karakter khusus HTML.", category: "developer", icon: "Code", href: "/tools/html-encoder" },
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Decode JSON Web Token dengan mudah.", category: "developer", icon: "Key", href: "/tools/jwt-decoder" },
  { slug: "hash-generator", name: "Hash Generator", description: "Buat hash MD5, SHA-1, SHA-256, SHA-512.", category: "developer", icon: "Shield", href: "/tools/hash-generator" },
  { slug: "uuid-generator", name: "UUID Generator", description: "Buat UUID v4 secara acak dan masal.", category: "developer", icon: "Fingerprint", href: "/tools/uuid-generator" },
  { slug: "regex-tester", name: "Regex Tester", description: "Uji ekspresi reguler secara langsung.", category: "developer", icon: "Search", href: "/tools/regex-tester" },
  { slug: "timestamp-converter", name: "Timestamp Converter", description: "Konversi Unix timestamp ke tanggal.", category: "developer", icon: "Clock", href: "/tools/timestamp-converter" },
  { slug: "qr-generator", name: "QR Code Generator", description: "Buat QR code dari teks atau URL.", category: "developer", icon: "QrCode", href: "/tools/qr-generator" },

  // IMAGE (4)
  { slug: "image-compressor", name: "Image Compressor", description: "Kompres gambar tanpa kehilangan kualitas.", category: "image", icon: "Minimize", href: "/tools/image-compressor" },
  { slug: "image-resizer", name: "Image Resizer", description: "Ubah ukuran gambar sesuai kebutuhan.", category: "image", icon: "Maximize", href: "/tools/image-resizer" },
  { slug: "image-to-base64", name: "Image to Base64", description: "Konversi gambar jadi Base64 data URI.", category: "image", icon: "Image", href: "/tools/image-to-base64" },
  { slug: "image-converter", name: "Image Converter", description: "Konversi antar format gambar.", category: "image", icon: "RefreshCw", href: "/tools/image-converter" },

  // CALCULATOR (5)
  { slug: "bmi-calculator", name: "BMI Calculator", description: "Hitung indeks massa tubuh Anda.", category: "calculator", icon: "Activity", href: "/tools/bmi-calculator" },
  { slug: "age-calculator", name: "Age Calculator", description: "Hitung umur dari tanggal lahir.", category: "calculator", icon: "Calendar", href: "/tools/age-calculator" },
  { slug: "percentage", name: "Percentage", description: "Hitung persentase dengan mudah.", category: "calculator", icon: "Percent", href: "/tools/percentage" },
  { slug: "loan-calculator", name: "Loan Calculator", description: "Simulasi cicilan pinjaman.", category: "calculator", icon: "Wallet", href: "/tools/loan-calculator" },
  { slug: "unit-converter", name: "Unit Converter", description: "Konversi satuan panjang, berat, suhu.", category: "calculator", icon: "Scale", href: "/tools/unit-converter" },

  // SECURITY (2)
  { slug: "password-generator", name: "Password Generator", description: "Buat password kuat dan aman.", category: "security", icon: "Lock", href: "/tools/password-generator" },
  { slug: "password-strength", name: "Password Strength", description: "Cek kekuatan password Anda.", category: "security", icon: "ShieldCheck", href: "/tools/password-strength" },

  // MEDIA (7)
  { slug: "downloader", name: "All Downloader", description: "Halaman utama pengunduh video.", category: "media", icon: "Download", href: "/downloader" },
  { slug: "youtube", name: "YouTube Downloader", description: "Unduh video YouTube kualitas tinggi.", category: "media", icon: "Youtube", href: "/downloader/youtube" },
  { slug: "tiktok", name: "TikTok Downloader", description: "Unduh TikTok tanpa watermark.", category: "media", icon: "Music", href: "/downloader/tiktok" },
  { slug: "instagram", name: "Instagram Downloader", description: "Unduh video dan foto Instagram.", category: "media", icon: "Instagram", href: "/downloader/instagram" },
  { slug: "facebook", name: "Facebook Downloader", description: "Unduh video Facebook kualitas HD.", category: "media", icon: "Facebook", href: "/downloader/facebook" },
  { slug: "temp-mail", name: "Temp Mail", description: "Email sementara untuk verifikasi.", category: "media", icon: "Mail", href: "/temp-mail" },
  { slug: "ip-lookup", name: "IP Lookup", description: "Cek lokasi dan info alamat IP.", category: "media", icon: "Globe", href: "/tools/ip-lookup" },

  // UTILITY (5)
  { slug: "color-picker", name: "Color Picker", description: "Konversi HEX, RGB, HSL dengan mudah.", category: "utility", icon: "Palette", href: "/tools/color-picker" },
  { slug: "cron-parser", name: "Cron Parser", description: "Baca ekspresi cron jadi kalimat.", category: "utility", icon: "Timer", href: "/tools/cron-parser" },
  { slug: "barcode-generator", name: "Barcode Generator", description: "Buat barcode dari teks atau angka.", category: "utility", icon: "Barcode", href: "/tools/barcode-generator" },
  { slug: "text-to-speech", name: "Text to Speech", description: "Ubah teks jadi suara.", category: "utility", icon: "Volume2", href: "/tools/text-to-speech" },
  { slug: "random-string", name: "Random String", description: "Buat string acak dengan pola khusus.", category: "utility", icon: "Shuffle", href: "/tools/random-string" },
];

export function findTool(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return TOOLS;
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords?.some((k) => k.includes(q))
  );
    }
