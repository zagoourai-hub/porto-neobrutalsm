import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter.").max(100),
  role: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  avatarUrl: z.string().url("Format URL tidak valid.").or(z.literal("")).optional().nullable(),
  rating: z.number().int().min(1, "Rating minimal 1.").max(5, "Rating maksimal 5."),
  content: z.string().min(5, "Konten minimal 5 karakter.").max(1000),
  status: z.enum(["PENDING", "APPROVED", "HIDDEN"]).default("PENDING"),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
