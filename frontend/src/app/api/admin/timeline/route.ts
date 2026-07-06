import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { timelineItemSchema } from "@/lib/schemas/timeline.schema";
import { TimelineService } from "@/server/services/timeline.service";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  try {
    const items = await TimelineService.getAllTimelineItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Error in GET /api/admin/timeline:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal mengambil data." } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = timelineItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Input tidak valid.", details: parsed.error.format() } }, { status: 400 });
    }

    const item = await TimelineService.createTimelineItem(parsed.data);

    return NextResponse.json({ success: true, data: item, message: "Item timeline berhasil dibuat." });
  } catch (error) {
    console.error("Error in POST /api/admin/timeline:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal membuat item timeline." } }, { status: 500 });
  }
}
