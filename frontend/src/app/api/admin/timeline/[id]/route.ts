import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/server/db";
import { timelineItemSchema } from "@/lib/schemas/timeline.schema";
import { TimelineService } from "@/server/services/timeline.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  const { id } = await params;

  try {
    const item = await prisma.timelineItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Item tidak ditemukan." } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Error in GET /api/admin/timeline/[id]:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal mengambil data." } }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = timelineItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Input tidak valid.", details: parsed.error.format() } }, { status: 400 });
    }

    const item = await TimelineService.updateTimelineItem(id, parsed.data);
    return NextResponse.json({ success: true, data: item, message: "Item timeline berhasil diperbarui." });
  } catch (error) {
    console.error("Error in PATCH /api/admin/timeline/[id]:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal memperbarui item timeline." } }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  const { id } = await params;

  try {
    await TimelineService.deleteTimelineItem(id);
    return NextResponse.json({ success: true, message: "Item timeline berhasil dihapus." });
  } catch (error) {
    console.error("Error in DELETE /api/admin/timeline/[id]:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal menghapus item timeline." } }, { status: 500 });
  }
}
