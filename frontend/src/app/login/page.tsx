"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Semua kolom wajib diisi.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error?.message || "Login gagal.");
      }

      setStatus("success");
      
      // Force reload or redirect to /admin to let middleware check
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus("error");
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan koneksi.";
      setErrorMessage(msg);
    }
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <BrutalButton href="/" variant="secondary" className="px-4 py-2 text-xs">
            <ArrowLeft size={14} className="mr-2" /> Kembali ke Beranda
          </BrutalButton>
        </div>

        <BrutalCard className="bg-surface p-6 shadow-[var(--shadow-hard-lg)]">
          <div className="text-center">
            <SectionLabel color="yellow" className="mx-auto block w-fit">
              ADMIN ACCESS
            </SectionLabel>
            <h1 className="heading-brutal mt-4 text-4xl font-black uppercase text-ink">
              Sign In
            </h1>
            <p className="mt-2 text-sm font-semibold text-ink/70">
              Masukkan kredensial untuk masuk ke dasbor administrator.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {status === "success" && (
              <div className="border-[3px] border-border bg-yellow p-3 font-bold text-ink shadow-[var(--shadow-hard-sm)]">
                🎉 Login sukses! Mengarahkan...
              </div>
            )}
            
            {status === "error" && (
              <div className="border-[3px] border-border bg-pink p-3 font-bold text-ink shadow-[var(--shadow-hard-sm)]">
                🚨 {errorMessage}
              </div>
            )}

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
                <BrutalInput
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@riszdev.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                  className="pl-12"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
                <BrutalInput
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                  className="pl-12"
                />
              </div>
            </div>

            <BrutalButton
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full min-h-12 py-3 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Otentikasi...
                </>
              ) : (
                <>
                  Masuk Dasbor <ArrowRight size={18} />
                </>
              )}
            </BrutalButton>
          </form>
        </BrutalCard>
      </div>
    </main>
  );
}
