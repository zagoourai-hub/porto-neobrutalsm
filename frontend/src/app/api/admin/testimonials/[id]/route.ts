import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/server/db";
import { testimonialSchema } from "@/lib/schemas/testimonial.schema";
import { TestimonialService } from "@/server/services/testimonial.service";

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
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Testimoni tidak ditemukan." } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Error in GET /api/admin/testimonials/[id]:", error);
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
    const parsed = testimonialSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Input tidak valid.", details: parsed.error.format() } }, { status: 400 });
    }

    const testimonial = await TestimonialService.updateTestimonial(id, parsed.data);
    return NextResponse.json({ success: true, data: testimonial, message: "Testimoni berhasil diperbarui." });
  } catch (error) {
    console.error("Error in PATCH /api/admin/testimonials/[id]:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal memperbarui testimoni." } }, { status: 500 });
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
    await TestimonialService.deleteTestimonial(id);
    return NextResponse.json({ success: true, message: "Testimoni berhasil dihapus." });
  } catch (error) {
    console.error("Error in DELETE /api/admin/testimonials/[id]:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal menghapus testimoni." } }, { status: 500 });
  }
}
