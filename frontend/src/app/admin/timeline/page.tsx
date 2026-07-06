"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Loader2 } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  icon?: string | null;
  accentColor?: string | null;
  sortOrder: number;
}

export default function AdminTimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Confirm delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/timeline");
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const runFetch = async () => {
      await Promise.resolve();
      if (!active) return;
      
      setLoading(true);
      try {
        const res = await fetch("/api/admin/timeline");
        const data = await res.json();
        if (active && res.ok && data.success) {
          setItems(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch timeline:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    runFetch();
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/timeline/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchTimeline();
        setDeleteId(null);
      }
    } catch (err) {
      console.error("Failed to delete timeline item:", err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.year.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-brutal text-4xl font-black uppercase text-ink">Timeline</h1>
          <p className="text-sm font-semibold text-ink/70">Kelola riwayat karir dan pendidikan Anda.</p>
        </div>
        <BrutalButton href="/admin/timeline/new" className="px-4 py-2 text-sm">
          <Plus size={16} className="mr-1" /> Tambah Item
        </BrutalButton>
      </div>

      {/* Search Bar */}
      <BrutalCard className="p-4 bg-surface shadow-[var(--shadow-hard-sm)]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
          <BrutalInput
            type="text"
            placeholder="Cari berdasarkan tahun, judul, atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12"
          />
        </div>
      </BrutalCard>

      {/* Timeline Table / Cards */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-purple" size={40} />
        </div>
      ) : filteredItems.length === 0 ? (
        <BrutalCard className="p-10 text-center font-bold bg-surface">
          <p className="text-xl">Tidak ada item timeline ditemukan.</p>
        </BrutalCard>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden border-[3px] border-border bg-surface shadow-[var(--shadow-hard-md)] md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-[3px] border-border bg-yellow">
                  <th className="p-4 font-black text-sm uppercase w-24">Tahun</th>
                  <th className="p-4 font-black text-sm uppercase">Judul / Peran</th>
                  <th className="p-4 font-black text-sm uppercase">Deskripsi</th>
                  <th className="p-4 font-black text-sm uppercase w-28">Sort Order</th>
                  <th className="p-4 font-black text-sm uppercase w-24 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-yellow/5">
                    <td className="p-4 font-black text-sm">{item.year}</td>
                    <td className="p-4 font-bold">
                      <p>{item.title}</p>
                      {item.icon && <span className="text-[10px] bg-cyan px-2 py-0.5 border border-border mt-1 inline-block uppercase font-black">Icon: {item.icon}</span>}
                    </td>
                    <td className="p-4 font-semibold text-sm leading-relaxed max-w-sm truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td className="p-4 font-bold text-sm">{item.sortOrder}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/timeline/${item.id}/edit`}
                        className="inline-flex h-9 w-9 items-center justify-center border-2 border-border bg-surface shadow-[2px_2px_0_var(--color-border)] hover:bg-yellow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="inline-flex h-9 w-9 items-center justify-center border-2 border-border bg-pink shadow-[2px_2px_0_var(--color-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {filteredItems.map((item) => (
              <BrutalCard key={item.id} className="p-4 bg-surface">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black bg-yellow border-2 border-border px-2.5 py-1 shadow-[1px_1px_0_var(--color-border)]">{item.year}</span>
                    <h3 className="text-lg font-black leading-tight mt-3">{item.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-ink/50">Order: {item.sortOrder}</span>
                </div>
                <p className="text-xs font-semibold text-ink/80 mt-3 leading-relaxed">{item.description}</p>
                
                <div className="mt-4 flex justify-end gap-3 border-t-2 border-border pt-3">
                  <Link
                    href={`/admin/timeline/${item.id}/edit`}
                    className="flex-1 min-h-10 text-xs font-black border-2 border-border bg-surface flex items-center justify-center gap-1 shadow-[2px_2px_0_var(--color-border)]"
                  >
                    <Edit2 size={12} /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="flex-1 min-h-10 text-xs font-black border-2 border-border bg-pink flex items-center justify-center gap-1 shadow-[2px_2px_0_var(--color-border)] cursor-pointer"
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </BrutalCard>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-sm">
            <BrutalCard className="p-6 bg-surface shadow-[var(--shadow-hard-lg)]">
              <SectionLabel color="pink">Hapus Item?</SectionLabel>
              <p className="mt-4 text-sm font-semibold leading-relaxed">
                Apakah Anda yakin ingin menghapus item ini secara permanen dari timeline?
              </p>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="min-h-11 px-4 border-2 border-border bg-surface font-bold text-sm shadow-[2px_2px_0_var(--color-border)] hover:bg-yellow/10 cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="min-h-11 px-4 border-2 border-border bg-pink font-bold text-sm text-ink shadow-[2px_2px_0_var(--color-border)] hover:bg-pink-600 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="animate-spin" size={14} /> : null}
                  Hapus
                </button>
              </div>
            </BrutalCard>
          </div>
        </div>
      )}
    </div>
  );
}
