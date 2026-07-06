import { z } from "zod";

export const siteContentSchema = z.object({
  key: z.string().min(2, "Key minimal 2 karakter."),
  value: z.string(),
  type: z.enum(["TEXT", "JSON", "IMAGE", "URL"]).default("TEXT"),
});

export type SiteContentInput = z.infer<typeof siteContentSchema>;
