import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/server/db";
import { projectSchema } from "@/lib/schemas/project.schema";
import { ProjectService } from "@/server/services/project.service";

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
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Projek tidak ditemukan." } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Error in GET /api/admin/projects/[id]:", error);
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
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Input tidak valid.", details: parsed.error.format() } }, { status: 400 });
    }

    // Check if slug belongs to another project
    const existing = await prisma.project.findFirst({
      where: {
        slug: parsed.data.slug,
        id: { not: id }
      }
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

    const project = await ProjectService.updateProject(id, parsed.data);
    return NextResponse.json({ success: true, data: project, message: "Projek berhasil diperbarui." });
  } catch (error) {
    console.error("Error in PATCH /api/admin/projects/[id]:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal memperbarui projek." } }, { status: 500 });
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
    await ProjectService.deleteProject(id);
    return NextResponse.json({ success: true, message: "Projek berhasil dihapus." });
  } catch (error) {
    console.error("Error in DELETE /api/admin/projects/[id]:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal menghapus projek." } }, { status: 500 });
  }
}
