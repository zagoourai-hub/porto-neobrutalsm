"use client";

import { useState, useRef, type FormEvent } from "react";
import { ArrowUpRight, Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import { SectionLabel } from "@/components/ui/section-label";
import { contactMessageSchema } from "@/lib/schemas/contact.schema";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SiteSetting {
  siteTitle: string;
  siteDescription: string;
  contactEmail?: string | null;
  phoneNumber?: string | null;
  whatsappNumber?: string | null;
  socialLinks?: unknown;
}

interface ContactSectionProps {
  settings?: SiteSetting | null;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".contact-card",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-card",
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, { scope: containerRef });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fallbacks
  const email = settings?.contactEmail || "hello@riszdev.dev";
  const phone = settings?.phoneNumber || "+62 819-9751-1185";
  const address = "Indonesia";

  // Social links fallback
  const rawSocials = (settings?.socialLinks || {}) as Record<string, string>;
  const socialLinks = {
    GH: rawSocials.github || "https://github.com/riszdev",
    LN: rawSocials.linkedin || "https://linkedin.com/in/riszdev",
    X: rawSocials.twitter || "https://twitter.com/riszdev",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
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

    // Client-side Zod validation
    const parsed = contactMessageSchema.safeParse(formData);
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok) {
        if (resData.error?.code === "VALIDATION_ERROR" && resData.error.details) {
          // Format server validation errors
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
        throw new Error(resData.error?.message || "Gagal mengirim pesan.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
      const msg = error instanceof Error ? error.message : "Koneksi terganggu. Silakan coba kembali.";
      setErrorMessage(msg);
    }
  };

  return (
    <section ref={containerRef} id="contact" className="brutal-container py-5">
      <div className="contact-card grid gap-6 border-[3px] border-border bg-surface p-6 shadow-[var(--shadow-hard-md)] lg:grid-cols-[1fr_1.25fr_0.9fr] opacity-0">
        <div>
          <h2 className="heading-brutal text-5xl font-black sm:text-6xl">
            Punya Projek Menarik?
          </h2>
          <div className="my-4 h-1.5 w-44 bg-pink" />
          <p className="text-base font-semibold leading-7">
            Saya selalu terbuka untuk peluang baru dan kolaborasi yang berdampak.
          </p>
          <BrutalButton href={`mailto:${email}`} className="mt-5">
            Ayo Berkolaborasi <ArrowUpRight aria-hidden size={18} />
          </BrutalButton>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 border-y-2 border-border py-4 lg:border-x-2 lg:border-y-0 lg:px-6 lg:py-0">
          {status === "success" && (
            <div className="border-[3px] border-border bg-yellow p-4 font-black shadow-[var(--shadow-hard-sm)]">
              🎉 Pesan sukses dikirim! Terima kasih telah menghubungi saya.
            </div>
          )}
          {status === "error" && (
            <div className="border-[3px] border-border bg-pink p-4 font-black shadow-[var(--shadow-hard-sm)] text-ink">
              🚨 Error: {errorMessage}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="sr-only" htmlFor="name">Nama Lengkap</label>
              <BrutalInput
                id="name"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleInputChange}
                disabled={status === "loading"}
                className={fieldErrors.name ? "border-pink focus:border-pink" : ""}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.name}</p>
              )}
            </div>
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <BrutalInput
                id="email"
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={status === "loading"}
                className={fieldErrors.email ? "border-pink focus:border-pink" : ""}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.email}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="sr-only" htmlFor="subject">Subjek</label>
            <BrutalInput
              id="subject"
              name="subject"
              placeholder="Subjek"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={status === "loading"}
              className={fieldErrors.subject ? "border-pink focus:border-pink" : ""}
            />
            {fieldErrors.subject && (
              <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.subject}</p>
            )}
          </div>

          <div>
            <label className="sr-only" htmlFor="message">Pesan Anda</label>
            <BrutalTextarea
              id="message"
              name="message"
              placeholder="Pesan Anda"
              value={formData.message}
              onChange={handleInputChange}
              disabled={status === "loading"}
              className={fieldErrors.message ? "border-pink focus:border-pink" : ""}
            />
            {fieldErrors.message && (
              <p className="mt-1 text-xs font-bold text-pink-700">{fieldErrors.message}</p>
            )}
          </div>

          <BrutalButton
            type="submit"
            disabled={status === "loading"}
            className="w-fit min-h-12 px-6 py-2 flex items-center gap-2 justify-center"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Mengirim...
              </>
            ) : (
              <>
                Kirim Pesan <ArrowUpRight aria-hidden size={16} />
              </>
            )}
          </BrutalButton>
        </form>

        <div className="space-y-5">
          <div>
            <SectionLabel color="purple">Info Kontak</SectionLabel>
            <div className="mt-4 space-y-3 text-sm font-bold">
              <p className="flex items-center gap-3"><Mail aria-hidden size={18} /> {email}</p>
              <p className="flex items-center gap-3"><Phone aria-hidden size={18} /> {phone}</p>
              <p className="flex items-center gap-3"><MapPin aria-hidden size={18} /> {address}</p>
            </div>
          </div>
          <div>
            <SectionLabel color="cyan">Ikuti Saya</SectionLabel>
            <div className="mt-4 flex gap-3">
              {Object.entries(socialLinks).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center border-2 border-border bg-ink text-xs font-black text-surface shadow-[var(--shadow-hard-sm)] transition hover:bg-yellow hover:text-ink"
                >
                  {key}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
