import Link from "next/link";
import {
  ArrowUpRight,
  FolderGit2,
  MessageSquare,
  Star,
  Plus,
  Pencil,
  Check,
  Clock,
  Eye,
} from "lucide-react";
import { StatsService } from "@/server/services/stats.service";
import { ProjectService } from "@/server/services/project.service";
import { MessageService } from "@/server/services/message.service";
import { ContentService } from "@/server/services/content.service";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import { formatDate } from "@/lib/format-date";
import { QuickEditorClient } from "./quick-editor-client";

export const revalidate = 0; // Disable cache for admin overview

export default async function AdminDashboardPage() {
  const [
    stats,
    projects,
    messages,
    content,
  ] = await Promise.all([
    StatsService.getDashboardStats(),
    ProjectService.getAllProjects().then((p) => p.slice(0, 3)),
    MessageService.getAllMessages().then((m) => m.slice(0, 3)),
    ContentService.getAllContent(),
  ]);

  const heroTitle = content["hero.title"]?.value || "HI, I'M RISZDEV";
  const heroSubtitle =
    content["hero.subtitle"]?.value || "Saya membangun produk digital yang fungsional, estetis, dan berdampak...";
  const aboutBio =
    content["about.bio"]?.value || "Halo! Saya RiszDev, seorang pengembang full-stack dan desainer UI/UX...";

  const accentPalettes = [
    "from-purple/30 via-surface to-purple/10",
    "from-cyan/30 via-surface to-blue-100",
    "from-pink/30 via-surface to-red/10",
  ];

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h1 className="heading-brutal text-4xl font-black uppercase text-ink">
          Dashboard
        </h1>
        <p className="text-sm font-semibold text-ink/70">
          Ikhtisar data portofolio dan pembaruan konten secara cepat.
        </p>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects */}
        <BrutalCard className="p-4 flex items-center justify-between bg-surface relative">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-ink/65">Total Projects</p>
            <p className="text-3xl font-black mt-1 leading-none">{stats.totalProjects}</p>
            <p className="text-[9px] font-black text-green-600 mt-1 flex items-center gap-0.5">
              <span>↑ 12% dari bulan lalu</span>
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-yellow text-black shadow-[var(--shadow-hard-sm)] shrink-0">
            <FolderGit2 size={20} />
          </div>
        </BrutalCard>

        {/* Pesan Baru */}
        <BrutalCard className="p-4 flex items-center justify-between bg-surface relative">
          {stats.unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-border bg-pink text-[9px] font-black text-ink shadow-[1px_1px_0_var(--color-border)]">
              {stats.unreadMessagesCount}
            </span>
          )}
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-ink/65">Pesan Baru</p>
            <p className="text-3xl font-black mt-1 leading-none">{stats.unreadMessagesCount}</p>
            <p className="text-[9px] font-black text-green-600 mt-1 flex items-center gap-0.5">
              <span>↑ 8% dari minggu lalu</span>
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-cyan text-black shadow-[var(--shadow-hard-sm)] shrink-0">
            <MessageSquare size={20} />
          </div>
        </BrutalCard>

        {/* Testimoni */}
        <BrutalCard className="p-4 flex items-center justify-between bg-surface relative">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-ink/65">Testimoni</p>
            <p className="text-3xl font-black mt-1 leading-none">{stats.approvedTestimonialsCount}</p>
            <p className="text-[9px] font-black text-green-600 mt-1 flex items-center gap-0.5">
              <span>↑ 15% dari bulan lalu</span>
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-pink text-black shadow-[var(--shadow-hard-sm)] shrink-0">
            <Star size={20} />
          </div>
        </BrutalCard>

        {/* Page Views */}
        <BrutalCard className="p-4 flex items-center justify-between bg-surface relative">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-ink/65">Page Views</p>
            <p className="text-3xl font-black mt-1 leading-none">12.5K</p>
            <p className="text-[9px] font-black text-green-600 mt-1 flex items-center gap-0.5">
              <span>↑ 18% dari bulan lalu</span>
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-purple text-white shadow-[var(--shadow-hard-sm)] shrink-0">
            <Eye size={20} />
          </div>
        </BrutalCard>
      </div>

      {/* Main Grid content */}
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Projek Terbaru Table */}
          <BrutalCard className="overflow-hidden bg-surface">
            <div className="flex items-center justify-between border-b-2 border-border bg-purple/10 px-4 py-2.5">
              <SectionLabel color="purple">Projek Terbaru</SectionLabel>
              <Link
                href="/admin/projects"
                className="text-[9px] font-black uppercase hover:underline flex items-center gap-1 border border-border bg-surface px-2 py-0.5 shadow-[1px_1px_0_var(--color-border)]"
              >
                Semua Projek <ArrowUpRight size={10} />
              </Link>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border text-xxs font-black uppercase tracking-wider text-ink/60">
                      <th className="pb-2">Project</th>
                      <th className="pb-2 px-2">Kategori</th>
                      <th className="pb-2 px-2">Status</th>
                      <th className="pb-2 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-xs font-semibold text-ink/50">
                          Belum ada data project.
                        </td>
                      </tr>
                    ) : (
                      projects.map((project, idx) => {
                        const palette = accentPalettes[idx % accentPalettes.length];
                        const statusColors = {
                          PUBLISHED: "bg-green text-ink",
                          DRAFT: "bg-yellow text-ink",
                          ARCHIVED: "bg-gray-100 text-ink/70",
                        };

                        return (
                          <tr key={project.id} className="border-b border-border/20 hover:bg-gray-50/50">
                            <td className="py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className={`relative h-8 w-8 border-2 border-border bg-gradient-to-br ${palette} shrink-0`}>
                                  <div className="dot-pattern absolute inset-0.5 opacity-20" />
                                </div>
                                <div className="max-w-40">
                                  <p className="font-black text-xs truncate" title={project.title}>
                                    {project.title}
                                  </p>
                                  <p className="text-[9px] text-ink/60 truncate" title={project.description}>
                                    {project.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-2">
                              <span className="border border-border bg-purple/10 px-1.5 py-0.5 text-[8px] font-black uppercase text-purple-700">
                                {project.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-2">
                              <span className={`border border-border px-1.5 py-0.5 text-[8px] font-black uppercase ${statusColors[project.status] || "bg-surface"}`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-right">
                              <Link
                                href={`/admin/projects/${project.id}/edit`}
                                className="inline-flex h-6 w-6 items-center justify-center border-2 border-border bg-surface shadow-[1px_1px_0_var(--color-border)] hover:bg-yellow transition"
                                title="Edit Project"
                              >
                                <Pencil size={10} />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/admin/projects/new"
                  className="inline-flex items-center gap-1.5 border-2 border-border bg-purple px-3 py-1.5 text-xs font-black uppercase text-white shadow-[1px_1px_0_var(--color-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] transition"
                >
                  <Plus size={12} /> Tambah Project
                </Link>
              </div>
            </div>
          </BrutalCard>

          {/* Pesan Masuk */}
          <BrutalCard className="overflow-hidden bg-surface">
            <div className="flex items-center justify-between border-b-2 border-border bg-pink/10 px-4 py-2.5">
              <SectionLabel color="pink">Pesan Masuk</SectionLabel>
              <Link
                href="/admin/messages"
                className="text-[9px] font-black uppercase hover:underline flex items-center gap-1 border border-border bg-surface px-2 py-0.5 shadow-[1px_1px_0_var(--color-border)]"
              >
                Lihat Semua <ArrowUpRight size={10} />
              </Link>
            </div>
            <div className="p-4 space-y-2.5">
              {messages.length === 0 ? (
                <p className="text-xs font-semibold text-ink/50 py-3 text-center">Belum ada pesan masuk.</p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`border-2 border-border p-3 shadow-[var(--shadow-hard-sm)] flex gap-3 items-start ${
                      m.isRead ? "bg-surface" : "bg-pink/5 border-pink-400"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-gray-150 text-[10px] font-black shrink-0 shadow-[1px_1px_0_var(--color-border)]">
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-xs truncate">{m.name}</p>
                          <p className="text-[9px] font-bold text-ink/50 uppercase leading-none mt-0.5">{m.email}</p>
                        </div>
                        <p className="text-[9px] font-bold text-ink/65">{formatDate(m.createdAt)}</p>
                      </div>
                      <p className="text-[10px] font-bold text-ink/75 mt-1.5 truncate">Subjek: {m.subject}</p>
                      <p className="text-[10px] font-semibold text-ink/80 mt-1 line-clamp-1 italic">
                        &quot;{m.message}&quot;
                      </p>
                    </div>
                    {!m.isRead && (
                      <span className="h-2 w-2 rounded-full bg-pink border border-border shrink-0 mt-1.5 shadow-[1px_1px_0_var(--color-border)]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </BrutalCard>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Quick Content Editor */}
          <QuickEditorClient
            initialTitle={heroTitle}
            initialSubtitle={heroSubtitle}
            initialBio={aboutBio}
          />

          {/* Aktivitas Terbaru (Compact Vertical list) */}
          <BrutalCard className="overflow-hidden bg-surface">
            <div className="flex items-center justify-between border-b-2 border-border bg-cyan/10 px-4 py-2.5">
              <SectionLabel color="cyan">Aktivitas Terbaru</SectionLabel>
            </div>
            <div className="p-4 space-y-3 font-semibold text-xs">
              {/* Activity 1 */}
              <div className="flex items-start gap-3 border-b border-border/40 pb-2.5">
                <div className="h-6 w-6 rounded-full border border-border bg-green flex items-center justify-center text-ink shrink-0 shadow-[1px_1px_0_var(--color-border)]">
                  <Check size={12} />
                </div>
                <div>
                  <p className="text-[10px] leading-snug font-black text-ink">Project &quot;SaaS Landing Page&quot; dipublish.</p>
                  <span className="text-[8px] font-bold text-ink/55 flex items-center gap-0.5 mt-0.5"><Clock size={8} /> 10:30 WIB</span>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-3 border-b border-border/40 pb-2.5">
                <div className="h-6 w-6 rounded-full border border-border bg-purple flex items-center justify-center text-white shrink-0 shadow-[1px_1px_0_var(--color-border)]">
                  <Pencil size={12} />
                </div>
                <div>
                  <p className="text-[10px] leading-snug font-black text-ink">Konten &quot;About Me&quot; diperbarui.</p>
                  <span className="text-[8px] font-bold text-ink/55 flex items-center gap-0.5 mt-0.5"><Clock size={8} /> 16:20 WIB</span>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full border border-border bg-pink flex items-center justify-center text-ink shrink-0 shadow-[1px_1px_0_var(--color-border)]">
                  <Star size={12} />
                </div>
                <div>
                  <p className="text-[10px] leading-snug font-black text-ink">Testimoni baru dari Dimas Pratama.</p>
                  <span className="text-[8px] font-bold text-ink/55 flex items-center gap-0.5 mt-0.5"><Clock size={8} /> 15:10 WIB</span>
                </div>
              </div>
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
