import { prisma } from "../db";
import { type TimelineItemInput } from "../../lib/schemas/timeline.schema";

export class TimelineService {
  static async getTimelineItems() {
    return prisma.timelineItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  static async getAllTimelineItems() {
    return prisma.timelineItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  static async createTimelineItem(data: TimelineItemInput) {
    return prisma.timelineItem.create({
      data,
    });
  }

  static async updateTimelineItem(id: string, data: Partial<TimelineItemInput>) {
    return prisma.timelineItem.update({
      where: { id },
      data,
    });
  }

  static async deleteTimelineItem(id: string) {
    return prisma.timelineItem.delete({
      where: { id },
    });
  }
}
