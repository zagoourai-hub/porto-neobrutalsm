"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, MailOpen, Mail, Loader2, X } from "lucide-react";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import { formatDate } from "@/lib/format-date";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal detail state
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Action loading states
  const [actionId, setActionId] = useState<string | null>(null);



  useEffect(() => {
    let active = true;
    const runFetch = async () => {
      await Promise.resolve();
      if (!active) return;
      
      setLoading(true);
      try {
        const res = await fetch("/api/admin/messages");
        const data = await res.json();
        if (active && res.ok && data.success) {
          setMessages(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    runFetch();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
    setActionId(id);
    const newReadStatus = !currentReadStatus;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: newReadStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: newReadStatus } : m))
        );
        // If modal is open, update selected message read status too
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, isRead: newReadStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to toggle read status:", err);
    } finally {
      setActionId(null);
    }
  };

  const handleOpenDetail = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    // Auto-mark as read if opening an unread message
    if (!msg.isRead) {
      await handleToggleRead(msg.id, false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini secara permanen?")) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    } finally {
      setActionId(null);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-brutal text-4xl font-black uppercase text-ink">Messages</h1>
        <p className="text-sm font-semibold text-ink/70">Daftar pesan masuk dari form kontak pengunjung.</p>
      </div>

      {/* Search Bar */}
      <BrutalCard className="p-4 bg-surface shadow-[var(--shadow-hard-sm)]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
          <BrutalInput
            type="text"
            placeholder="Cari berdasarkan pengirim, subjek, email, atau isi pesan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12"
          />
        </div>
      </BrutalCard>

      {/* Messages List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-purple" size={40} />
        </div>
      ) : filteredMessages.length === 0 ? (
        <BrutalCard className="p-10 text-center font-bold bg-surface">
          <p className="text-xl">Tidak ada pesan masuk.</p>
        </BrutalCard>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden border-[3px] border-border bg-surface shadow-[var(--shadow-hard-md)] md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-[3px] border-border bg-yellow">
                  <th className="p-4 font-black text-sm uppercase w-12 text-center">Status</th>
                  <th className="p-4 font-black text-sm uppercase w-48">Pengirim</th>
                  <th className="p-4 font-black text-sm uppercase">Subjek / Isi</th>
                  <th className="p-4 font-black text-sm uppercase w-36">Tanggal</th>
                  <th className="p-4 font-black text-sm uppercase w-32 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                {filteredMessages.map((m) => (
                  <tr key={m.id} className={`hover:bg-yellow/5 ${!m.isRead ? "bg-pink/5" : ""}`}>
                    <td className="p-4 text-center">
                      {m.isRead ? (
                        <MailOpen size={18} className="mx-auto text-ink/40" />
                      ) : (
                        <Mail size={18} className="mx-auto text-pink" />
                      )}
                    </td>
                    <td className="p-4 font-bold text-sm">
                      <p>{m.name}</p>
                      <p className="text-[11px] font-semibold text-ink/55 truncate max-w-[180px]">{m.email}</p>
                    </td>
                    <td className="p-4 cursor-pointer" onClick={() => handleOpenDetail(m)}>
                      <p className={`text-sm ${!m.isRead ? "font-black" : "font-bold"}`}>{m.subject}</p>
                      <p className="text-xs font-semibold text-ink/65 line-clamp-1 mt-0.5">{m.message}</p>
                    </td>
                    <td className="p-4 font-bold text-xs text-ink/75">
                      {formatDate(m.createdAt)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleRead(m.id, m.isRead)}
                        disabled={actionId === m.id}
                        className="inline-flex h-9 w-9 items-center justify-center border-2 border-border bg-surface shadow-[2px_2px_0_var(--color-border)] hover:bg-yellow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] transition cursor-pointer disabled:opacity-50"
                        title={m.isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                      >
                        {m.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={actionId === m.id}
                        className="inline-flex h-9 w-9 items-center justify-center border-2 border-border bg-pink shadow-[2px_2px_0_var(--color-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] transition cursor-pointer disabled:opacity-50"
                        title="Hapus"
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
            {filteredMessages.map((m) => (
              <BrutalCard
                key={m.id}
                className={`p-4 bg-surface ${!m.isRead ? "border-pink" : "bg-surface"}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase bg-cyan border-2 border-border px-2 py-0.5 shadow-[1px_1px_0_var(--color-border)]">
                      {m.name}
                    </span>
                    <h3 className={`text-base leading-tight mt-3 ${!m.isRead ? "font-black" : "font-bold"}`} onClick={() => handleOpenDetail(m)}>
                      {m.subject}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-ink/50">{formatDate(m.createdAt)}</span>
                </div>
                <p className="text-xs font-semibold text-ink/75 mt-3 line-clamp-2 leading-relaxed" onClick={() => handleOpenDetail(m)}>
                  {m.message}
                </p>

                <div className="mt-4 flex justify-end gap-3 border-t-2 border-border pt-3">
                  <button
                    onClick={() => handleToggleRead(m.id, m.isRead)}
                    disabled={actionId === m.id}
                    className="flex-1 min-h-10 text-xs font-black border-2 border-border bg-surface flex items-center justify-center gap-1 shadow-[2px_2px_0_var(--color-border)] cursor-pointer disabled:opacity-50"
                  >
                    {m.isRead ? "Belum Dibaca" : "Sudah Dibaca"}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={actionId === m.id}
                    className="flex-1 min-h-10 text-xs font-black border-2 border-border bg-pink flex items-center justify-center gap-1 shadow-[2px_2px_0_var(--color-border)] cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </BrutalCard>
            ))}
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-lg">
            <BrutalCard className="p-6 bg-surface shadow-[var(--shadow-hard-lg)] relative">
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute right-4 top-4 h-8 w-8 border-2 border-border bg-surface flex items-center justify-center shadow-[1px_1px_0_var(--color-border)] hover:bg-yellow cursor-pointer"
              >
                <X size={16} />
              </button>
              
              <SectionLabel color="cyan">Detail Pesan Klien</SectionLabel>

              <div className="mt-6 space-y-4 font-bold text-sm">
                <div className="border-b-2 border-border pb-3">
                  <span className="text-xs font-black uppercase text-ink/50 block mb-1">Pengirim</span>
                  <span className="text-base font-black">{selectedMessage.name}</span>
                  <span className="text-xs font-semibold text-ink/75 block mt-0.5">{selectedMessage.email}</span>
                </div>

                <div className="border-b-2 border-border pb-3">
                  <span className="text-xs font-black uppercase text-ink/50 block mb-1">Subjek</span>
                  <span className="text-sm font-black">{selectedMessage.subject}</span>
                </div>

                <div>
                  <span className="text-xs font-black uppercase text-ink/50 block mb-1">Isi Pesan</span>
                  <p className="text-xs font-semibold text-ink/80 bg-yellow/5 border-2 border-border p-4 rounded-[var(--radius-sm)] leading-relaxed min-h-24 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="text-[10px] text-ink/50 text-right pt-2">
                  Diterima: {formatDate(selectedMessage.createdAt)}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t-2 border-border pt-4">
                <button
                  onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.isRead)}
                  className="min-h-11 px-4 border-2 border-border bg-surface font-bold text-sm shadow-[2px_2px_0_var(--color-border)] hover:bg-yellow/10 cursor-pointer"
                >
                  Tandai {selectedMessage.isRead ? "Belum" : "Sudah"} Dibaca
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="min-h-11 px-4 border-2 border-border bg-pink font-bold text-sm text-ink shadow-[2px_2px_0_var(--color-border)] hover:bg-pink-600 cursor-pointer"
                >
                  Hapus Pesan
                </button>
              </div>
            </BrutalCard>
          </div>
        </div>
      )}
    </div>
  );
}
