import { NextResponse } from "next/server";
import { contactMessageSchema } from "@/lib/schemas/contact.schema";
import { MessageService } from "@/server/services/message.service";

// Simple in-memory rate limit map: ip -> timestamps
const rateLimitMap = new Map<string, number[]>();
const LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // Max 3 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps outside window
  const activeTimestamps = timestamps.filter(ts => now - ts < LIMIT_WINDOW);
  
  if (activeTimestamps.length >= MAX_REQUESTS) {
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.",
          },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    
    // Validate request body using Zod
    const parsed = contactMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Input tidak valid.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    // Save message to database via service
    const message = await MessageService.createMessage(parsed.data);

    return NextResponse.json({
      success: true,
      data: message,
      message: "Pesan berhasil dikirim.",
    });
  } catch (error) {
    console.error("Error in POST /api/contact:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan internal server.",
        },
      },
      { status: 500 }
    );
  }
}
