"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import { StatusBadge } from "@/components/ui/status-badge";

const statusColors = {
  DRAFT: "gray" as const,
  PUBLISHED: "green" as const,
  ARCHIVED: "red" as const,
};

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Confirm delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status,
      });
      const res = await fetch(`/api/admin/projects?${query}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.data.projects);
        setTotal(data.data.total);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
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
        const query = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          search,
          status,
        });
        const res = await fetch(`/api/admin/projects?${query}`);
        const data = await res.json();
        if (active && res.ok && data.success) {
          setProjects(data.data.projects);
          setTotal(data.data.total);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    runFetch();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProjects();
        setDeleteId(null);
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-brutal text-4xl font-black uppercase text-ink">Projects</h1>
          <p className="text-sm font-semibold text-ink/70">Kelola dan publikasikan proyek portofolio Anda.</p>
        </div>
        <BrutalButton href="/admin/projects/new" className="px-4 py-2 text-sm">
          <Plus size={16} className="mr-1" /> Tambah Projek
        </BrutalButton>
      </div>

      {/* Filter and Search Bar */}
      <BrutalCard className="p-4 bg-surface shadow-[var(--shadow-hard-sm)]">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
            <BrutalInput
              type="text"
              placeholder="Cari berdasarkan judul atau deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="min-h-12 border-2 border-border bg-surface px-4 py-2 text-sm font-semibold rounded-[var(--radius-sm)] shadow-[2px_2px_0_var(--color-border)] focus:outline-none focus:border-purple"
            >
              <option value="">Semua Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
            
            <BrutalButton type="submit" className="min-h-12 px-5 py-2">
              Cari
            </BrutalButton>
          </div>
        </form>
      </BrutalCard>

      {/* Projects Table / Cards */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-purple" size={40} />
        </div>
      ) : projects.length === 0 ? (
        <BrutalCard className="p-10 text-center font-bold bg-surface">
          <p className="text-xl">Tidak ada projek ditemukan.</p>
        </BrutalCard>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden border-[3px] border-border bg-surface shadow-[var(--shadow-hard-md)] md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-[3px] border-border bg-yellow">
                  <th className="p-4 font-black text-sm uppercase">Judul</th>
                  <th className="p-4 font-black text-sm uppercase">Category</th>
                  <th className="p-4 font-black text-sm uppercase">Status</th>
                  <th className="p-4 font-black text-sm uppercase">Sort Order</th>
                  <th className="p-4 font-black text-sm uppercase text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-yellow/5">
                    <td className="p-4 font-bold">
                      <p>{p.title}</p>
                      <p className="text-xs font-semibold text-ink/50 truncate max-w-xs">{p.slug}</p>
                    </td>
                    <td className="p-4 font-bold text-sm">{p.category}</td>
                    <td className="p-4 font-bold">
                      <StatusBadge color={statusColors[p.status]}>{p.status}</StatusBadge>
                    </td>
                    <td className="p-4 font-bold text-sm">{p.sortOrder}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="inline-flex h-9 w-9 items-center justify-center border-2 border-border bg-surface shadow-[2px_2px_0_var(--color-border)] hover:bg-yellow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(p.id)}
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
            {projects.map((p) => (
              <BrutalCard key={p.id} className="p-4 bg-surface">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black leading-tight">{p.title}</h3>
                    <p className="text-xs font-bold text-ink/50 mt-0.5">{p.category} • Order: {p.sortOrder}</p>
                  </div>
                  <StatusBadge color={statusColors[p.status]}>{p.status}</StatusBadge>
                </div>
                
                <div className="mt-4 flex justify-end gap-3 border-t-2 border-border pt-3">
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="flex-1 min-h-10 text-xs font-black border-2 border-border bg-surface flex items-center justify-center gap-1 shadow-[2px_2px_0_var(--color-border)]"
                  >
                    <Edit2 size={12} /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="flex-1 min-h-10 text-xs font-black border-2 border-border bg-pink flex items-center justify-center gap-1 shadow-[2px_2px_0_var(--color-border)] cursor-pointer"
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </BrutalCard>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-[3px] border-border bg-surface p-4 shadow-[var(--shadow-hard-sm)] font-bold">
              <span className="text-sm font-semibold">
                Halaman {page} dari {totalPages} ({total} projek)
              </span>
              <div className="flex gap-3">
                <BrutalButton
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs min-h-9 flex items-center gap-1 disabled:opacity-40"
                  variant="secondary"
                >
                  <ArrowLeft size={14} /> Prev
                </BrutalButton>
                <BrutalButton
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 text-xs min-h-9 flex items-center gap-1 disabled:opacity-40"
                  variant="secondary"
                >
                  Next <ArrowRight size={14} />
                </BrutalButton>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-sm">
            <BrutalCard className="p-6 bg-surface shadow-[var(--shadow-hard-lg)]">
              <SectionLabel color="pink">Hapus Projek?</SectionLabel>
              <p className="mt-4 text-sm font-semibold leading-relaxed">
                Apakah Anda yakin ingin menghapus projek ini secara permanen? Tindakan ini tidak dapat dibatalkan.
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
