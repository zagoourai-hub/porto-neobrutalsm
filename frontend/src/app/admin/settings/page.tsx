"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Save, Loader2, Globe, Mail, Share2, Search } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import { siteSettingSchema } from "@/lib/schemas/settings.schema";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    siteTitle: "",
    siteDescription: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    faviconUrl: "",
    contactEmail: "",
    phoneNumber: "",
    whatsappNumber: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    instagramUrl: "",
  });

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      await Promise.resolve();
      if (!active) return;
      
      setLoading(true);
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (active && res.ok && data.success) {
          const settings = data.data;
          const socials = (settings.socialLinks as Record<string, string>) || {};
          
          setFormData({
            siteTitle: settings.siteTitle || "",
            siteDescription: settings.siteDescription || "",
            ogTitle: settings.ogTitle || "",
            ogDescription: settings.ogDescription || "",
            ogImage: settings.ogImage || "",
            faviconUrl: settings.faviconUrl || "",
            contactEmail: settings.contactEmail || "",
            phoneNumber: settings.phoneNumber || "",
            whatsappNumber: settings.whatsappNumber || "",
            githubUrl: socials.github || socials.githubUrl || "",
            linkedinUrl: socials.linkedin || socials.linkedinUrl || "",
            twitterUrl: socials.twitter || socials.twitterUrl || "",
            instagramUrl: socials.instagram || socials.instagramUrl || "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      active = false;
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

    // Construct socialLinks
    const socialLinks: Record<string, string> = {};
    if (formData.githubUrl.trim()) socialLinks.github = formData.githubUrl.trim();
    if (formData.linkedinUrl.trim()) socialLinks.linkedin = formData.linkedinUrl.trim();
    if (formData.twitterUrl.trim()) socialLinks.twitter = formData.twitterUrl.trim();
    if (formData.instagramUrl.trim()) socialLinks.instagram = formData.instagramUrl.trim();

    const payload = {
      siteTitle: formData.siteTitle,
      siteDescription: formData.siteDescription,
      ogTitle: formData.ogTitle || null,
      ogDescription: formData.ogDescription || null,
      ogImage: formData.ogImage || null,
      faviconUrl: formData.faviconUrl || null,
      contactEmail: formData.contactEmail || null,
      phoneNumber: formData.phoneNumber || null,
      whatsappNumber: formData.whatsappNumber || null,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : null,
    };

    // Client-side Zod validation
    const parsed = siteSettingSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) {
          if (path === "socialLinks") {
            // map socialLink records error specifically
            const subPath = issue.path[1];
            if (subPath) {
              errors[`${String(subPath)}Url`] = issue.message;
            } else {
              errors.socialLinks = issue.message;
            }
          } else {
            errors[String(path)] = issue.message;
          }
        }
      });
      setFieldErrors(errors);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
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
        throw new Error(resData.error?.message || "Gagal menyimpan pengaturan.");
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan server.";
      setErrorMessage(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-purple" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-brutal text-4xl font-black uppercase text-ink">Settings</h1>
        <p className="text-sm font-semibold text-ink/70">Konfigurasi metadata, media sosial, dan kontak website.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {status === "success" && (
          <div className="border-[3px] border-border bg-green p-3 font-black text-ink shadow-[var(--shadow-hard-sm)]">
            🎉 Pengaturan berhasil disimpan!
          </div>
        )}

        {status === "error" && (
          <div className="border-[3px] border-border bg-pink p-3 font-black text-ink shadow-[var(--shadow-hard-sm)]">
            🚨 Error: {errorMessage}
          </div>
        )}

        {/* Section 1: General Info */}
        <BrutalCard className="p-6 bg-surface space-y-4">
          <SectionLabel color="cyan" className="flex items-center gap-1.5 w-fit">
            <Globe size={14} /> Umum & Metadata Web
          </SectionLabel>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="siteTitle">
              Judul Website (Site Title)
            </label>
            <BrutalInput
              id="siteTitle"
              name="siteTitle"
              placeholder="RiszDev - Fullstack Developer Portfolio"
              value={formData.siteTitle}
              onChange={handleInputChange}
              className={fieldErrors.siteTitle ? "border-pink" : ""}
            />
            {fieldErrors.siteTitle && (
              <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.siteTitle}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="siteDescription">
              Deskripsi Website (Site Description)
            </label>
            <BrutalTextarea
              id="siteDescription"
              name="siteDescription"
              placeholder="Masukkan deskripsi singkat tentang portofolio Anda..."
              value={formData.siteDescription}
              onChange={handleInputChange}
              className={`h-24 ${fieldErrors.siteDescription ? "border-pink" : ""}`}
            />
            {fieldErrors.siteDescription && (
              <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.siteDescription}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="faviconUrl">
                Favicon URL
              </label>
              <BrutalInput
                id="faviconUrl"
                name="faviconUrl"
                placeholder="https://domain.com/favicon.ico"
                value={formData.faviconUrl}
                onChange={handleInputChange}
                className={fieldErrors.faviconUrl ? "border-pink" : ""}
              />
              {fieldErrors.faviconUrl && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.faviconUrl}</p>
              )}
            </div>
          </div>
        </BrutalCard>

        {/* Section 2: Contact Info */}
        <BrutalCard className="p-6 bg-yellow space-y-4">
          <SectionLabel color="purple" className="flex items-center gap-1.5 w-fit">
            <Mail size={14} /> Informasi Kontak
          </SectionLabel>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="contactEmail">
                Email Kontak
              </label>
              <BrutalInput
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="hello@riszdev.dev"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className={fieldErrors.contactEmail ? "border-pink" : ""}
              />
              {fieldErrors.contactEmail && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.contactEmail}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="phoneNumber">
                No. Telepon
              </label>
              <BrutalInput
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+628123456789"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="whatsappNumber">
                No. WhatsApp
              </label>
              <BrutalInput
                id="whatsappNumber"
                name="whatsappNumber"
                placeholder="628123456789"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </BrutalCard>

        {/* Section 3: Social Links */}
        <BrutalCard className="p-6 bg-surface space-y-4">
          <SectionLabel color="cyan" className="flex items-center gap-1.5 w-fit">
            <Share2 size={14} /> Tautan Media Sosial
          </SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="githubUrl">
                GitHub URL
              </label>
              <BrutalInput
                id="githubUrl"
                name="githubUrl"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className={fieldErrors.githubUrl ? "border-pink" : ""}
              />
              {fieldErrors.githubUrl && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.githubUrl}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="linkedinUrl">
                LinkedIn URL
              </label>
              <BrutalInput
                id="linkedinUrl"
                name="linkedinUrl"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                className={fieldErrors.linkedinUrl ? "border-pink" : ""}
              />
              {fieldErrors.linkedinUrl && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.linkedinUrl}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="twitterUrl">
                Twitter URL
              </label>
              <BrutalInput
                id="twitterUrl"
                name="twitterUrl"
                placeholder="https://twitter.com/username"
                value={formData.twitterUrl}
                onChange={handleInputChange}
                className={fieldErrors.twitterUrl ? "border-pink" : ""}
              />
              {fieldErrors.twitterUrl && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.twitterUrl}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="instagramUrl">
                Instagram URL
              </label>
              <BrutalInput
                id="instagramUrl"
                name="instagramUrl"
                placeholder="https://instagram.com/username"
                value={formData.instagramUrl}
                onChange={handleInputChange}
                className={fieldErrors.instagramUrl ? "border-pink" : ""}
              />
              {fieldErrors.instagramUrl && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.instagramUrl}</p>
              )}
            </div>
          </div>
        </BrutalCard>

        {/* Section 4: SEO & OpenGraph */}
        <BrutalCard className="p-6 bg-pink space-y-4">
          <SectionLabel color="purple" className="flex items-center gap-1.5 w-fit">
            <Search size={14} /> Open Graph (SEO Sharing)
          </SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="ogTitle">
                OG Title (Sharing Title)
              </label>
              <BrutalInput
                id="ogTitle"
                name="ogTitle"
                placeholder="Sharing Title"
                value={formData.ogTitle}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="ogImage">
                OG Image URL (Sharing Image)
              </label>
              <BrutalInput
                id="ogImage"
                name="ogImage"
                placeholder="https://domain.com/og-image.jpg"
                value={formData.ogImage}
                onChange={handleInputChange}
                className={fieldErrors.ogImage ? "border-pink" : ""}
              />
              {fieldErrors.ogImage && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.ogImage}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="ogDescription">
              OG Description (Sharing Description)
            </label>
            <BrutalTextarea
              id="ogDescription"
              name="ogDescription"
              placeholder="Masukkan deskripsi SEO sharing..."
              value={formData.ogDescription}
              onChange={handleInputChange}
              className="h-20"
            />
          </div>
        </BrutalCard>

        <BrutalButton
          type="submit"
          disabled={status === "loading"}
          className="min-h-12 w-full py-3 flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Menyimpan...
            </>
          ) : (
            <>
              <Save size={18} /> Simpan Pengaturan
            </>
          )}
        </BrutalButton>
      </form>
    </div>
  );
}
