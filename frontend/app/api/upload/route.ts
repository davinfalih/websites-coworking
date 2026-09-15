// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

function fileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    ensureUploadDir();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }

    const ext = fileExtension(file.name) || ".png";
    const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    if (!allowed.includes(ext)) {
      return NextResponse.json(
        { message: "Format file tidak didukung. Gunakan PNG, JPG, JPEG, WEBP, atau GIF." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Ukuran file maksimal 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${randomUUID()}${ext}`;
    const dest = path.join(uploadDir, filename);
    fs.writeFileSync(dest, buffer);

    return NextResponse.json({
      success: true,
      message: "File berhasil diunggah",
      data: { url: `/uploads/${filename}` },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Gagal mengunggah file." },
      { status: 500 }
    );
  }
}