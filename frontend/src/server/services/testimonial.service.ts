import { prisma } from "../db";
import { type TestimonialInput } from "../../lib/schemas/testimonial.schema";

export class TestimonialService {
  static async getApprovedTestimonials() {
    return prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllTestimonials() {
    return prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async createTestimonial(data: TestimonialInput) {
    return prisma.testimonial.create({
      data,
    });
  }

  static async updateTestimonial(id: string, data: Partial<TestimonialInput>) {
    return prisma.testimonial.update({
      where: { id },
      data,
    });
  }

  static async deleteTestimonial(id: string) {
    return prisma.testimonial.delete({
      where: { id },
    });
  }
}
