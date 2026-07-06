import { NextResponse } from "next/server";
import { destroySessionCookie } from "@/lib/session";

export async function POST() {
  await destroySessionCookie();
  return NextResponse.json({
    success: true,
    message: "Logout berhasil.",
  });
}
