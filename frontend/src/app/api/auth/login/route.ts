import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db";
import { createSessionCookie } from "@/lib/session";

// In-memory login rate limit map
const loginAttempts = new Map<string, { count: number; windowStart: number }>();
const LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

function isLoginRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  
  if (!attempt) {
    loginAttempts.set(ip, { count: 1, windowStart: now });
    return false;
  }
  
  if (now - attempt.windowStart > LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, windowStart: now });
    return false;
  }
  
  attempt.count += 1;
  if (attempt.count > MAX_ATTEMPTS) {
    return true;
  }
  return false;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isLoginRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Terlalu banyak percobaan login. Silakan coba dalam 1 menit.",
          },
        },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email dan password wajib diisi.",
          },
        },
        { status: 400 }
      );
    }

    // Find admin user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Email atau password salah.",
          },
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Email atau password salah.",
          },
        },
        { status: 401 }
      );
    }

    // Set Secure httpOnly Cookie Session
    await createSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
    });
  } catch (error) {
    console.error("Error in POST /api/auth/login:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan internal.",
        },
      },
      { status: 500 }
    );
  }
}
