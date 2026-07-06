import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { MessageService } from "@/server/services/message.service";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  try {
    const messages = await MessageService.getAllMessages();
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error in GET /api/admin/messages:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal mengambil data." } }, { status: 500 });
  }
}
