"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";

const navigationLinks = ["Home", "About", "Work", "Services", "Timeline", "Contact"];
const serviceLinks = [
  "Web Development",
  "UI/UX Design",
  "API & Integration",
  "Performance Optimization",
];
const socialLinks = ["GitHub", "LinkedIn", "Instagram", "Twitter"];

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <footer className="brutal-container mb-6 mt-1 border-[3px] border-border bg-surface shadow-[var(--shadow-hard-md)]">
      <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr_1fr_1fr]">
        <div>
          <p className="text-3xl font-black uppercase tracking-[-0.06em]">
            riszDev<span className="text-yellow">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm font-semibold leading-6">
            Membuat ide menjadi produk digital yang berdampak.
          </p>
          <p className="mt-4 text-xs font-bold">© 2025 RISZDEV. All rights reserved.</p>
        </div>

        <FooterColumn title="Navigasi">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {navigationLinks.map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase() === "home" ? "home" : label.toLowerCase()}`}
                className="text-xs font-bold hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </FooterColumn>

        <FooterColumn title="Layanan">
          {serviceLinks.map((label) => (
            <Link key={label} href="#services" className="block text-xs font-bold hover:underline">
              {label}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title="Kontak">
          <p className="flex items-center gap-2 text-xs font-bold">
            <Mail aria-hidden size={14} /> hello@riszdev.dev
          </p>
          <p className="flex items-center gap-2 text-xs font-bold">
            <Phone aria-hidden size={14} /> +62 819-9751-1185
          </p>
          <p className="flex items-center gap-2 text-xs font-bold">
            <MapPin aria-hidden size={14} /> Indonesia
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {socialLinks.map((label) => (
              <Link
                key={label}
                href="#contact"
                className="border-2 border-border bg-ink px-2 py-1 text-[10px] font-black text-surface"
              >
                {label.slice(0, 2).toUpperCase()}
              </Link>
            ))}
          </div>
        </FooterColumn>
      </div>
    </footer>
  );
}

function FooterColumn({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="border-l-2 border-border pl-5">
      <p className="mb-3 text-xs font-black uppercase">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
