import { prisma } from "../db";
import { type ProjectInput } from "../../lib/schemas/project.schema";

export class ProjectService {
  static async getPublishedProjects() {
    return prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });
  }

  static async getFeaturedProjects() {
    return prisma.project.findMany({
      where: {
        status: "PUBLISHED",
        isFeatured: true,
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  static async getProjectBySlug(slug: string) {
    return prisma.project.findUnique({
      where: { slug },
    });
  }

  static async getAllProjects() {
    return prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  static async createProject(data: ProjectInput) {
    return prisma.project.create({
      data,
    });
  }

  static async updateProject(id: string, data: Partial<ProjectInput>) {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  static async deleteProject(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }
}
