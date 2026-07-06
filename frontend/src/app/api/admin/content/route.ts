import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ContentService } from "@/server/services/content.service";
import { z } from "zod";

const quickEditSchema = z.object({
  "hero.title": z.string().min(1, "Hero headline cannot be empty"),
  "hero.subtitle": z.string().min(1, "Subheadline cannot be empty"),
  "about.bio": z.string().min(1, "Tentang saya cannot be empty"),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = quickEditSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Input tidak valid.", details: parsed.error.format() } }, { status: 400 });
    }

    const updates = parsed.data;
    await Promise.all([
      ContentService.setContent({ key: "hero.title", value: updates["hero.title"], type: "TEXT" }),
      ContentService.setContent({ key: "hero.subtitle", value: updates["hero.subtitle"], type: "TEXT" }),
      ContentService.setContent({ key: "about.bio", value: updates["about.bio"], type: "TEXT" }),
    ]);

    return NextResponse.json({ success: true, message: "Konten berhasil diperbarui." });
  } catch (error) {
    console.error("Error in POST /api/admin/content:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal memperbarui konten." } }, { status: 500 });
  }
}
