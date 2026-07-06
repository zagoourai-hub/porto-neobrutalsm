import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { TestimonialService } from "@/server/services/testimonial.service";
import { testimonialSchema } from "@/lib/schemas/testimonial.schema";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Akses ditolak." } }, { status: 401 });
  }

  try {
    const testimonials = await TestimonialService.getAllTestimonials();
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("Error in GET /api/admin/testimonials:", error);
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
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Input tidak valid.", details: parsed.error.format() } }, { status: 400 });
    }

    const testimonial = await TestimonialService.createTestimonial(parsed.data);
    return NextResponse.json({ success: true, data: testimonial, message: "Testimoni berhasil dibuat." });
  } catch (error) {
    console.error("Error in POST /api/admin/testimonials:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Gagal membuat testimoni." } }, { status: 500 });
  }
}
