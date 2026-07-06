import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/server/db";
import { projectSchema } from "@/lib/schemas/project.schema";
import { ProjectService } from "@/server/services/project.service";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const skip = (page - 1) * limit;

  // Build query where clause
  const where: {
    OR?: {
      title?: { contains: string; mode: "insensitive" };
      description?: { contains: string; mode: "insensitive" };
    }[];
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  } = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }
  if (status) {
    where.status = status as "DRAFT" | "PUBLISHED" | "ARCHIVED";
  }

  try {
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        skip,
        take: limit,
      }),
      prisma.project.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: { projects, total, page, limit }
    });
  } catch (error) {
    console.error("Error in GET /api/admin/projects:", error);
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
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Input tidak valid.", details: parsed.error.format() } }, { status: 400 });
    }

    // Check unique slug conflict
    const existing = await prisma.project.findUnique({
      where: { slug: parsed.data.slug }
    });
    if (existing) {
      return NextResponse.json({
        success: false,
        error: {
          code: "SLUG_CONFLICT",
          message: "Slug sudah digunakan oleh projek lain.",
          details: { slug: { _errors: ["Slug ini sudah terdaftar."] } }
        }
      }, { status: 400 });
    }

    const project = await ProjectService.createProject(parsed.data);

    return NextResponse.json({ success: true, data: project, message: "Projek berhasil dibuat." });
  } catch (error) {
    console.error("Error in POST /api/admin/projects:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal membuat projek." } }, { status: 500 });
  }
}
