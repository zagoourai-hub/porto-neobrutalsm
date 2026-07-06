import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { SettingService } from "@/server/services/setting.service";
import { siteSettingSchema } from "@/lib/schemas/settings.schema";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  try {
    const settings = await SettingService.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error in GET /api/admin/settings:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal mengambil data." } }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = siteSettingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Input tidak valid.", details: parsed.error.format() } }, { status: 400 });
    }

    const settings = await SettingService.updateSettings(parsed.data);
    return NextResponse.json({ success: true, data: settings, message: "Pengaturan berhasil diperbarui." });
  } catch (error) {
    console.error("Error in PATCH /api/admin/settings:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal memperbarui pengaturan." } }, { status: 500 });
  }
}
