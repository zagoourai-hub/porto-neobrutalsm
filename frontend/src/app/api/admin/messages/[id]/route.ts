import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { MessageService } from "@/server/services/message.service";

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
    const message = await MessageService.getMessageById(id);
    if (!message) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Pesan tidak ditemukan." } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Error in GET /api/admin/messages/[id]:", error);
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
    const { isRead } = body;

    if (typeof isRead !== "boolean") {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Input isRead wajib berupa boolean." } }, { status: 400 });
    }

    const message = await MessageService.markAsRead(id, isRead);
    return NextResponse.json({ success: true, data: message, message: `Pesan berhasil ditandai sebagai ${isRead ? "sudah" : "belum"} dibaca.` });
  } catch (error) {
    console.error("Error in PATCH /api/admin/messages/[id]:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal memperbarui status pesan." } }, { status: 500 });
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
    await MessageService.deleteMessage(id);
    return NextResponse.json({ success: true, message: "Pesan berhasil dihapus." });
  } catch (error) {
    console.error("Error in DELETE /api/admin/messages/[id]:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal menghapus pesan." } }, { status: 500 });
  }
}
