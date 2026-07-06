import { prisma } from "../db";

export interface DashboardStats {
  totalProjects: number;
  totalTimelineItems: number;
  unreadMessagesCount: number;
  approvedTestimonialsCount: number;
}

export class StatsService {
  static async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalProjects,
      totalTimelineItems,
      unreadMessagesCount,
      approvedTestimonialsCount
    ] = await Promise.all([
      prisma.project.count(),
      prisma.timelineItem.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.testimonial.count({ where: { status: "APPROVED" } })
    ]);

    return {
      totalProjects,
      totalTimelineItems,
      unreadMessagesCount,
      approvedTestimonialsCount
    };
  }
}
