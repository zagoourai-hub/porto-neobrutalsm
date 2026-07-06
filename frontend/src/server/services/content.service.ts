import { prisma } from "../db";
import { type SiteContentInput } from "../../lib/schemas/content.schema";
import { type SiteContentType } from "../../../generated/prisma/client";

export class ContentService {
  static async getContentByKey(key: string) {
    return prisma.siteContent.findUnique({
      where: { key },
    });
  }

  static async getAllContent() {
    const contents = await prisma.siteContent.findMany();
    // Return key-value dictionary for easy consumption
    return contents.reduce((acc, curr) => {
      acc[curr.key] = {
        value: curr.value,
        type: curr.type,
      };
      return acc;
    }, {} as Record<string, { value: string; type: SiteContentType }>);
  }

  static async setContent(data: SiteContentInput) {
    return prisma.siteContent.upsert({
      where: { key: data.key },
      update: {
        value: data.value,
        type: data.type as SiteContentType,
      },
      create: {
        key: data.key,
        value: data.value,
        type: data.type as SiteContentType,
      },
    });
  }
}
