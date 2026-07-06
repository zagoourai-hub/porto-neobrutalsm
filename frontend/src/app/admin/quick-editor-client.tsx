"use client";

import { useState } from "react";
import { Save, Eye } from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";

interface QuickEditorProps {
  initialTitle: string;
  initialSubtitle: string;
  initialBio: string;
}

export function QuickEditorClient({
  initialTitle,
  initialSubtitle,
  initialBio,
}: QuickEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [bio, setBio] = useState(initialBio);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "hero.title": title,
          "hero.subtitle": subtitle,
          "about.bio": bio,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error?.message || "Gagal memperbarui konten.");
      }

      setStatus("success");
      setMessage("Konten berhasil diperbarui!");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="content-editor">
      <BrutalCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-border bg-purple/10 px-5 py-3">
          <SectionLabel color="purple">Editor Konten</SectionLabel>
          <span className="text-xs font-black uppercase text-ink/65">Quick Edit</span>
        </div>
        <div className="p-5 space-y-4">
          {status === "success" && (
            <div className="border-2 border-border bg-yellow p-3 text-xs font-black shadow-[2px_2px_0_var(--color-border)]">
              🎉 {message}
            </div>
          )}
          {status === "error" && (
            <div className="border-2 border-border bg-pink p-3 text-xs font-black shadow-[2px_2px_0_var(--color-border)] text-ink">
              🚨 {message}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-ink block" htmlFor="heroHeadline">
                Hero Headline
              </label>
              <span className="text-[10px] font-bold text-ink/50">{title.length} / 60</span>
            </div>
            <textarea
              id="heroHeadline"
              className="w-full border-2 border-border p-3 font-semibold text-sm bg-surface shadow-[var(--shadow-hard-sm)] focus:outline-none focus:ring-2 focus:ring-purple"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 60))}
              rows={2}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-ink block" htmlFor="heroSubheadline">
                Subheadline
              </label>
              <span className="text-[10px] font-bold text-ink/50">{subtitle.length} / 60</span>
            </div>
            <textarea
              id="heroSubheadline"
              className="w-full border-2 border-border p-3 font-semibold text-sm bg-surface shadow-[var(--shadow-hard-sm)] focus:outline-none focus:ring-2 focus:ring-purple"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value.slice(0, 60))}
              rows={2}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-ink block" htmlFor="aboutBio">
                Tentang Saya (Excerpt)
              </label>
              <span className="text-[10px] font-bold text-ink/50">{bio.length} / 160</span>
            </div>
            <textarea
              id="aboutBio"
              className="w-full border-2 border-border p-3 font-semibold text-sm bg-surface shadow-[var(--shadow-hard-sm)] focus:outline-none focus:ring-2 focus:ring-purple"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center gap-2 border-2 border-border bg-purple px-4 py-2.5 text-xs font-black uppercase text-white shadow-[var(--shadow-hard-sm)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-border)] disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} />
              {loading ? "Menyimpan..." : "Simpan Draft"}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-border bg-yellow px-4 py-2.5 text-xs font-black uppercase text-ink shadow-[var(--shadow-hard-sm)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-border)] text-center cursor-pointer"
            >
              <Eye size={14} />
              Preview
            </a>
          </div>
        </div>
      </BrutalCard>
    </div>
  );
}
