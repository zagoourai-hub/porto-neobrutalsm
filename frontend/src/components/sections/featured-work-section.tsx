"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects as staticProjects } from "@/lib/landing-data";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const accentClasses = {
  purple: "bg-purple text-white",
  cyan: "bg-cyan text-ink",
  pink: "bg-pink text-ink",
} as const;

const accentPalettes = [
  { accent: "purple", gradient: "from-purple/30 via-surface to-purple/10" },
  { accent: "cyan", gradient: "from-cyan/30 via-surface to-blue-100" },
  { accent: "pink", gradient: "from-pink/30 via-surface to-red/10" },
] as const;

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  demoUrl?: string | null;
  repositoryUrl?: string | null;
}

interface FeaturedWorkSectionProps {
  projects?: Project[];
}

export function FeaturedWorkSection({ projects }: FeaturedWorkSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".project-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, { scope: containerRef });
  // If undefined, fallback to static
  const displayProjects = projects ?? staticProjects.map((p, idx) => ({
    id: `static-${idx}`,
    title: p.title,
    slug: p.title.toLowerCase().replace(/ /g, "-"),
    description: p.description,
    category: p.category,
    demoUrl: "#",
    repositoryUrl: "#",
  }));

  return (
    <section ref={containerRef} id="work" className="brutal-container py-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <SectionLabel color="pink">Featured Work</SectionLabel>
        <BrutalButton href="#work" className="hidden min-h-10 px-4 py-2 sm:inline-flex" variant="secondary">
          Lihat Semua Project <ArrowUpRight aria-hidden size={16} />
        </BrutalButton>
      </div>

      {displayProjects.length === 0 ? (
        <BrutalCard className="p-10 text-center font-bold bg-surface shadow-[var(--shadow-hard-md)]">
          <p className="text-xl">Belum ada project yang ditampilkan.</p>
        </BrutalCard>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {displayProjects.map((project, idx) => {
            const palette = accentPalettes[idx % accentPalettes.length];
            return (
              <BrutalCard key={project.id} className="project-card overflow-hidden opacity-0">
                <div className={`relative h-40 border-b-2 border-border bg-gradient-to-br ${palette.gradient}`}>
                  <div className="dot-pattern absolute inset-4 opacity-30" />
                  <span className={`absolute left-4 top-4 border-2 border-border px-3 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0_var(--color-border)] ${accentClasses[palette.accent]}`}>
                    {project.category}
                  </span>
                  <div className="absolute bottom-5 left-5 right-5 h-16 border-2 border-border bg-surface/90 shadow-[var(--shadow-hard-sm)]" />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4 p-5">
                  <div>
                    <h2 className="text-xl font-black">{project.title}</h2>
                    <p className="mt-2 text-sm font-semibold leading-6">{project.description}</p>
                  </div>
                  <a
                    aria-label={`Lihat project ${project.title}`}
                    className="flex h-12 w-12 items-center justify-center border-2 border-border bg-surface shadow-[var(--shadow-hard-sm)] transition hover:bg-yellow"
                    href={project.demoUrl || project.repositoryUrl || "#"}
                    target={project.demoUrl || project.repositoryUrl ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    <ArrowUpRight aria-hidden size={24} />
                  </a>
                </div>
              </BrutalCard>
            );
          })}
        </div>
      )}
    </section>
  );
}
