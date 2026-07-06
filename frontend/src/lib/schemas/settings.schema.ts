import { z } from "zod";

export const siteSettingSchema = z.object({
  siteTitle: z.string().min(2, "Site title minimal 2 karakter.").max(100),
  siteDescription: z.string().max(300, "Site description maksimal 300 karakter."),
  ogTitle: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogImage: z.string().url("Format URL tidak valid.").or(z.literal("")).optional().nullable(),
  faviconUrl: z.string().url("Format URL tidak valid.").or(z.literal("")).optional().nullable(),
  contactEmail: z.string().email("Format email tidak valid.").or(z.literal("")).optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  socialLinks: z.record(z.string(), z.string().url("Format URL tidak valid.")).optional().nullable(),
});

export type SiteSettingInput = z.infer<typeof siteSettingSchema>;
