import { prisma } from "../db";
import { type SiteSettingInput } from "../../lib/schemas/settings.schema";
import { Prisma } from "../../../generated/prisma/client";

export class SettingService {
  static async getSettings() {
    let settings = await prisma.siteSetting.findFirst();
    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          siteTitle: "RiszDev - Fullstack Developer & UI/UX Designer",
          siteDescription: "Portfolio fullstack developer dan UI/UX designer Indonesia yang membantu bisnis membangun website, aplikasi, dan produk digital modern.",
        },
      });
    }
    return settings;
  }

  static async updateSettings(data: SiteSettingInput) {
    const settings = await prisma.siteSetting.findFirst();
    
    // Cast socialLinks safely to Prisma InputJsonValue
    const socialLinksJson = (data.socialLinks ?? undefined) as Prisma.InputJsonValue | undefined;

    if (settings) {
      return prisma.siteSetting.update({
        where: { id: settings.id },
        data: {
          siteTitle: data.siteTitle,
          siteDescription: data.siteDescription,
          ogTitle: data.ogTitle,
          ogDescription: data.ogDescription,
          ogImage: data.ogImage,
          faviconUrl: data.faviconUrl,
          contactEmail: data.contactEmail,
          phoneNumber: data.phoneNumber,
          whatsappNumber: data.whatsappNumber,
          socialLinks: socialLinksJson,
        },
      });
    } else {
      return prisma.siteSetting.create({
        data: {
          siteTitle: data.siteTitle,
          siteDescription: data.siteDescription,
          ogTitle: data.ogTitle,
          ogDescription: data.ogDescription,
          ogImage: data.ogImage,
          faviconUrl: data.faviconUrl,
          contactEmail: data.contactEmail,
          phoneNumber: data.phoneNumber,
          whatsappNumber: data.whatsappNumber,
          socialLinks: socialLinksJson,
        },
      });
    }
  }
}
