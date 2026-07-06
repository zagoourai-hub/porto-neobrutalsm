import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter.").max(100, "Nama maksimal 100 karakter."),
  email: z.string().email("Format email tidak valid."),
  subject: z.string().min(3, "Subjek minimal 3 karakter.").max(150, "Subjek maksimal 150 karakter."),
  message: z.string().min(10, "Pesan minimal 10 karakter.").max(2000, "Pesan maksimal 2000 karakter."),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
