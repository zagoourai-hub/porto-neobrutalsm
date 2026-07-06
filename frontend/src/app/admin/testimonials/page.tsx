"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, EyeOff, Check, Star, Loader2 } from "lucide-react";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalCard } from "@/components/ui/brutal-card";
import { StatusBadge } from "@/components/ui/status-badge";

interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  avatarUrl?: string | null;
  rating: number;
  content: string;
  status: "PENDING" | "APPROVED" | "HIDDEN";
}

const statusColors = {
  PENDING: "yellow" as const,
  APPROVED: "green" as const,
  HIDDEN: "gray" as const,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Action loading states
  const [actionId, setActionId] = useState<string | null>(null);



  useEffect(() => {
    let active = true;
    const runFetch = async () => {
      await Promise.resolve();
      if (!active) return;
      
      setLoading(true);
      try {
        const res = await fetch("/api/admin/testimonials");
        const data = await res.json();
        if (active && res.ok && data.success) {
          setTestimonials(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    runFetch();
    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: "APPROVED" | "HIDDEN") => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus testimoni ini secara permanen?")) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
    } finally {
      setActionId(null);
    }
  };

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase()) ||
      (t.company && t.company.toLowerCase().includes(search.toLowerCase())) ||
      (t.role && t.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-brutal text-4xl font-black uppercase text-ink">Testimonials</h1>
        <p className="text-sm font-semibold text-ink/70">Kelola testimoni klien untuk ditampilkan di landing page.</p>
      </div>

      {/* Search Bar */}
      <BrutalCard className="p-4 bg-surface shadow-[var(--shadow-hard-sm)]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
          <BrutalInput
            type="text"
            placeholder="Cari berdasarkan nama, perusahaan, atau isi testimoni..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12"
          />
        </div>
      </BrutalCard>

      {/* Testimonials Grid / List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-purple" size={40} />
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <BrutalCard className="p-10 text-center font-bold bg-surface">
          <p className="text-xl">Tidak ada testimoni ditemukan.</p>
        </BrutalCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTestimonials.map((t) => (
            <BrutalCard key={t.id} className="p-6 bg-surface flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 border-2 border-border bg-yellow flex items-center justify-center font-black text-lg uppercase shadow-[2px_2px_0_var(--color-border)] overflow-hidden">
                      {t.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.avatarUrl} alt={t.name} className="h-full w-full object-cover" />
                      ) : (
                        t.name.slice(0, 2)
                      )}
                    </div>
                    <div>
                      <h3 className="font-black leading-tight text-base">{t.name}</h3>
                      <p className="text-xs font-bold text-ink/60 mt-0.5">{t.role} {t.company ? `at ${t.company}` : ""}</p>
                    </div>
                  </div>
                  <StatusBadge color={statusColors[t.status]}>{t.status}</StatusBadge>
                </div>

                {/* Rating display */}
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < t.rating ? "fill-yellow text-ink" : "text-ink/20"}
                    />
                  ))}
                </div>

                <p className="text-sm font-semibold text-ink/80 leading-relaxed mt-4 italic">
                  &quot;{t.content}&quot;
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 border-t-2 border-border pt-4">
                {t.status !== "APPROVED" && (
                  <button
                    onClick={() => handleStatusChange(t.id, "APPROVED")}
                    disabled={actionId === t.id}
                    className="min-h-10 px-3 border-2 border-border bg-green font-black text-xs uppercase flex items-center gap-1 shadow-[2px_2px_0_var(--color-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] transition cursor-pointer disabled:opacity-50"
                  >
                    <Check size={14} /> Approve
                  </button>
                )}
                {t.status !== "HIDDEN" && (
                  <button
                    onClick={() => handleStatusChange(t.id, "HIDDEN")}
                    disabled={actionId === t.id}
                    className="min-h-10 px-3 border-2 border-border bg-surface font-black text-xs uppercase flex items-center gap-1 shadow-[2px_2px_0_var(--color-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] transition cursor-pointer disabled:opacity-50"
                  >
                    <EyeOff size={14} /> Hide
                  </button>
                )}
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={actionId === t.id}
                  className="min-h-10 px-3 border-2 border-border bg-pink font-black text-xs uppercase flex items-center gap-1 shadow-[2px_2px_0_var(--color-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] transition cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </BrutalCard>
          ))}
        </div>
      )}
    </div>
  );
}
