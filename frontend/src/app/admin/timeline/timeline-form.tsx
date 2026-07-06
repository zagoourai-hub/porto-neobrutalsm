"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import { timelineItemSchema } from "@/lib/schemas/timeline.schema";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon?: string | null;
  accentColor?: string | null;
  sortOrder: number;
}

interface TimelineFormProps {
  initialData?: TimelineItem;
  id?: string;
}

export function TimelineForm({ initialData, id }: TimelineFormProps) {
  const router = useRouter();
  const isNew = !id;

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        year: initialData.year,
        title: initialData.title,
        description: initialData.description,
        icon: initialData.icon || "",
        accentColor: initialData.accentColor || "",
        sortOrder: initialData.sortOrder,
      };
    }
    return {
      year: "",
      title: "",
      description: "",
      icon: "",
      accentColor: "",
      sortOrder: 0,
    };
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | number = value;
    if (name === "sortOrder") {
      parsedValue = parseInt(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));

    // Clear field error
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setFieldErrors({});

    const payload = {
      year: formData.year,
      title: formData.title,
      description: formData.description,
      icon: formData.icon || null,
      accentColor: formData.accentColor || null,
      sortOrder: formData.sortOrder,
    };

    // Client Zod validation
    const parsed = timelineItemSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFieldErrors(errors);
      setStatus("idle");
      return;
    }

    try {
      const url = isNew ? "/api/admin/timeline" : `/api/admin/timeline/${id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        if (resData.error?.code === "VALIDATION_ERROR" && resData.error.details) {
          const errors: Record<string, string> = {};
          const details = resData.error.details;
          Object.keys(details).forEach((key) => {
            if (details[key]?._errors?.[0]) {
              errors[key] = details[key]._errors[0];
            }
          });
          setFieldErrors(errors);
          throw new Error("Terdapat kesalahan input.");
        }
        throw new Error(resData.error?.message || "Gagal menyimpan item.");
      }

      setStatus("success");
      router.push("/admin/timeline");
      router.refresh();
    } catch (err) {
      console.error(err);
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan server.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BrutalButton href="/admin/timeline" variant="secondary" className="px-4 py-2 text-xs">
          <ArrowLeft size={14} className="mr-1" /> Kembali ke Daftar
        </BrutalButton>
        <div>
          <h1 className="heading-brutal text-3xl font-black uppercase text-ink">
            {isNew ? "Tambah Item Timeline" : "Edit Item Timeline"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <BrutalCard className="p-6 bg-surface space-y-4">
          <SectionLabel color="yellow">Rincian Karir / Pendidikan</SectionLabel>

          {status === "error" && (
            <div className="border-[3px] border-border bg-pink p-3 font-bold text-ink shadow-[var(--shadow-hard-sm)]">
              🚨 Error: {errorMessage}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="year">
                Tahun / Periode
              </label>
              <BrutalInput
                id="year"
                name="year"
                placeholder="2024 - Sekarang"
                value={formData.year}
                onChange={handleInputChange}
                disabled={status === "loading"}
                className={fieldErrors.year ? "border-pink" : ""}
              />
              {fieldErrors.year && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.year}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="title">
                Judul / Peran Pekerjaan
              </label>
              <BrutalInput
                id="title"
                name="title"
                placeholder="Senior Fullstack Developer"
                value={formData.title}
                onChange={handleInputChange}
                disabled={status === "loading"}
                className={fieldErrors.title ? "border-pink" : ""}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.title}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="description">
              Deskripsi Detail (Max 500 Karakter)
            </label>
            <BrutalTextarea
              id="description"
              name="description"
              placeholder="Jelaskan kontribusi, pencapaian, atau rincian peran Anda..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={status === "loading"}
              className={`h-40 ${fieldErrors.description ? "border-pink" : ""}`}
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.description}</p>
            )}
          </div>
        </BrutalCard>

        <div className="space-y-6">
          <BrutalCard className="p-6 bg-yellow space-y-4">
            <SectionLabel color="purple">Visual & Urutan</SectionLabel>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="icon">
                Nama Icon Lucide (Optional)
              </label>
              <BrutalInput
                id="icon"
                name="icon"
                placeholder="briefcase"
                value={formData.icon}
                onChange={handleInputChange}
                disabled={status === "loading"}
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="accentColor">
                Warna Aksen / Badge (Optional)
              </label>
              <BrutalInput
                id="accentColor"
                name="accentColor"
                placeholder="yellow / cyan / pink / purple"
                value={formData.accentColor}
                onChange={handleInputChange}
                disabled={status === "loading"}
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="sortOrder">
                Urutan Tampilan (Sort Order)
              </label>
              <BrutalInput
                id="sortOrder"
                name="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={handleInputChange}
                disabled={status === "loading"}
              />
            </div>
          </BrutalCard>

          <BrutalButton
            type="submit"
            disabled={status === "loading"}
            className="w-full min-h-12 py-3 flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} /> Simpan Item
              </>
            )}
          </BrutalButton>
        </div>
      </form>
    </div>
  );
}
