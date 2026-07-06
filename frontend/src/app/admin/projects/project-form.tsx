"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import { projectSchema } from "@/lib/schemas/project.schema";
import { slugify } from "@/lib/slugify";

interface Project {
  title: string;
  slug: string;
  description: string;
  content?: string | null;
  thumbnailUrl?: string | null;
  category: string;
  tags: string[];
  demoUrl?: string | null;
  repositoryUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  sortOrder: number;
}

interface ProjectFormProps {
  initialData?: Project;
  id?: string;
}

export function ProjectForm({ initialData, id }: ProjectFormProps) {
  const router = useRouter();
  const isNew = !id;

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        title: initialData.title,
        slug: initialData.slug,
        description: initialData.description,
        content: initialData.content || "",
        thumbnailUrl: initialData.thumbnailUrl || "",
        category: initialData.category,
        tagsString: initialData.tags.join(", "),
        demoUrl: initialData.demoUrl || "",
        repositoryUrl: initialData.repositoryUrl || "",
        status: initialData.status,
        isFeatured: initialData.isFeatured,
        sortOrder: initialData.sortOrder,
      };
    }
    return {
      title: "",
      slug: "",
      description: "",
      content: "",
      thumbnailUrl: "",
      category: "",
      tagsString: "",
      demoUrl: "",
      repositoryUrl: "",
      status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      isFeatured: false,
      sortOrder: 0,
    };
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: string | number | boolean = value;
    if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (name === "sortOrder") {
      parsedValue = parseInt(value) || 0;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: parsedValue };
      
      // Auto-generate slug when title changes in Create mode
      if (name === "title" && isNew) {
        updated.slug = slugify(value);
      }
      
      return updated;
    });

    // Clear field error
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setFieldErrors({});

    // Prep tags
    const tags = formData.tagsString
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      content: formData.content || null,
      thumbnailUrl: formData.thumbnailUrl || null,
      category: formData.category,
      tags,
      demoUrl: formData.demoUrl || null,
      repositoryUrl: formData.repositoryUrl || null,
      status: formData.status,
      isFeatured: formData.isFeatured,
      sortOrder: formData.sortOrder,
    };

    // Client-side Zod validation
    const parsed = projectSchema.safeParse(payload);
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
      const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        if (resData.error?.code === "SLUG_CONFLICT") {
          setFieldErrors({ slug: "Slug ini sudah terdaftar." });
          throw new Error(resData.error.message);
        }
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
        throw new Error(resData.error?.message || "Gagal menyimpan projek.");
      }

      setStatus("success");
      router.push("/admin/projects");
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
        <BrutalButton href="/admin/projects" variant="secondary" className="px-4 py-2 text-xs">
          <ArrowLeft size={14} className="mr-1" /> Kembali ke Daftar
        </BrutalButton>
        <div>
          <h1 className="heading-brutal text-3xl font-black uppercase text-ink">
            {isNew ? "Tambah Projek" : "Edit Projek"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main Fields Card */}
        <BrutalCard className="p-6 bg-surface space-y-4">
          <SectionLabel color="cyan">Informasi Projek</SectionLabel>

          {status === "error" && (
            <div className="border-[3px] border-border bg-pink p-3 font-bold text-ink shadow-[var(--shadow-hard-sm)]">
              🚨 Error: {errorMessage}
            </div>
          )}

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="title">
              Judul Projek
            </label>
            <BrutalInput
              id="title"
              name="title"
              placeholder="E-Commerce Platform"
              value={formData.title}
              onChange={handleInputChange}
              disabled={status === "loading"}
              className={fieldErrors.title ? "border-pink" : ""}
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.title}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="slug">
                Slug (URL Unique)
              </label>
              <BrutalInput
                id="slug"
                name="slug"
                placeholder="e-commerce-platform"
                value={formData.slug}
                onChange={handleInputChange}
                disabled={status === "loading"}
                className={fieldErrors.slug ? "border-pink" : ""}
              />
              {fieldErrors.slug && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.slug}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="category">
                Kategori
              </label>
              <BrutalInput
                id="category"
                name="category"
                placeholder="Web Application"
                value={formData.category}
                onChange={handleInputChange}
                disabled={status === "loading"}
                className={fieldErrors.category ? "border-pink" : ""}
              />
              {fieldErrors.category && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.category}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="tagsString">
              Tags (Pisahkan dengan koma)
            </label>
            <BrutalInput
              id="tagsString"
              name="tagsString"
              placeholder="Next.js, TailwindCSS, PostgreSQL"
              value={formData.tagsString}
              onChange={handleInputChange}
              disabled={status === "loading"}
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="description">
              Deskripsi Singkat (Max 500 Karakter)
            </label>
            <BrutalTextarea
              id="description"
              name="description"
              placeholder="Deskripsi singkat mengenai projek..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={status === "loading"}
              className={`h-24 ${fieldErrors.description ? "border-pink" : ""}`}
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.description}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="content">
              Konten / Detail Projek (Markdown didukung)
            </label>
            <BrutalTextarea
              id="content"
              name="content"
              placeholder="Tuliskan studi kasus atau rincian projek..."
              value={formData.content}
              onChange={handleInputChange}
              disabled={status === "loading"}
              className="h-44"
            />
          </div>
        </BrutalCard>

        {/* Sidebar Controls Card */}
        <div className="space-y-6">
          <BrutalCard className="p-6 bg-yellow space-y-4">
            <SectionLabel color="purple">Publish Settings</SectionLabel>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="status">
                Status Publikasi
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={status === "loading"}
                className="min-h-12 w-full border-2 border-border bg-surface px-4 py-2 text-sm font-semibold rounded-[var(--radius-sm)] shadow-[2px_2px_0_var(--color-border)] focus:outline-none focus:border-purple"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="flex items-center gap-3 border-2 border-border bg-surface p-3 shadow-[2px_2px_0_var(--color-border)]">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                checked={formData.isFeatured}
                onChange={handleCheckboxChange}
                disabled={status === "loading"}
                className="h-5 w-5 border-2 border-border rounded focus:outline-none focus:ring-0"
              />
              <label htmlFor="isFeatured" className="text-sm font-black uppercase tracking-tight cursor-pointer">
                Tampilkan di Hero/Featured
              </label>
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

          <BrutalCard className="p-6 bg-surface space-y-4">
            <SectionLabel color="pink">Links & Media</SectionLabel>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="thumbnailUrl">
                Thumbnail Image URL
              </label>
              <BrutalInput
                id="thumbnailUrl"
                name="thumbnailUrl"
                placeholder="https://images.unsplash.com/..."
                value={formData.thumbnailUrl}
                onChange={handleInputChange}
                disabled={status === "loading"}
                className={fieldErrors.thumbnailUrl ? "border-pink" : ""}
              />
              {fieldErrors.thumbnailUrl && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.thumbnailUrl}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="demoUrl">
                Demo URL
              </label>
              <BrutalInput
                id="demoUrl"
                name="demoUrl"
                placeholder="https://platform.local"
                value={formData.demoUrl}
                onChange={handleInputChange}
                disabled={status === "loading"}
                className={fieldErrors.demoUrl ? "border-pink" : ""}
              />
              {fieldErrors.demoUrl && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.demoUrl}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="repositoryUrl">
                Repository URL (GitHub)
              </label>
              <BrutalInput
                id="repositoryUrl"
                name="repositoryUrl"
                placeholder="https://github.com/..."
                value={formData.repositoryUrl}
                onChange={handleInputChange}
                disabled={status === "loading"}
                className={fieldErrors.repositoryUrl ? "border-pink" : ""}
              />
              {fieldErrors.repositoryUrl && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.repositoryUrl}</p>
              )}
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
                <Save size={18} /> Simpan Projek
              </>
            )}
          </BrutalButton>
        </div>
      </form>
    </div>
  );
}
