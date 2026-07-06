import { z } from "zod";

export const timelineItemSchema = z.object({
  year: z.string().min(4, "Format tahun tidak valid.").max(10),
  title: z.string().min(3, "Judul minimal 3 karakter.").max(100),
  description: z.string().min(5, "Deskripsi minimal 5 karakter.").max(500),
  icon: z.string().optional().nullable(),
  accentColor: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export type TimelineItemInput = z.infer<typeof timelineItemSchema>;
