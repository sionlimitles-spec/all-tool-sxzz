import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL wajib diisi." }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "URL tidak valid." }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "Protokol tidak didukung." }, { status: 400 });
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gagal mengambil file (status ${response.status}).` },
        { status: 502 }
      );
    }

    const contentDisposition = response.headers.get("content-disposition");
    let fileName = "download";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+?)"?$/);
      if (match) fileName = match[1];
    } else {
      const parts = parsed.pathname.split("/");
      const last = parts[parts.length - 1];
      if (last && last.includes(".")) fileName = last;
    }

    const headers = new Headers();
    headers.set(
      "Content-Type",
      response.headers.get("content-type") || "application/octet-stream"
    );
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);

    return new NextResponse(response.body, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
