import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter.").max(150, "Judul maksimal 150 karakter."),
  slug: z.string().min(3, "Slug minimal 3 karakter.").regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan strip."),
  description: z.string().min(10, "Deskripsi minimal 10 karakter.").max(500, "Deskripsi maksimal 500 karakter."),
  content: z.string().optional().nullable(),
  thumbnailUrl: z.string().url("Format URL tidak valid.").or(z.literal("")).optional().nullable(),
  category: z.string().min(2, "Kategori minimal 2 karakter."),
  tags: z.array(z.string()).default([]),
  demoUrl: z.string().url("Format URL tidak valid.").or(z.literal("")).optional().nullable(),
  repositoryUrl: z.string().url("Format URL tidak valid.").or(z.literal("")).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;
