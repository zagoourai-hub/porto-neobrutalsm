"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Sun, Moon } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#timeline", label: "Timeline" },
  { href: "#contact", label: "Contact" },
];

export function FloatingNavbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      const timer = setTimeout(() => {
        setTheme(isDark ? "dark" : "light");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      setTheme(isDark ? "dark" : "light");
    }
  };

  useGSAP(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0, x: "-50%" },
      { y: 0, opacity: 1, x: "-50%", duration: 1, ease: "back.out(1.2)", delay: 0.2 }
    );
  }, { scope: headerRef });

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <header
      ref={headerRef}
      className="fixed left-1/2 top-4 z-50 w-[min(100%-32px,1180px)] rounded-[var(--radius-pill)] border-[3px] border-border bg-surface px-4 py-3 shadow-[var(--shadow-hard-lg)] opacity-0"
    >
      <nav className="flex items-center justify-between gap-4">
        <Link href="#home" className="text-2xl font-black uppercase tracking-[-0.06em] text-ink">
          riszDev<span className="text-yellow">.</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex text-ink">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] px-4 py-2 text-xs font-black transition hover:bg-yellow first:bg-yellow"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Controls */}
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-surface shadow-[var(--shadow-hard-sm)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hard-md)] cursor-pointer text-ink"
            type="button"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <BrutalButton href="#contact" className="min-h-10 px-4 py-2">
            Let&apos;s Talk <ArrowUpRight aria-hidden size={18} />
          </BrutalButton>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-surface shadow-[var(--shadow-hard-sm)] cursor-pointer text-ink"
            type="button"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <button
            aria-label="Open navigation menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-yellow shadow-[var(--shadow-hard-sm)]"
            type="button"
          >
            <Menu aria-hidden size={22} className="text-ink" />
          </button>
        </div>
      </nav>
    </header>
  );
}
