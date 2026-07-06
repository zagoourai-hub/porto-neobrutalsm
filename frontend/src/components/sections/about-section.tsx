"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { aboutIcon, stats } from "@/lib/landing-data";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutIcon = aboutIcon;

const statAccentClasses = {
  yellow: "bg-yellow text-black",
  cyan: "bg-cyan text-black",
  pink: "bg-pink text-black",
  purple: "bg-purple text-white",
} as const;

interface AboutSectionProps {
  content?: Record<string, { value: string; type: string }>;
}

export function AboutSection({ content }: AboutSectionProps) {
  const bio = content?.["about.bio"]?.value || "Saya seorang Fullstack Developer dan UI/UX Designer yang berfokus pada pembuatan website dan aplikasi modern dengan performa tinggi dan pengalaman pengguna terbaik.";

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".about-bio-card",
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-bio-card",
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      }
    );

    gsap.fromTo(
      ".about-stat-card",
      { scale: 0.8, opacity: 0, y: 30 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".about-stat-card",
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about" className="brutal-container grid gap-5 py-5 lg:grid-cols-[2fr_repeat(4,1fr)]">
      <BrutalCard className="about-bio-card relative overflow-hidden p-6 opacity-0">
        <SectionLabel color="cyan">Tentang Saya</SectionLabel>
        <div className="mt-6 flex gap-5">
          <div className="shrink-0 text-yellow">
            <AboutIcon aria-hidden size={48} />
          </div>
          <p className="max-w-md text-base font-semibold leading-7">
            {bio}
          </p>
        </div>
        <BrutalButton href="#contact" className="mt-6 min-h-10 px-4 py-2" variant="secondary">
          Selengkapnya <ArrowUpRight aria-hidden size={16} />
        </BrutalButton>
        <div className="absolute bottom-0 right-0 h-20 w-20 bg-purple" aria-hidden="true" />
      </BrutalCard>

      {stats.map(({ value, label, accent, Icon }) => (
        <BrutalCard key={label} className="about-stat-card p-5 text-center opacity-0">
          <p className="text-6xl font-black leading-none">{value}</p>
          <div className={`mx-auto my-4 h-1.5 w-16 ${statAccentClasses[accent]}`} />
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${statAccentClasses[accent]}`}>
            <Icon aria-hidden size={28} />
          </div>
          <p className="text-sm font-black uppercase leading-tight">{label}</p>
        </BrutalCard>
      ))}
    </section>
  );
}
